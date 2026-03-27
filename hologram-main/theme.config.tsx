import React from 'react'
import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import { useConfig } from 'nextra-theme-docs'
import seoConfig from './seo.config'

// Hologram Logo - Official wordmark
const logo = (
  <div className="flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 727.4 63.8"
      fill="#22d3ee"
      height="24"
      style={{ display: 'block', maxWidth: '140px', width: 'auto' }}
    >
      {/* HOLOGRAM wordmark - Orbitron Bold */}
      {/* H */}
      <polygon points="50.9 26.5 13 26.5 13 3 2.4 3 2.4 60.8 13 60.8 13 37.3 50.9 37.3 50.9 60.8 61.5 60.8 61.5 3 50.9 3 50.9 26.5"/>
      {/* O */}
      <path d="M146,4.5c-1.7-1-3.5-1.5-5.6-1.5h-35.5c-2,0-3.9.5-5.6,1.5-1.7,1-3,2.4-4.1,4.1-1,1.7-1.5,3.5-1.5,5.6v35.5c0,2,.5,3.9,1.5,5.6,1,1.7,2.4,3,4.1,4.1,1.7,1,3.5,1.5,5.6,1.5h35.5c2,0,3.9-.5,5.6-1.5,1.7-1,3-2.4,4.1-4.1,1-1.7,1.5-3.5,1.5-5.6V14.2c0-2-.5-3.9-1.5-5.6-1-1.7-2.4-3-4.1-4.1ZM140.9,49.2c0,.3-.1.5-.3.7-.2.2-.5.3-.7.3h-34.5c-.3,0-.5,0-.7-.3-.2-.2-.3-.4-.3-.7V14.7c0-.3,0-.5.3-.7.2-.2.4-.3.7-.3h34.5c.3,0,.5,0,.7.3.2.2.3.4.3.7v34.5Z"/>
      {/* L */}
      <polygon points="200.7 2.9 190.1 2.9 190.1 60.8 247.9 60.8 247.9 50.1 200.7 50.1 200.7 2.9"/>
      {/* O */}
      <path d="M332.4,4.5c-1.7-1-3.5-1.5-5.6-1.5h-35.5c-2,0-3.9.5-5.6,1.5-1.7,1-3,2.4-4.1,4.1-1,1.7-1.5,3.5-1.5,5.6v35.5c0,2,.5,3.9,1.5,5.6,1,1.7,2.4,3,4.1,4.1,1.7,1,3.5,1.5,5.6,1.5h35.5c2,0,3.9-.5,5.6-1.5,1.7-1,3-2.4,4.1-4.1,1-1.7,1.5-3.5,1.5-5.6V14.2c0-2-.5-3.9-1.5-5.6-1-1.7-2.4-3-4.1-4.1ZM327.3,49.2c0,.3-.1.5-.3.7-.2.2-.5.3-.7.3h-34.5c-.3,0-.5,0-.7-.3-.2-.2-.3-.4-.3-.7V14.7c0-.3,0-.5.3-.7.2-.2.4-.3.7-.3h34.5c.3,0,.5,0,.7.3.2.2.3.4.3.7v34.5Z"/>
      {/* G */}
      <path d="M426.7,4.5c-1.7-1-3.6-1.5-5.6-1.5h-35.4c-2,0-3.9.5-5.6,1.5-1.7,1-3,2.4-4.1,4.1-1,1.7-1.5,3.5-1.5,5.6v35.5c0,2,.5,3.9,1.5,5.6,1,1.7,2.4,3,4.1,4.1,1.7,1,3.5,1.5,5.6,1.5h35.4c2,0,3.9-.5,5.6-1.5,1.7-1,3.1-2.4,4.1-4.1,1-1.7,1.5-3.5,1.5-5.6v-21.6h-23.8v10.7h13.1v10.4c0,.3-.1.5-.3.7-.2.2-.5.3-.7.3h-34.5c-.3,0-.5,0-.7-.3-.2-.2-.3-.4-.3-.7V14.7c0-.3,0-.5.3-.7.2-.2.4-.3.7-.3h34.5c.3,0,.5,0,.7.3.2.2.3.4.3.7v4h10.7v-4.5c0-2-.5-3.9-1.5-5.6-1-1.7-2.4-3-4.1-4.1Z"/>
      {/* R */}
      <path d="M521.1,4.6c-1.7-1-3.6-1.5-5.6-1.5h-46.6v57.7h10.6v-19.7h18.9s16.6,19.7,16.6,19.7h11.6v-3l-14.3-16.8h3.2c2,0,3.9-.5,5.6-1.5,1.7-1,3.1-2.3,4.1-4.1,1-1.7,1.5-3.6,1.5-5.6v-15.6c0-2-.5-3.9-1.5-5.6-1-1.7-2.4-3-4.1-4.1ZM516,29.4c0,.3-.1.5-.3.6-.2.2-.5.2-.7.2h-34.5c-.3,0-.5,0-.7-.2-.2-.2-.3-.4-.3-.6v-14.8c0-.3,0-.5.3-.7.2-.2.4-.3.7-.3h34.5c.3,0,.5,0,.7.3.2.2.3.4.3.7v14.8Z"/>
      {/* A */}
      <path d="M616.4,4.5c-1.7-1-3.6-1.5-5.6-1.5h-35.4c-2,0-3.9.5-5.6,1.5-1.7,1-3,2.4-4.1,4.1-1,1.7-1.5,3.5-1.5,5.6v46.6h10.6v-19.4h36.5v19.4h10.7V14.2c0-2-.5-3.9-1.5-5.6-1-1.7-2.4-3-4.1-4.1ZM611.3,30.8h-36.5V14.7c0-.3,0-.5.3-.7s.4-.3.7-.3h34.5c.3,0,.5,0,.7.3.2.2.3.4.3.7v16.1Z"/>
      {/* M */}
      <polygon points="713.3 3 692.4 28 671.5 3 659.9 3 659.9 60.8 670.5 60.8 670.5 18.5 692.4 44.5 714.4 18.4 714.4 60.8 725 60.8 725 3 713.3 3"/>
    </svg>
  </div>
)

