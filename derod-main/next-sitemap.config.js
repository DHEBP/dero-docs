// AI-crawler-aware robots.txt — some bots only honor their own named
// User-agent block, and Google-Extended specifically defaults to opt-out
// for Gemini training unless explicitly allowed. Listing them by name
// (with explicit Allow paths for the agent-ready surfaces) makes
// derod.org fully discoverable across the 2026 AI crawler set.
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
  siteUrl: 'https://derod.org', // keep in sync with seo.config.ts
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  trailingSlash: false,
  robotsTxtOptions: {
    // next-sitemap comma-joins array userAgents into one line, which
    // is invalid per RFC 9309 (each user-agent must be on its own
    // line). Workaround: emit one policy per bot.
    policies: [
      { userAgent: '*', allow: '/' },
      ...AI_BOT_USER_AGENTS.map((ua) => ({ userAgent: ua, allow: AI_BOT_ALLOW_PATHS })),
    ],
  },
}

export default config
