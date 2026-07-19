#!/usr/bin/env node
/**
 * CI guard: structural link-health check for every site's llms.txt.
 *
 * For each ecosystem site (derod, tela, hologram, deropay), parses
 * public/llms.txt, extracts every `[text](https://<site>/<slug>.md)`
 * link row, and verifies the source MDX page exists on disk at
 * <site>/pages/<slug>.mdx (or .md, or <slug>/index.mdx). Fails non-zero
 * with a per-site list of broken links if any source is missing.
 *
 * This is a structural check — it does NOT make HTTP requests. The
 * intent is to catch the drift the same way dero-mcp-server's
 * check:citations script catches docs reorganizations before they
 * produce 404s in production.
 *
 * Run:  node scripts/check-llms-link-health.mjs
 * Exit: 0 if all links resolve, 1 if any are broken.
 */

import { readFile, access } from 'node:fs/promises'
import { lookup } from 'node:dns/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(__dirname, '..')

const SITES = [
  { dir: 'derod-main',    domain: 'derod.org' },
  { dir: 'tela-main',     domain: 'tela.derod.org' },
  { dir: 'hologram-main', domain: 'hologram.derod.org' },
  { dir: 'deropay-main',  domain: 'deropay.derod.org' },
]

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/**
 * Extract every `https://<domain>/<slug>.md` URL referenced from a
 * markdown link row in `llms.txt`. Ignores external links, anchors,
 * and the optional `## Related Sites` block (which intentionally
 * cross-references other ecosystem domains).
 */
function extractLinkRows(text, domain) {
  const lines = text.split('\n')
  const slugs = new Set()
  let inRelated = false
  for (const line of lines) {
    if (/^##\s+Related Sites/i.test(line)) inRelated = true
    else if (/^##\s+/.test(line)) inRelated = false
    if (inRelated) continue
    // Match `[text](https://<domain>/<path>.md)` — only same-site links.
    const re = new RegExp(
      `\\]\\(https?://${domain.replace(/\./g, '\\.')}/([^)\\s]+?)\\.md\\)`,
      'g',
    )
    let m
    while ((m = re.exec(line)) !== null) {
      slugs.add(m[1])
    }
  }
  return [...slugs].sort()
}

/**
 * Resolve a slug to its source file. Returns the resolved absolute
 * path or null if no source exists.
 */
async function resolveSlugSource(siteDir, slug) {
  // Nextra-rendered pages live under pages/; the App Router .md mirror
  // route handler reads from there too.
  const pageCandidates = [
    `${slug}.mdx`,
    `${slug}.md`,
    `${slug}/index.mdx`,
    `${slug}/index.md`,
  ]
  for (const rel of pageCandidates) {
    const abs = path.join(MONOREPO, siteDir, 'pages', rel)
    if (await exists(abs)) return abs
  }
  // Some llms.txt rows point at static files served directly from
  // public/ (e.g. SKILL.md, agents.md). Verify those exist too.
  const publicCandidates = [`${slug}.md`, `${slug}`]
  for (const rel of publicCandidates) {
    const abs = path.join(MONOREPO, siteDir, 'public', rel)
    if (await exists(abs)) return abs
  }
  return null
}

/**
 * Guard against a dead canonical domain. The structural check above passes
 * even when a site's whole domain does not resolve — that is exactly how
 * `pay.derod.org` shipped into every citation while being an NXDOMAIN.
 *
 * Network-aware so it never false-fails an offline runner: if EVERY domain
 * fails to resolve we assume no network and SKIP. A genuinely dead single
 * domain shows up as "some resolve, one doesn't" and FAILS.
 */
async function checkDomainsResolve(sites) {
  const domains = [...new Set(sites.map((s) => s.domain))]
  const results = await Promise.all(
    domains.map(async (domain) => {
      try {
        await lookup(domain)
        return { domain, resolves: true }
      } catch (err) {
        return { domain, resolves: false, code: err.code || String(err) }
      }
    }),
  )
  const dead = results.filter((r) => !r.resolves)
  const alive = results.filter((r) => r.resolves)
  if (alive.length === 0) {
    return { skipped: true, reason: `no network (0/${domains.length} domains resolved)` }
  }
  return { fail: dead.length > 0, dead, resolved: alive.length, total: domains.length }
}

async function checkSite(site) {
  const llmsPath = path.join(MONOREPO, site.dir, 'public', 'llms.txt')
  if (!(await exists(llmsPath))) {
    return { site: site.dir, skipped: true, reason: 'no public/llms.txt' }
  }
  const text = await readFile(llmsPath, 'utf-8')
  const slugs = extractLinkRows(text, site.domain)
  const broken = []
  for (const slug of slugs) {
    const source = await resolveSlugSource(site.dir, slug)
    if (!source) broken.push(slug)
  }
  return { site: site.dir, total: slugs.length, broken }
}

async function main() {
  console.log('[check-llms-link-health] verifying llms.txt link rows against pages/...\n')
  const results = []
  let anyFail = false
  for (const site of SITES) {
    const r = await checkSite(site)
    results.push(r)
    if (r.skipped) {
      console.log(`  ${r.site.padEnd(16)} SKIP — ${r.reason}`)
      continue
    }
    if (r.broken.length === 0) {
      console.log(`  ${r.site.padEnd(16)} OK   ${r.total} links → 0 broken`)
    } else {
      anyFail = true
      console.log(`  ${r.site.padEnd(16)} FAIL ${r.total} links → ${r.broken.length} broken:`)
      for (const slug of r.broken) console.log(`    - ${slug} → no pages/${slug}.{mdx,md} or pages/${slug}/index.{mdx,md}`)
    }
  }
  // Canonical-domain resolution guard (catches dead-domain citations).
  const dns = await checkDomainsResolve(SITES)
  if (dns.skipped) {
    console.log(`  ${'domains'.padEnd(16)} SKIP — ${dns.reason}`)
  } else if (!dns.fail) {
    console.log(`  ${'domains'.padEnd(16)} OK   ${dns.resolved}/${dns.total} canonical domains resolve`)
  } else {
    anyFail = true
    console.log(`  ${'domains'.padEnd(16)} FAIL ${dns.dead.length} canonical domain(s) do not resolve:`)
    for (const d of dns.dead) console.log(`    - ${d.domain} → ${d.code} (dead canonical domain; every citation to it 404s)`)
  }

  console.log()
  if (anyFail) {
    console.error('[check-llms-link-health] FAIL — fix llms.txt link rows / restore missing pages / repoint the dead domain, then rerun.')
    process.exit(1)
  }
  console.log('[check-llms-link-health] OK — every llms.txt link row resolves to a source page, and every canonical domain resolves.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
