import path from 'path'
import nextra from 'nextra'
import withPWA from 'next-pwa'
import withBundleAnalyzer from '@next/bundle-analyzer'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
  latex: true,
  flexsearch: {
    codeblocks: false
  },
  defaultShowCopyCode: true,
  remarkPlugins: [path.resolve('./plugins/frontmatterEnhancer.js')]
})

// Enable bundle analyzer when ANALYZE env var is set
const withAnalyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

// Enable PWA in production only
const withPwaPlugin = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // Exclude files that don't exist or shouldn't be precached
  buildExcludes: [/middleware-manifest\.json$/, /dynamic-css-manifest\.json$/],
  // Don't fail on missing files
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    }
  ]
})

export default withAnalyze(withPwaPlugin(withNextra({
  reactStrictMode: true,
  eslint: {
    // Eslint behaves weirdly in this monorepo.
    ignoreDuringBuilds: true
  },
  redirects: () => [
    {
      source: '/docs/docs-theme/built-ins/callout',
      destination: '/docs/guide/built-ins/callout',
      permanent: true
    },
    {
      source: '/integrity/inflation-claim-v2',
      destination: '/integrity/inflation-claim',
      permanent: true
    },
    {
      // ChatGPT Plugins sunset 2024-04-09 — forward to SEP-2127 mcp-server-card.
      // Temporary (302) so clients re-discover, not cache the old URL.
      source: '/.well-known/ai-plugin.json',
      destination: '/.well-known/mcp-server-card.json',
      permanent: false
    }
  ],
  rewrites: () => [
    {
      // Per-page Markdown mirrors: /<path>.md served by the App Router
      // route handler at app/llm-digest/[...slug]/route.ts.
      // Pattern matches /any/depth.md → /llm-digest/any/depth.
      source: '/:path*.md',
      destination: '/llm-digest/:path*'
    }
  ]
})))