/**
 * MDX → clean Markdown emitter used by the .md mirror route handler.
 *
 * Strategy: regex-based surgical transformations. DERO MDX files are
 * ~95% standard markdown plus sparse JSX (Card / Cards, Callout,
 * ZoomableImage, Tabs / Tabs.Tab). A full unified+remark AST round-trip
 * would be more robust but needs `remark-stringify`, which the monorepo
 * doesn't have. For the patterns we ship, regex is sufficient.
 *
 * Pause 2 validated this on all 55 derod-main pages with zero
 * residual JSX. Spec'd in scripts/mdx-to-md-prototype.mjs.
 */

/**
 * Split YAML frontmatter from body. Returns the verbatim frontmatter
 * (delimiters included) plus the remaining body. Frontmatter is
 * preserved untouched and re-emitted ahead of the transformed body.
 */
export function splitFrontmatter(source: string): { frontmatter: string; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: '', body: source }
  return {
    frontmatter: `---\n${match[1]}\n---\n\n`,
    body: match[2],
  }
}

const CALLOUT_TYPE_MAP: Record<string, string> = {
  info: 'NOTE',
  warning: 'WARNING',
  error: 'CAUTION',
  default: 'TIP',
}

/**
 * Transform MDX body source to clean Markdown.
 *
 * Steps (order matters):
 *   1. Strip ES module imports.
 *   2. Strip <svg>...</svg> blocks (icon decoration; noise for LLMs).
 *   3. Convert <Callout type="X">...</Callout> → > [!X] blockquote.
 *   4. Convert <Cards>…<Card title="T" href="H"/>…</Cards> → link list.
 *   5. Convert <ZoomableImage src alt /> → ![alt](src).
 *   6. Strip remaining unknown JSX components (capitalized + dotted).
 *      Paired tags keep inner content; self-closing dropped.
 *   7. Rewrite internal markdown links (/path) → (/path.md).
 *   8. Collapse 3+ blank lines to 2.
 */
export function mdxBodyToMarkdown(source: string): string {
  let body = source

  // 1. Strip ES module imports (one-line and multi-line variants).
  body = body.replace(/^\s*import\s+[\s\S]+?from\s+['"][^'"]+['"];?\s*$/gm, '')

  // 2. Strip <svg>...</svg> (greedy across newlines).
  body = body.replace(/<svg\b[\s\S]*?<\/svg>/g, '')

  // 3. <Callout type="X">...</Callout> → > [!X] blockquote.
  body = body.replace(
    /<Callout(?:\s+type=["'](\w+)["'])?\s*>([\s\S]*?)<\/Callout>/g,
    (_match, type: string | undefined, inner: string) => {
      const kind = (type && CALLOUT_TYPE_MAP[type]) || 'NOTE'
      const lines = inner.trim().split('\n')
      const quoted = lines.map((l) => `> ${l}`).join('\n')
      return `> [!${kind}]\n${quoted}`
    },
  )

  // 4. <Cards>…<Card title="T" href="H" … />…</Cards> → link list.
  body = body.replace(
    /<Cards\b[^>]*>([\s\S]*?)<\/Cards>/g,
    (_m, inner: string) => {
      const links: string[] = []
      const titleFirst =
        /<Card\b[^>]*?\btitle=["']([^"']+)["'][^>]*?\bhref=["']([^"']+)["'][^>]*?\/>/g
      let cm: RegExpExecArray | null
      while ((cm = titleFirst.exec(inner)) !== null) {
        links.push(`- [${cm[1]}](${cm[2]})`)
      }
      const hrefFirst =
        /<Card\b[^>]*?\bhref=["']([^"']+)["'][^>]*?\btitle=["']([^"']+)["'][^>]*?\/>/g
      while ((cm = hrefFirst.exec(inner)) !== null) {
        const link = `- [${cm[2]}](${cm[1]})`
        if (!links.includes(link)) links.push(link)
      }
      return links.length ? links.join('\n') : ''
    },
  )

  // 5. <ZoomableImage src alt /> → ![alt](src). Handle both attr orders.
  body = body.replace(
    /<ZoomableImage\b[^>]*?\bsrc=["']([^"']+)["'][^>]*?\balt=["']([^"']*)["'][^>]*?\/>/g,
    (_m, src: string, alt: string) => `![${alt}](${src})`,
  )
  body = body.replace(
    /<ZoomableImage\b[^>]*?\balt=["']([^"']*)["'][^>]*?\bsrc=["']([^"']+)["'][^>]*?\/>/g,
    (_m, alt: string, src: string) => `![${alt}](${src})`,
  )

  // 6. Strip remaining unknown JSX. Capitalized = component; dots allowed
  //    for compound names like <Tabs.Tab>, <Foo.Bar.Baz>.
  body = body.replace(/<[A-Z]\w*(?:\.\w+)*\b[^>]*\/>/g, '')
  // Paired: keep inner, strip wrapper. Multiple passes for nesting.
  for (let i = 0; i < 5; i++) {
    const before = body
    body = body.replace(
      /<([A-Z]\w*(?:\.\w+)*)\b[^>]*>([\s\S]*?)<\/\1>/g,
      '$2',
    )
    if (body === before) break
  }

  // 7. Rewrite internal markdown links to carry .md. Skip external URLs,
  //    anchors-only, static assets, and already-.md targets.
  body = body.replace(/\]\((\/[^)\s]+)\)/g, (full, url: string) => {
    if (/\.(md|png|jpe?g|gif|svg|webp|pdf|json|xml|txt|ico)$/i.test(url)) {
      return full
    }
    const qIdx = url.search(/[?#]/)
    if (qIdx !== -1) {
      return `](${url.slice(0, qIdx)}.md${url.slice(qIdx)})`
    }
    return `](${url}.md)`
  })

  // 8. Collapse 3+ consecutive blank lines to 2.
  body = body.replace(/\n{3,}/g, '\n\n')

  return body.trim() + '\n'
}

/** Full source-to-output pipeline: split frontmatter, transform body, reassemble. */
export function mdxToMarkdown(source: string): string {
  const { frontmatter, body } = splitFrontmatter(source)
  return frontmatter + mdxBodyToMarkdown(body)
}
