import React from 'react'
import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import { useConfig } from 'nextra-theme-docs'
import seoConfig from './seo.config'

const logo = (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
    <svg
      height="22"
      width="22"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M50,.3L7,25.2v49.7l43,24.8,43-24.8V25.2L50,.3ZM77,65.6l-27,15.6-27-15.6v-31.1l27-15.6,27,15.6v31.1Z"
        fill="#10B981"
      />
      <path
        d="M26.8,36.6v26.8l13.3,7.7c0-.4,1.6-10.3,1.8-11.7l-4.1-2.4v-14.1l12.2-7,12.2,7v14.1l-4.2,2.4c.2,1.4,1.7,11.2,1.8,11.7l13.4-7.7v-26.8l-23.2-13.4-23.2,13.4Z"
        fill="#10B981"
      />
      <path
        d="M58.3,54.8v-9.6l-8.3-4.8-8.3,4.8v9.6l4.6,2.7c-.2,1.4-2.3,15-2.4,15.8l6.1,3.5,6.2-3.6c-.1-.7-2.2-14.4-2.4-15.8l4.5-2.6Z"
        fill="#10B981"
      />
    </svg>
    <span style={{ fontWeight: 700, fontSize: '18px', whiteSpace: 'nowrap' }}>DeroPay</span>
  </span>
)

const config: DocsThemeConfig = {
  primaryHue: { dark: 160, light: 160 },
  primarySaturation: { dark: 84, light: 84 },
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
