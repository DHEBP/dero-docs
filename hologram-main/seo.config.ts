import type { Metadata } from 'next'

const defineMetadata = <T extends Metadata>(metadata: T) => metadata

const seoConfig = defineMetadata({
  metadataBase: new URL('https://hologram.derod.org'),
  title: {
    template: '%s | HOLOGRAM',
    default: 'HOLOGRAM - DERO Desktop Application Documentation'
  },
  description: 'Complete guide to HOLOGRAM, the all-in-one DERO desktop application. Browser, Wallet, Explorer, Studio, and Developer Tools documentation.',
  themeColor: '#061636',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    images: '/assets/og-image.png',
    url: 'https://hologram.derod.org',
    siteName: 'HOLOGRAM - DERO Desktop Application',
    description: 'Complete guide to HOLOGRAM, the all-in-one DERO desktop application. Browser, Wallet, Explorer, Studio, and Developer Tools documentation.'
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
    title: 'HOLOGRAM - DERO Desktop Application',
    description: 'Complete guide to HOLOGRAM, the all-in-one DERO desktop application. Browser, Wallet, Explorer, Studio, and Developer Tools documentation.',
    images: '/assets/og-image.png'
  },
  keywords: 'HOLOGRAM, DERO desktop app, DERO browser, DERO wallet, TELA browser, DERO explorer, DERO studio, DERO development, privacy blockchain, DERO documentation'
})

export default seoConfig

