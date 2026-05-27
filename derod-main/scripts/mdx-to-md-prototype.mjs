#!/usr/bin/env node
/**
 * Prototype: MDX → clean Markdown emitter for the .md mirror feature.
 *
 * Strategy: regex-based surgical transformations on the file text. We
 * observed that DERO MDX files are ~95% standard markdown plus sparse
 * JSX (Card/Cards, Callout, ZoomableImage). The full unified+remark
 * AST round-trip would be more robust but needs a remark-stringify
 * dep that the monorepo doesn't have. For the patterns we see, regex
 * is sufficient and adds zero deps.
 *
 * Run:  node scripts/mdx-to-md-prototype.mjs
 * Output: scripts/__output__/{about,dvm-basic,mcp-server}.md
 *
 * This is throwaway prototype scaffolding. If the output passes Pause 2
 * review, the same transform logic will move into a Next.js route
 * handler at app/(llm-digest)/[...slug]/route.ts.
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PAGES_DIR = path.join(ROOT, 'pages')
const OUTPUT_DIR = path.join(__dirname, '__output__')

// The three sample pages for Pause 2 review.
const SAMPLES = [
  { slug: 'basics/about',   src: 'pages/basics/about.mdx' },
  { slug: 'dvm/dvm-basic',  src: 'pages/dvm/dvm-basic.mdx' },
  { slug: 'tools/mcp-server', src: 'pages/tools/mcp-server.mdx' },
]

const MODE = process.argv.includes('--all') ? 'all' : 'samples'

/** Recursively enumerate every .mdx page under pages/. */
async function enumerateAllPages() {
  const found = []
  async function walk(dir, relParts) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const ent of entries) {
      const abs = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        await walk(abs, [...relParts, ent.name])
      } else if (ent.isFile() && ent.name.endsWith('.mdx')) {
        const slug = [...relParts, ent.name.replace(/\.mdx$/, '')]
          .join('/')
          .replace(/\/index$/, '') || 'index'
        const src = path.relative(ROOT, abs)
        found.push({ slug, src })
      }
    }
  }
  await walk(PAGES_DIR, [])
  return found.sort((a, b) => a.slug.localeCompare(b.slug))
}

/**
 * Transform MDX source to clean Markdown.
 *
 * Steps (order matters):
 *   1. Strip ES module import lines (`import X from '...'`).
 *   2. Strip <svg>...</svg> blocks (icon decoration, noise for LLMs).
 *   3. Convert <Callout type="X">...</Callout> → > [!X] blockquote.
 *   4. Convert <Cards>…<Card title="T" href="H" />…</Cards> →
 *      bulleted link list `- [T](H.md)`.
 *   5. Convert <ZoomableImage src="..." alt="..." /> → ![alt](src).
 *   6. Strip remaining JSX tags (self-closing + paired) we don't know.
 *   7. Rewrite internal links `(/path)` → `(/path.md)` — but not
 *      anchors-only, query-only, or static asset references.
 *   8. Collapse runs of blank lines.
 */
