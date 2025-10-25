import type { Metadata } from 'next'

const defineMetadata = <T extends Metadata>(metadata: T) => metadata

const seoConfig = defineMetadata({
  metadataBase: new URL('https://derod.org'),
  title: {
    template: '%s | DERO Blockchain',
    default: 'derod.org - DERO daemon & node documentation | Private Decentralized Application Platform'
  },
  description: 'Complete guide to DERO daemon (derod), nodes, mining, wallets, and privacy-focused blockchain development. Learn to run DERO nodes, mine, and build private smart contracts.',
  themeColor: '#061636',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    images: '/assets/og-image.png',
    url: 'https://derod.org',
    siteName: 'derod - DERO daemon documentation',
    description: 'Complete guide to DERO nodes, mining, wallets, and privacy-focused blockchain development. Learn to run DERO nodes, mine, and build private smart contracts.'
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
    site: '@dero_bro',
    creator: '@dero_bro',
    title: 'derod - DERO daemon & node documentation',
    description: 'Complete guide to DERO daemon (derod), nodes, mining, wallets, and privacy blockchain development. Run nodes, mine DERO, build private smart contracts.',
    images: '/assets/og-image.png'
  },
  keywords: 'DERO daemon, derod, DERO node, blockchain node, DERO mining, privacy coin, privacy blockchain, smart contracts, DERO wallet, cryptocurrency node, decentralized network, DERO documentation'
})

export default seoConfig