// See derod-main/next-sitemap.config.js for the rationale on the
// AI-crawler-aware policy block.
const AI_BOT_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Google-Extended',
  'PerplexityBot',
  'Applebot-Extended',
  'cohere-ai',
  'Bytespider',
  'Amazonbot',
  'Meta-ExternalAgent',
]

const AI_BOT_ALLOW_PATHS = [
  '/',
  '/llms.txt',
  '/llms-full.txt',
  '/agents.md',
  '/SKILL.md',
  '/.well-known/mcp-server-card.json',
]

const config = {
  siteUrl: 'https://tela.derod.org', // keep in sync with seo.config.ts
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  trailingSlash: false,
  robotsTxtOptions: {
    // next-sitemap comma-joins array userAgents into one line, which
    // is invalid per RFC 9309. Workaround: one policy per bot.
    policies: [
      { userAgent: '*', allow: '/' },
      ...AI_BOT_USER_AGENTS.map((ua) => ({ userAgent: ua, allow: AI_BOT_ALLOW_PATHS })),
    ],
  },
}

export default config
