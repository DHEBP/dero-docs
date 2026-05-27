#!/usr/bin/env node
/**
 * Port the agent-ready surfaces from derod-main to a sibling site.
 *
 * Reusable across tela-main, hologram-main, deropay-main, and any future
 * sibling Nextra app in this monorepo. Idempotent — safe to re-run.
 *
 * Mechanical work only:
 *   1. Copies lib/mdx-to-md.ts and app/llm-digest/[...slug]/route.ts
 *      from derod-main into the target site (overwrites if newer).
 *   2. Patches next.config.js to add the `/:path*.md` → `/llm-digest/:path*`
 *      rewrite (idempotent — detects existing).
 *   3. Patches tsconfig.json to add the `@/*` paths alias.
 *   4. Appends scripts/__output__/ to .gitignore (for the prototype if
 *      ever copied locally).
 *
 * Site-specific content (llms.txt, agents.md, SKILL.md,
 * .well-known/mcp-server-card.json) is generated separately per site —
 * not by this script — because the content varies by product.
 *
 * Run:  node scripts/port-agent-ready.mjs <site-dir>
 *   e.g. node scripts/port-agent-ready.mjs tela-main
 */

import { copyFile, mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(__dirname, '..')
const SOURCE_SITE = path.join(MONOREPO, 'derod-main')

const SITE = process.argv[2]
if (!SITE) {
  console.error('Usage: node scripts/port-agent-ready.mjs <site-dir>')
  process.exit(1)
}
const TARGET = path.join(MONOREPO, SITE)

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function copyIfChanged(rel) {
  const src = path.join(SOURCE_SITE, rel)
  const dst = path.join(TARGET, rel)
  await mkdir(path.dirname(dst), { recursive: true })
  const srcContent = await readFile(src, 'utf-8')
  let dstContent = ''
  try {
    dstContent = await readFile(dst, 'utf-8')
  } catch {}
  if (srcContent === dstContent) {
    console.log(`  ✓ ${rel} (unchanged)`)
    return
  }
  await writeFile(dst, srcContent, 'utf-8')
  console.log(`  ✓ ${rel} (${dstContent ? 'updated' : 'created'})`)
}

async function patchNextConfig() {
  const file = path.join(TARGET, 'next.config.js')
  const text = await readFile(file, 'utf-8')
  if (text.includes("rewrites:") && text.includes("/llm-digest/")) {
    console.log('  ✓ next.config.js rewrite already present')
    return
  }
  // Insert a rewrites: [...] entry after the redirects: [...] block,
  // OR right before the final }))) if no redirects block exists.
  const REWRITE_BLOCK = `  rewrites: () => [
    {
      // Per-page Markdown mirrors: /<path>.md → App Router route handler.
      source: '/:path*.md',
      destination: '/llm-digest/:path*'
    }
  ]`
  let updated
  if (/redirects:\s*\(\)\s*=>\s*\[/.test(text)) {
    updated = text.replace(
      /(redirects:\s*\(\)\s*=>\s*\[[\s\S]*?\n\s*\])([\s\S]*?\}\)+)$/m,
      (_m, redirectsBlock, tail) => `${redirectsBlock},\n${REWRITE_BLOCK}${tail}`,
    )
  } else {
    // No redirects block — inject right before the closing }))) chain.
    // The preceding line is some `}` (closing the last config property);
    // prepend a comma so the new property is valid JS.
    updated = text.replace(
      /\n(\}\)+\)\s*)$/m,
      (_m, close) => `,\n${REWRITE_BLOCK}\n${close}`,
    )
  }
  if (updated === text) {
    console.warn('  ⚠ next.config.js — could not find injection point, please patch manually')
    return
  }
  await writeFile(file, updated, 'utf-8')
  console.log('  ✓ next.config.js (rewrite added)')
}

async function patchTsconfig() {
  const file = path.join(TARGET, 'tsconfig.json')
  const text = await readFile(file, 'utf-8')
  if (text.includes('"@/*"')) {
    console.log('  ✓ tsconfig.json @/* alias already present')
    return
  }
  // Case 1: existing "paths" block — extend it.
  if (/"paths":\s*\{/.test(text)) {
    const updated = text.replace(
      /"paths":\s*\{([^}]*)\}/,
      (_m, inner) => {
        const trimmed = inner.trim()
        const sep = trimmed.endsWith(',') ? '' : ','
        return `"paths": {${inner.replace(/\s*$/, '')}${sep}\n      "@/*": ["*"]\n    }`
      },
    )
    if (updated === text) {
      console.warn('  ⚠ tsconfig.json — paths regex did not match, please patch manually')
      return
    }
    await writeFile(file, updated, 'utf-8')
    console.log('  ✓ tsconfig.json (@/* alias added to existing paths block)')
    return
  }
  // Case 2: no paths block — inject one. Also ensure baseUrl is set.
  let updated = text
  if (!/"baseUrl"/.test(updated)) {
    updated = updated.replace(
      /"compilerOptions":\s*\{/,
      `"compilerOptions": {\n    "baseUrl": ".",`,
    )
  }
  // Insert paths block right before the closing `}` of compilerOptions.
  updated = updated.replace(
    /("compilerOptions":\s*\{[\s\S]*?)(\n\s*\})/,
    (_m, head, tail) =>
      `${head},\n    "paths": {\n      "@/*": ["*"]\n    }${tail}`,
  )
  if (updated === text) {
    console.warn('  ⚠ tsconfig.json — could not inject paths block, please patch manually')
    return
  }
  await writeFile(file, updated, 'utf-8')
  console.log('  ✓ tsconfig.json (baseUrl + paths block created)')
}

async function patchGitignore() {
  const file = path.join(TARGET, '.gitignore')
  if (!(await exists(file))) {
    console.log('  ⚠ .gitignore not found, skipping (site may inherit from monorepo)')
    return
  }
  const text = await readFile(file, 'utf-8')
  if (text.includes('scripts/__output__/')) {
    console.log('  ✓ .gitignore already has scripts/__output__/')
    return
  }
  await writeFile(
    file,
    text + (text.endsWith('\n') ? '' : '\n') + '\n# MDX→.md prototype output (scratch — not part of build)\n/scripts/__output__/\n',
    'utf-8',
  )
  console.log('  ✓ .gitignore (scripts/__output__/ added)')
}

async function main() {
  if (!(await exists(TARGET))) {
    console.error(`Target site not found: ${TARGET}`)
    process.exit(1)
  }
  console.log(`Porting agent-ready surfaces → ${SITE}\n`)
  await copyIfChanged('lib/mdx-to-md.ts')
  await copyIfChanged('app/llm-digest/[...slug]/route.ts')
  // SKILL.md describes the dero-mcp-server tool surface — identical across
  // all four sibling sites. Same with mcp-server-card.json (the MCP package
  // is one; each site just co-hosts the descriptor).
  await copyIfChanged('public/SKILL.md')
  await copyIfChanged('public/.well-known/mcp-server-card.json')
  await patchNextConfig()
  await patchTsconfig()
  await patchGitignore()
  console.log(`\nMechanical port complete for ${SITE}.`)
  console.log('Next: write site-specific public/llms.txt, public/agents.md,')
  console.log('public/SKILL.md, public/.well-known/mcp-server-card.json.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