function mdxToMarkdown(source) {
  let body = source

  // 1. Strip ES module imports (one-line and multi-line variants).
  body = body.replace(/^\s*import\s+[\s\S]+?from\s+['"][^'"]+['"];?\s*$/gm, '')

  // 2. Strip <svg>...</svg> (greedy across newlines).
  body = body.replace(/<svg\b[\s\S]*?<\/svg>/g, '')

  // 3. <Callout type="X">...</Callout> → > [!X] blockquote.
  //    Map Nextra Callout types to GitHub admonition types.
  const CALLOUT_TYPE_MAP = {
    info:    'NOTE',
    warning: 'WARNING',
    error:   'CAUTION',
    default: 'TIP',
  }
  body = body.replace(
    /<Callout(?:\s+type=["'](\w+)["'])?\s*>([\s\S]*?)<\/Callout>/g,
    (_match, type, inner) => {
      const kind = CALLOUT_TYPE_MAP[type] || 'NOTE'
      const lines = inner.trim().split('\n')
      const quoted = lines.map((l) => `> ${l}`).join('\n')
      return `> [!${kind}]\n${quoted}`
    },
  )

  // 4. <Cards>…<Card title="T" href="H" … />…</Cards> → link list.
  //    Card components have a `title` and `href`; other props (icon,
  //    description) are decoration we drop for the .md version.
  body = body.replace(
    /<Cards\b[^>]*>([\s\S]*?)<\/Cards>/g,
    (_m, inner) => {
      const links = []
      const cardRegex =
        /<Card\b[^>]*?\btitle=["']([^"']+)["'][^>]*?\bhref=["']([^"']+)["'][^>]*?\/>/g
      let cm
      while ((cm = cardRegex.exec(inner)) !== null) {
        links.push(`- [${cm[1]}](${cm[2]})`)
      }
      // Also handle `href` before `title` ordering.
      const cardRegexRev =
        /<Card\b[^>]*?\bhref=["']([^"']+)["'][^>]*?\btitle=["']([^"']+)["'][^>]*?\/>/g
      while ((cm = cardRegexRev.exec(inner)) !== null) {
        const link = `- [${cm[2]}](${cm[1]})`
        if (!links.includes(link)) links.push(link)
      }
      return links.length ? links.join('\n') : ''
    },
  )

  // 5. <ZoomableImage src="..." alt="..." /> → ![alt](src).
  body = body.replace(
    /<ZoomableImage\b[^>]*?\bsrc=["']([^"']+)["'][^>]*?\balt=["']([^"']*)["'][^>]*?\/>/g,
    (_m, src, alt) => `![${alt}](${src})`,
  )
  body = body.replace(
    /<ZoomableImage\b[^>]*?\balt=["']([^"']*)["'][^>]*?\bsrc=["']([^"']+)["'][^>]*?\/>/g,
    (_m, alt, src) => `![${alt}](${src})`,
  )

  // 6. Strip any remaining JSX tags we don't explicitly handle.
  //    - Paired tags: <Tag ...>...</Tag> — keep inner content.
  //    - Self-closing: <Tag ... /> — drop entirely.
  //    Capitalized tag name = JSX component. Dotted names allowed
  //    (e.g. <Tabs.Tab>, <Foo.Bar.Baz>).
  body = body.replace(
    /<[A-Z]\w*(?:\.\w+)*\b[^>]*\/>/g,
    '',
  )
  // Paired JSX: keep inner content, strip wrapper. Multiple passes
  // for nested cases.
  for (let i = 0; i < 5; i++) {
    const before = body
    body = body.replace(
      /<([A-Z]\w*(?:\.\w+)*)\b[^>]*>([\s\S]*?)<\/\1>/g,
      '$2',
    )
    if (body === before) break
  }

  // 7. Rewrite internal markdown links to carry .md.
  //    [text](/path) → [text](/path.md)
  //    Skip: external (http/https), anchors (#), already-.md, static
  //    assets (.png, .jpg, .svg, etc.).
  body = body.replace(
    /\]\((\/[^)\s]+)\)/g,
    (full, url) => {
      // Already has an extension we recognize as static.
      if (/\.(md|png|jpe?g|gif|svg|webp|pdf|json|xml|txt|ico)$/i.test(url)) {
        return full
      }
      // Has query or anchor — append .md before the ? or #.
      const qIdx = url.search(/[?#]/)
      if (qIdx !== -1) {
        const base = url.slice(0, qIdx)
        const rest = url.slice(qIdx)
        return `](${base}.md${rest})`
      }
      return `](${url}.md)`
    },
  )

  // 8. Collapse 3+ consecutive blank lines to 2.
  body = body.replace(/\n{3,}/g, '\n\n')

  return body.trim() + '\n'
}

/**
 * Split YAML frontmatter from body. Returns { frontmatter, body }.
 * Frontmatter is preserved verbatim including the --- delimiters.
 */
function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: '', body: source }
  return {
    frontmatter: `---\n${match[1]}\n---\n\n`,
    body: match[2],
  }
}

