import type { Metadata } from 'next'

const defineMetadata = <T extends Metadata>(metadata: T) => metadata

const seoConfig = defineMetadata({
  metadataBase: new URL('https://hologram.derod.org'),
  title: {
    template: '%s | Hologram',
    default: 'Hologram - DERO Decentralized Web Browser | Browse the Private Web'
  },
  description: 'Official Hologram documentation. Native desktop browser for DERO decentralized applications. Integrated wallet, TELA browser, block explorer, and developer tools with complete privacy.',
  themeColor: '#22d3ee',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    images: '/assets/og-image.jpg',
    url: 'https://hologram.derod.org',
    siteName: 'Hologram - DERO Decentralized Web Browser',
    description: 'Native desktop browser for DERO decentralized applications. Browse immutable content with zero tracking and complete privacy.'
  },
  manifest: '/assets/site.webmanifest',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', url: '/assets/favicon.svg' },
    { rel: 'icon', type: 'image/png', url: '/assets/favicon.png' },
    { rel: 'apple-touch-icon', url: '/assets/apple-touch-icon.png' }
  ],
  twitter: {
    card: 'summary_large_image',
    site: '@dero_bro',
    creator: '@dero_bro',
    title: 'Hologram - DERO Decentralized Web Browser',
    description: 'Native desktop browser for DERO decentralized applications. Immutable content, zero tracking, complete privacy.',
    images: '/assets/og-image.jpg'
  },
  keywords: 'Hologram, DERO browser, decentralized browser, TELA, blockchain browser, privacy browser, DERO wallet, dApps, Web3, decentralized web, XSWD, telaHost, offline-first, censorship resistant'
})

export default seoConfig