const config: DocsThemeConfig = {
  // Cyan primary color matching Hologram app design (#22d3ee)
  primaryHue: { dark: 187, light: 187 },
  primarySaturation: { dark: 85, light: 85 },
  project: {
    link: 'https://github.com/DHEBP/HOLOGRAM-git'
  },
  docsRepositoryBase: 'https://github.com/DHEBP/dero-docs',
  useNextSeoProps() {
    const { route } = useRouter()
    const { url, images } = seoConfig.openGraph

    if (route === '/') {
      return { titleTemplate: '%s - Hologram' }
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
        {seoConfig.icons.map((icon: any, index) => (
          <link key={index} rel={icon.rel} type={icon.type} href={icon.url} />
        ))}
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content={meta.description || seoConfig.description}
        />
        
        {/* OpenGraph tags */}
        <meta
          property="og:title"
          content={title ? title + ' - Hologram' : seoConfig.title.default}
        />
        <meta
          property="og:description"
          content={meta.description || seoConfig.description}
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${seoConfig.openGraph.url}${pagePath}`} />
        <meta property="og:type" content={meta.ogType || (pagePath === '/' ? 'website' : 'article')} />
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={seoConfig.twitter.site} />
        <meta name="twitter:creator" content={seoConfig.twitter.creator} />
        <meta name="twitter:title" content={title ? title + ' - Hologram' : seoConfig.title.default} />
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
        
        <meta name="apple-mobile-web-app-title" content="Hologram" />
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
        <p>Privacy Together</p>
        <p className="mt-2 text-xs">
          {new Date().getFullYear()} DHEBP - Hologram Documentation
        </p>
      </div>
    )
  }
}

export default config