async function processSample({ slug, src }) {
  const sourcePath = path.join(ROOT, src)
  const source = await readFile(sourcePath, 'utf-8')
  const { frontmatter, body } = splitFrontmatter(source)
  const transformed = mdxToMarkdown(body)
  const output = frontmatter + transformed
  const outputName = slug.replace(/\//g, '_') + '.md'
  const outputPath = path.join(OUTPUT_DIR, outputName)
  await writeFile(outputPath, output, 'utf-8')
  return {
    slug,
    sourcePath,
    outputPath,
    sourceBytes: Buffer.byteLength(source),
    outputBytes: Buffer.byteLength(output),
  }
}

/**
 * Scan output for residuals that suggest the regex transforms missed
 * something. We flag any JSX-shaped artifacts (`<TagName`, `</TagName>`,
 * `{expression}` outside code fences) that survived emission.
 */
function scanForResiduals(text) {
  const issues = []
  // Strip fenced code blocks so we don't flag braces in code samples.
  const stripped = text.replace(/```[\s\S]*?```/g, '')
  // Capitalized opening tag (JSX component) that survived.
  const openJsx = stripped.match(/<[A-Z][A-Za-z0-9]*\b/g) || []
  if (openJsx.length) issues.push(`${openJsx.length}× residual JSX opening tag (${[...new Set(openJsx)].join(', ')})`)
  // Closing JSX tag.
  const closeJsx = stripped.match(/<\/[A-Z][A-Za-z0-9]*>/g) || []
  if (closeJsx.length) issues.push(`${closeJsx.length}× residual JSX closing tag`)
  // import statement that survived.
  const surviveImport = stripped.match(/^\s*import\s+.*from\s+['"]/m)
  if (surviveImport) issues.push(`surviving import statement`)
  // Stray {expression}-shaped braces outside fences (heuristic; can have false positives).
  const braces = stripped.match(/\{[A-Za-z_$][\w$.]*\}/g) || []
  if (braces.length > 2) issues.push(`${braces.length}× possible JSX expressions ({var})`)
  return issues
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })
  const pages = MODE === 'all' ? await enumerateAllPages() : SAMPLES
  console.log(`\nMDX → Markdown — mode: ${MODE} (${pages.length} page${pages.length === 1 ? '' : 's'})\n`)

  const results = []
  for (const page of pages) {
    try {
      results.push(await processSample(page))
    } catch (err) {
      console.error(`  ✗ ${page.slug}: ${err.message}`)
    }
  }

  // Scan every output for residuals.
  const flagged = []
  for (const r of results) {
    const text = await readFile(r.outputPath, 'utf-8')
    const issues = scanForResiduals(text)
    if (issues.length) flagged.push({ slug: r.slug, issues })
  }

  if (MODE === 'samples') {
    // Detailed table for sample mode.
    console.log('slug'.padEnd(22), 'source'.padStart(10), 'output'.padStart(10), 'ratio'.padStart(8))
    console.log('-'.repeat(54))
    for (const r of results) {
      const ratio = ((r.outputBytes / r.sourceBytes) * 100).toFixed(0) + '%'
      console.log(
        r.slug.padEnd(22),
        String(r.sourceBytes).padStart(10),
        String(r.outputBytes).padStart(10),
        ratio.padStart(8),
      )
    }
  } else {
    // Summary stats for --all mode.
    const totalSource = results.reduce((a, r) => a + r.sourceBytes, 0)
    const totalOutput = results.reduce((a, r) => a + r.outputBytes, 0)
    const avgRatio = ((totalOutput / totalSource) * 100).toFixed(0)
    console.log(`  ✓ Processed: ${results.length} pages`)
    console.log(`  Total source: ${(totalSource / 1024).toFixed(1)} KB`)
    console.log(`  Total output: ${(totalOutput / 1024).toFixed(1)} KB`)
    console.log(`  Average ratio: ${avgRatio}%`)
    console.log()
    console.log(`  Pages with residual issues: ${flagged.length}`)
  }

  if (flagged.length) {
    console.log('\nFlagged pages (residual JSX or unhandled patterns):\n')
    for (const f of flagged) {
      console.log(`  ${f.slug}`)
      for (const issue of f.issues) console.log(`    - ${issue}`)
    }
  } else if (MODE === 'all') {
    console.log('\n  ✓ Zero residuals across all pages.')
  }

  console.log('\nOutputs written to:', path.relative(ROOT, OUTPUT_DIR))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
