/**
 * Per-page Markdown mirror route.
 *
 * Served at /llm-digest/<slug>; the public-facing URL is /<slug>.md
 * via the next.config.js rewrite. Reads the matching pages/<slug>.mdx
 * (falls back to pages/<slug>/index.mdx and pages/<slug>.md), runs
 * the MDX → Markdown transform from lib/mdx-to-md.ts, and returns
 * text/markdown.
 *
 * Cache shape follows Vercel's own nextjs.org/docs.md pattern observed
 * during Pause 2 research (Inspo §06): public CDN cache 1d, SWR 7d,
 * with x-robots-tag noindex to keep .md duplicates out of search.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { mdxToMarkdown } from '@/lib/mdx-to-md'

const PAGES_DIR = path.join(process.cwd(), 'pages')

export const dynamic = 'force-static'
export const revalidate = 86400 // 1 day

async function readMdxSource(slugPath: string): Promise<string | null> {
  // Try .mdx, .md, then index variants.
  const candidates = [
    `${slugPath}.mdx`,
    `${slugPath}.md`,
    `${slugPath}/index.mdx`,
    `${slugPath}/index.md`,
  ]
  for (const rel of candidates) {
    const abs = path.join(PAGES_DIR, rel)
    // Defense-in-depth: refuse anything that resolved outside PAGES_DIR
    // (catch a malformed slug with `..` segments before it hits the FS).
    if (!abs.startsWith(PAGES_DIR + path.sep) && abs !== PAGES_DIR) continue
    try {
      return await readFile(abs, 'utf-8')
    } catch {
      // Not found; try next candidate.
    }
  }
  return null
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params
  const slugPath = slug.join('/')

  const source = await readMdxSource(slugPath)
  if (source === null) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  const markdown = mdxToMarkdown(source)
  return new Response(markdown, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'x-robots-tag': 'noindex, nofollow',
    },
  })
}
