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
  buildExcludes: [/middleware-manifest\.json$/, /dynamic-css-manifest\.json$/],
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
    ignoreDuringBuilds: true
  },
  redirects: () => [
    {
      source: '/mining',
      destination: '/developer-support',
      permanent: true
    }
  ],
  rewrites: () => [
    {
      // Per-page Markdown mirrors: /<path>.md → App Router route handler.
      source: '/:path*.md',
      destination: '/llm-digest/:path*'
    }
  ]
})))

