/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://hologram.derod.org',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  trailingSlash: false,
  outDir: 'public'
}

export default config

