#!/usr/bin/env node
/**
 * CI guard: keep Hologram's documented API surface in sync with the
 * Wails-bound Go App methods.
 *
 * The drift problem: hologram-main/pages/api-reference.mdx (and the
 * API sections of sibling docs) document Go method names/signatures by
 * hand, while frontend/wailsjs/go/main/App.d.ts is auto-generated and
 * authoritative. Methods get renamed, removed, or never existed — and
 * the hand-written docs keep claiming them.
 *
 * What this does:
 *   1. Parses App.d.ts for every `export function <Name>(...)` — the
 *      authoritative set of Wails-bound App methods.
 *   2. Scans the hologram docs .mdx files for tokens that look like a
 *      documented bound-API call: a bare PascalCase `Method(` at a line
 *      start inside a code block, or inline as `Method(...) -> ` /
 *      `Method(...) <returnType>`. PascalCase + bare-call filtering keeps
 *      out DVM built-ins (SIGNER, STORE), member calls (wallet.Foo()),
 *      and `func`/`new`/`class` definitions. A small, documented IGNORE
 *      list covers the known non-App references that legitimately appear
 *      (XSWD wallet methods, internal Go helpers, JS globals/SDK types).
 *   3. Reports any DOCUMENTED method that is NOT in App.d.ts — the
 *      dangerous case: documenting a method that does not exist.
 *   4. (Informational) lists bound methods never mentioned in the docs.
 *
 * Exit: 1 if any documented method is missing from App.d.ts (gates CI /
 * pre-commit). 0 otherwise. Informational under-documentation never fails.
 *
 * App.d.ts lives in the HOLOGRAM-git checkout, which is a SEPARATE repo
 * from these docs. Point HOLOGRAM_APP_DTS at it, or rely on the default
 * sibling path. If the file is not present, the guard prints a NOTE and
 * passes (so CI without the source checked out stays green) — the same
 * posture validate-boundaries.sh takes for the absent internal docs dir.
 *
 * Run:
 *   node scripts/check-api-reference-parity.mjs
 *   HOLOGRAM_APP_DTS=/path/to/App.d.ts node scripts/check-api-reference-parity.mjs
 *   node scripts/check-api-reference-parity.mjs --quiet   # suppress the
 *                                                         # informational list
 */

