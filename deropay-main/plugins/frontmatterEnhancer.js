import { visit } from 'unist-util-visit'
import readingTime from 'reading-time'

/**
 * Remark plugin to ensure robust front-matter for SEO.
 * Injects: slug, canonicalUrl, readingTime, tags (if none given).
 */
export default function frontmatterEnhancer() {
  return (tree, file) => {
    const fm = file.data.frontMatter || (file.data.frontMatter = {})

    if (!fm.slug) {
      const p = file.history[0] || file.path || ''
      const slug = p
        .replace(/^.*pages\//, '')
        .replace(/\\/g, '/')
        .replace(/\.[^/.]+$/, '')
        .replace(/index$/, '')
        .replace(/\/+$/,'')
        .split('/')
        .filter(Boolean)
        .join('-')
        .toLowerCase()
      fm.slug = slug || 'page'
    }

    if (!fm.canonicalUrl && process.env.SITE_URL) {
      fm.canonicalUrl = `${process.env.SITE_URL}/${fm.slug}`
    }

    const text = String(file)
    const stats = readingTime(text)
    fm.readingTime = Math.ceil(stats.minutes)

    if (!fm.tags) {
      fm.tags = ['dero', 'deropay', 'payments', 'privacy']
    }
  }
}
