#!/usr/bin/env node --experimental-strip-types
/**
 * Generate site-specific public/llms-full.txt — the full-corpus companion
 * to llms.txt. Every doc page's Markdown is inlined into one long file for
 * long-context LLM ingestion (one fetch instead of N .md mirror requests).
 *
 * Why this exists: llms.txt, agents.md, agent-card.json, robots.txt, and
 * next-sitemap all advertise /llms-full.txt across every site, but the file
 * was never generated — a phantom 404. This builds the real thing.
 *
 * Content fidelity: each page is transformed with the SAME mdxToMarkdown()
 * used by the per-page /<slug>.md mirror route handler
 * (app/llm-digest/[...slug]/route.ts), so the corpus is byte-for-byte
 * consistent with what agents already fetch per page.
 *
 * Page list + per-site domain come from the shared docs index, matching
 * generate-llms-and-agents.mjs. Re-run any time pages are added/renamed.
 *
 * Requires Node 22.6+ (uses --experimental-strip-types to import the .ts
 * transform directly, avoiding a drift-prone JS re-port). The shebang sets
 * the flag; if invoked as `node scripts/generate-llms-full.mjs` directly,
 * pass --experimental-strip-types yourself.
 *
 * Run:
 *   node --experimental-strip-types scripts/generate-llms-full.mjs <site-dir>
 *   e.g. node --experimental-strip-types scripts/generate-llms-full.mjs tela-main
 *   (omit <site-dir> to build all four)
 */

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(__dirname, '..')
const DOCS_INDEX_PATH = path.resolve(
  MONOREPO,
  '..',
  'dero-mcp-server',
  'data',
  'docs-index.json',
)

// product key (docs index) → site dir + public domain. Matches
// generate-llms-and-agents.mjs SITE_CONFIG.
const SITES = {
  'derod-main': { product: 'derod', domain: 'derod.org', displayName: 'DERO Blockchain' },
  'tela-main': { product: 'tela', domain: 'tela.derod.org', displayName: 'TELA' },
  'hologram-main': { product: 'hologram', domain: 'hologram.derod.org', displayName: 'Hologram' },
  'deropay-main': { product: 'deropay', domain: 'pay.derod.org', displayName: 'DeroPay' },
}

async function buildLlmsFull(site, cfg, pages) {
  // Import the per-site transform (all four copies are byte-identical, but
  // import the matching site's to stay correct if one ever diverges).
  const { mdxToMarkdown } = await import(
    path.join(MONOREPO, site, 'lib', 'mdx-to-md.ts')
  )

  const baseUrl = `https://${cfg.domain}`
  const out = []
  out.push(`# ${cfg.displayName} — Full Documentation Corpus`)
  out.push('')
  out.push(
    `> Every documentation page for ${cfg.domain}, inlined as Markdown for ` +
      `long-context LLM ingestion. Curated link list: ${baseUrl}/llms.txt. ` +
      `Each page is also available individually at ${baseUrl}/<path>.md.`,
  )
  out.push('')

  let inlined = 0
  let missing = 0
  for (const page of pages) {
    const sourceRel = page.sourcePath || path.join(site, 'pages', `${page.slug}.mdx`)
    const sourceAbs = path.resolve(MONOREPO, sourceRel)
    let source
    try {
      source = await readFile(sourceAbs, 'utf-8')
    } catch {
      // sourcePath may be stale; try the conventional .mdx / index.mdx.
      const fallbacks = [
        path.join(MONOREPO, site, 'pages', `${page.slug}.mdx`),
        path.join(MONOREPO, site, 'pages', page.slug, 'index.mdx'),
      ]
      source = null
      for (const fb of fallbacks) {
        try {
          source = await readFile(fb, 'utf-8')
          break
        } catch {
          /* keep trying */
        }
      }
      if (source === null) {
        missing++
        continue
      }
    }

    const markdown = mdxToMarkdown(source).trim()
    const url = `${baseUrl}/${page.slug}.md`
    // Section divider + source URL so an agent can trace any chunk back to
    // its canonical page.
    out.push('---')
    out.push('')
    out.push(`<!-- source: ${url} -->`)
    out.push('')
    out.push(markdown)
    out.push('')
    inlined++
  }

  return { text: out.join('\n'), inlined, missing }
}

async function generateForSite(site) {
  const cfg = SITES[site]
  if (!cfg) throw new Error(`Unknown site: ${site}`)
  const docsIndex = JSON.parse(await readFile(DOCS_INDEX_PATH, 'utf-8'))
  // Match generate-llms-and-agents.mjs: never inline the homepage (slug '').
  const pages = (docsIndex.pages || [])
    .filter((p) => p.product === cfg.product && p.slug && p.slug !== '')
    .sort((a, b) => a.slug.localeCompare(b.slug))
  if (pages.length === 0) {
    throw new Error(`No pages found for product=${cfg.product} in docs index`)
  }

  const { text, inlined, missing } = await buildLlmsFull(site, cfg, pages)
  const target = path.join(MONOREPO, site, 'public', 'llms-full.txt')
  await writeFile(target, text, 'utf-8')
  console.log(
    `  ✓ ${site}/public/llms-full.txt — ${inlined} pages inlined` +
      (missing ? `, ${missing} skipped (source not found)` : '') +
      ` (${text.length} bytes)`,
  )
}

async function main() {
  const site = process.argv[2]
  const targets = site ? [site] : Object.keys(SITES)
  if (site && !SITES[site]) {
    console.error(`Unknown site: ${site}`)
    console.error('Supported:', Object.keys(SITES).join(', '))
    process.exit(1)
  }
  console.log('Generating llms-full.txt:')
  for (const s of targets) {
    await generateForSite(s)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