import { readFile, access, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(__dirname, '..')

// Docs we treat as documenting the bound API surface.
const DOCS_DIR = path.join(MONOREPO, 'hologram-main', 'pages')

// Authoritative source of truth. It lives in the HOLOGRAM-git repo, a
// sibling checkout of this docs repo by default. Override with the env var.
const DEFAULT_APP_DTS = path.resolve(
  MONOREPO,
  '..',
  'HOLOGRAM-git',
  'frontend',
  'wailsjs',
  'go',
  'main',
  'App.d.ts',
)
const APP_DTS = process.env.HOLOGRAM_APP_DTS
  ? path.resolve(process.env.HOLOGRAM_APP_DTS)
  : DEFAULT_APP_DTS

const QUIET = process.argv.includes('--quiet')

/**
 * Tokens that look like a bound API call in the docs but are deliberately
 * NOT Wails-bound App methods. Keep this list small and explained — every
 * entry is a thing a reader could mistake for an App binding but isn't.
 * If a NEW entry is ever needed, that is a signal to double-check it
 * really isn't (or shouldn't be) a bound method before silencing it.
 */
const IGNORE = new Map([
  // XSWD wallet protocol methods, routed in xswd_router.go — not App bindings.
  ['AttemptEPOCHWithAddr', 'XSWD wallet method (xswd_router.go), not a Wails App binding'],
  // Package-level Go helpers in proof_validation.go, documented as internal
  // signatures under "Proof Validation" — invoked in-process, not bound.
  ['ValidatePayloadProofAmount', 'internal Go helper (proof_validation.go), not bound'],
  ['ValidatePayloadProofAmountWithContext', 'internal Go helper (proof_validation.go), not bound'],
  ['DetectSuspiciousProofPatterns', 'internal Go helper (proof_validation.go), not bound'],
  // DVM-BASIC smart-contract built-ins shown in contract snippets.
  ['Deposit', 'example DVM contract function, not a Hologram API method'],
  // JS/SDK identifiers that appear in browser/SDK examples.
  ['DeroAuthSigner', 'dero-auth SDK class (new DeroAuthSigner{...}), not a Go method'],
  ['WebSocket', 'JS global, not a Go method'],
  ['Error', 'JS global, not a Go method'],
])

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/** Authoritative bound method names from App.d.ts. */
async function parseBoundMethods(file) {
  const src = await readFile(file, 'utf8')
  const set = new Set()
  const re = /^export function ([A-Za-z_][A-Za-z0-9_]*)\s*\(/gm
  let m
  while ((m = re.exec(src)) !== null) set.add(m[1])
  return set
}

/**
 * Is `name` a plausible *bound-API* method token? PascalCase (leading
 * uppercase + at least one lowercase letter) rules out all-caps DVM
 * built-ins (SIGNER, STORE, LOAD, ASSETVALUE, ...). The caller has
 * already ensured it is a bare call (not preceded by `.`).
 */
function looksLikeApiMethod(name) {
  return /^[A-Z]/.test(name) && /[a-z]/.test(name)
}

/**
 * Extract documented method names from one .mdx file.
 * Returns a Map<name, Set<lineNumbers>> for nice reporting.
 *
 * A token counts as a documented bound-API call when it is a PascalCase
 * `Name(` — with NO space before the paren — that is:
 *   - NOT preceded by `.`        (excludes wallet.Get_Balance(), obj.Foo())
 *   - NOT preceded by `func `    (excludes `func Foo(...) {` Go definitions)
 *   - NOT preceded by `new `     (excludes `new DeroAuthSigner({...})`)
 *   - NOT inside a longer identifier (word boundary on the left)
 *
 * The no-space rule is what separates a code signature (`Method(args)`)
 * from English prose (`Developer Support (EPOCH)`, `Green (+)`,
 * `Linux (glibc 2.17+)`): code never puts a space before its open paren,
 * markdown headers and bullet text almost always do.
 */
function extractDocumentedMethods(text) {
  const found = new Map()
  const lines = text.split('\n')
  // Capture an optional 1-char left context so we can reject `.Foo(`.
  // No `\s*` before `(` — prose like `Word (aside)` must NOT match.
  const re = /(^|[^A-Za-z0-9_.])([A-Z][A-Za-z0-9_]*)\(/g
  lines.forEach((line, i) => {
    // Skip Go function definitions and JS constructors wholesale.
    let m
    while ((m = re.exec(line)) !== null) {
      const left = m[1]
      const name = m[2]
      const upToMatch = line.slice(0, m.index + left.length)
      if (/\bfunc\s*$/.test(upToMatch)) continue
      if (/\bnew\s+$/.test(upToMatch)) continue
      if (/\bclass\s+$/.test(upToMatch)) continue
      if (!looksLikeApiMethod(name)) continue
      if (!found.has(name)) found.set(name, new Set())
      found.get(name).add(i + 1)
    }
  })
  return found
}

async function listMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.mdx'))
    .map((e) => path.join(dir, e.name))
}

async function main() {
  console.log('==> Checking Hologram api-reference parity with App.d.ts')
  console.log(`Docs:  ${DOCS_DIR}`)
  console.log(`Bound: ${APP_DTS}`)
  console.log()

  if (!(await exists(APP_DTS))) {
    console.log(
      'NOTE: Wails bindings not found at the path above (HOLOGRAM-git not\n' +
        '      checked out here). Set HOLOGRAM_APP_DTS to enable the check.\n' +
        '      Skipping — passing so CI without the source stays green.',
    )
    process.exit(0)
  }

  const bound = await parseBoundMethods(APP_DTS)
  console.log(`Found ${bound.size} bound App methods in App.d.ts.`)

  const files = await listMdxFiles(DOCS_DIR)

  // name -> [{ file, lines: Set }]
  const documented = new Map()
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    const perFile = extractDocumentedMethods(text)
    for (const [name, lineSet] of perFile) {
      if (!documented.has(name)) documented.set(name, [])
      documented.get(name).push({ file: path.basename(file), lines: lineSet })
    }
  }
  console.log(
    `Found ${documented.size} distinct documented method tokens across ${files.length} .mdx files.`,
  )
  console.log()

  // 1) The dangerous case: documented but not bound.
  const missing = []
  for (const [name, refs] of documented) {
    if (bound.has(name)) continue
    if (IGNORE.has(name)) continue
    missing.push({ name, refs })
  }
  missing.sort((a, b) => a.name.localeCompare(b.name))

  // 2) Informational: bound but never documented.
  const documentedNames = new Set(documented.keys())
  const undocumented = [...bound]
    .filter((n) => !documentedNames.has(n))
    .sort((a, b) => a.localeCompare(b))

  if (missing.length === 0) {
    console.log('PASS: every documented method exists in App.d.ts.')
    const ignoredHits = [...documented.keys()].filter((n) => IGNORE.has(n))
    if (ignoredHits.length && !QUIET) {
      console.log()
      console.log(
        `(Ignored ${ignoredHits.length} known non-App reference${
          ignoredHits.length === 1 ? '' : 's'
        }: ${ignoredHits.sort().join(', ')})`,
      )
    }
  } else {
    console.log(
      `FAIL: ${missing.length} documented method${
        missing.length === 1 ? '' : 's'
      } not found in App.d.ts:`,
    )
    console.log()
    for (const { name, refs } of missing) {
      const where = refs
        .map((r) => `${r.file}:${[...r.lines].sort((a, b) => a - b).join(',')}`)
        .join('  ')
      console.log(`  - ${name}()   ${where}`)
    }
    console.log()
    console.log(
      'These methods are documented but do not exist as Wails-bound App\n' +
        'methods. Either fix the docs, or — if a name is intentionally not a\n' +
        'binding — add it to the IGNORE list in this script with a reason.',
    )
  }

  if (!QUIET) {
    console.log()
    console.log(
      `Informational: ${undocumented.length} bound method${
        undocumented.length === 1 ? '' : 's'
      } not mentioned in the docs.`,
    )
    if (undocumented.length) {
      const preview = undocumented.slice(0, 40)
      for (const n of preview) console.log(`  · ${n}()`)
      if (undocumented.length > preview.length) {
        console.log(`  … and ${undocumented.length - preview.length} more.`)
      }
    }
  }

  console.log()
  process.exit(missing.length === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('check-api-reference-parity: unexpected error')
  console.error(err)
  process.exit(2)
})
