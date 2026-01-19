import type { Metadata } from 'next'

const defineMetadata = <T extends Metadata>(metadata: T) => metadata

const seoConfig = defineMetadata({
  metadataBase: new URL('https://hologram.derod.org'),
  title: {
    template: '%s | Hologram',
    default: 'Hologram - DERO Decentralized Web Browser | Browse the Private Web'
  },
  description: 'Official Hologram documentation. Native desktop browser for DERO decentralized applications. Integrated wallet, TELA browser, block explorer, and developer tools with complete privacy.',
  themeColor: '#00d4aa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    images: '/assets/og-image.png',
    url: 'https://hologram.derod.org',
    siteName: 'Hologram - DERO Decentralized Web Browser',
    description: 'Native desktop browser for DERO decentralized applications. Browse immutable content with zero tracking and complete privacy.'
  },
  manifest: '/assets/site.webmanifest',
  icons: [
    { rel: 'icon', url: '/assets/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/assets/apple-touch-icon.png' },
    { rel: 'mask-icon', url: '/assets/favicon.ico' },
    { rel: 'image/x-icon', url: '/assets/favicon.ico' }
  ],
  twitter: {
    card: 'summary_large_image',
    site: '@DeroProject',
    creator: '@DeroProject',
    title: 'Hologram - DERO Decentralized Web Browser',
    description: 'Native desktop browser for DERO decentralized applications. Immutable content, zero tracking, complete privacy.',
    images: '/assets/og-image.png'
  },
  keywords: 'Hologram, DERO browser, decentralized browser, TELA, blockchain browser, privacy browser, DERO wallet, dApps, Web3, decentralized web, XSWD, telaHost, offline-first, censorship resistant'
})

export default seoConfig

