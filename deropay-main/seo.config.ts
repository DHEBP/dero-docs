import type { Metadata } from 'next'

const defineMetadata = <T extends Metadata>(metadata: T) => metadata

const seoConfig = defineMetadata({
  metadataBase: new URL('https://deropay.derod.org'),
  title: {
    template: '%s | DeroPay',
    default: 'DeroPay - Payment Processing & Authentication for DERO'
  },
  description: 'DeroPay and DeroAuth documentation. Accept DERO payments with invoices, escrow, and webhooks. Authenticate users with privacy-preserving wallet signatures.',
  themeColor: '#0a0a0a',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    images: '/assets/og-deropay.png',
    url: 'https://deropay.derod.org',
    siteName: 'DeroPay Documentation',
    description: 'DeroPay and DeroAuth documentation. Accept DERO payments with invoices, escrow, and webhooks. Authenticate users with privacy-preserving wallet signatures.'
  },
  manifest: '/assets/site.webmanifest',
  icons: [
    { rel: 'icon', url: '/assets/favicon.svg' },
    { rel: 'apple-touch-icon', url: '/assets/favicon.svg' },
  ],
  twitter: {
    card: 'summary_large_image',
    site: '@dero_bro',
    creator: '@dero_bro',
    title: 'DeroPay - Payment Processing & Authentication for DERO',
    description: 'Accept DERO payments with invoices, escrow, and webhooks. Authenticate users with privacy-preserving wallet signatures.',
    images: '/assets/og-deropay.png'
  },
  keywords: 'DeroPay, DeroAuth, DERO, payments, cryptocurrency, invoices, escrow, authentication, wallet, privacy, blockchain, SDK, TypeScript'
})

export default seoConfig
