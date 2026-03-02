import React from 'react'
import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import { useConfig } from 'nextra-theme-docs'
import seoConfig from './seo.config'

const logo = (
  <div className="flex items-center gap-2">
    <svg
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
    <span className="font-bold text-lg">DeroPay</span>
    <style jsx>{`
      div {
        mask-image: linear-gradient(
          60deg,
          black 25%,
          rgba(0, 0, 0, 0.2) 50%,
          black 75%
        );
        mask-size: 400%;
        mask-position: 0%;
      }
      div:hover {
        mask-position: 100%;
        transition:
          mask-position 1s ease,
          -webkit-mask-position 1s ease;
      }
    `}</style>
  </div>
)

const config: DocsThemeConfig = {
  primaryHue: { dark: 142, light: 142 },
  primarySaturation: { dark: 60, light: 60 },
  project: {
    link: 'https://github.com/DHEBP/DeroPay'
  },
  docsRepositoryBase: 'https://github.com/DHEBP/dero-docs/tree/main/deropay-main',
  useNextSeoProps() {
    const { route } = useRouter()
    const { url, images } = seoConfig.openGraph

    if (route === '/') {
      return { titleTemplate: '%s – DeroPay' }
    }

    return {
      titleTemplate: seoConfig.title.template,
      openGraph: { url, images: [{ url: `${url}${images}` }] }
    }
  },
  logo,

  head: () => {
    const { frontMatter: meta } = useConfig()
    const { title } = meta
    const router = useRouter()
    const pagePath = router.asPath

    const imageUrl = meta.image
      ? (meta.image.startsWith('http') ? meta.image : `${seoConfig.openGraph.url}${meta.image}`)
      : `${seoConfig.openGraph.url}${seoConfig.openGraph.images}`

    return (
      <>
        {seoConfig.icons.map((icon, index) => (
          <link key={index} rel={icon.rel} href={icon.url} />
        ))}
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content={meta.description || seoConfig.description}
        />

        {/* OpenGraph tags */}
        <meta
          property="og:title"
          content={title ? title + ' – DeroPay' : seoConfig.title.default}
        />
        <meta
          property="og:description"
          content={meta.description || seoConfig.description}
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`${seoConfig.openGraph.url}${pagePath}`} />
        <meta property="og:type" content="article" />

        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={seoConfig.twitter.site} />
        <meta name="twitter:creator" content={seoConfig.twitter.creator} />
        <meta name="twitter:title" content={title ? title + ' – DeroPay' : seoConfig.title.default} />
        <meta name="twitter:description" content={meta.description || seoConfig.description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Canonical URL */}
        <link rel="canonical" href={`${seoConfig.openGraph.url}${pagePath}`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TechArticle',
              headline: title || seoConfig.title.default,
              description: meta.description || seoConfig.description,
              image: imageUrl,
              author: meta.authors || 'DHEBP',
              datePublished: meta.date || undefined,
              dateModified: meta.lastUpdated || undefined,
              mainEntityOfPage: `${seoConfig.openGraph.url}${pagePath}`,
            }),
          }}
        />

        <meta name="apple-mobile-web-app-title" content="DeroPay" />
      </>
    )
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: false
  },
  toc: {
    float: true,
  },
  feedback: {
    content: null,
  },
  editLink: {
    text: null,
  },
  navigation: {
    prev: true,
    next: true
  },
  gitTimestamp: null,
  darkMode: true,
  themeSwitch: {
    useOptions() {
      return {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      }
    }
  },
  footer: {
    text: (
      <div className="flex w-full flex-col items-center sm:items-start">
        <p>Privacy by Default</p>
        <p className="mt-2 text-xs">
          &copy; {new Date().getFullYear()} DHEBP
        </p>
      </div>
    )
  }
}

export default config
