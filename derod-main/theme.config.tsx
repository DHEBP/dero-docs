import React from 'react'
import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import { useConfig } from 'nextra-theme-docs'
import seoConfig from './seo.config'

const logo = (
  <svg
    height="37"
    viewBox="0 0 1685.95 487.8"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    transform="translate(-10)"
  >
<defs>
        <linearGradient
          id="linear-gradient"
          x1="1040.85"
          y1="45.15"
          x2="1040.85"
          y2="414.71"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b2b3b3" />
          <stop offset="1" stopColor="#686868" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="642.69"
          y1="45.15"
          x2="642.69"
          y2="414.71"
          xlinkHref="#linear-gradient"
        />
        <linearGradient
          id="linear-gradient-3"
          x1="244.5"
          y1="45.15"
          x2="244.5"
          y2="414.71"
          xlinkHref="#linear-gradient"
        />
        <linearGradient
          id="linear-gradient-4"
          x1="1439.2"
          y1="45.15"
          x2="1439.2"
          y2="414.71"
          xlinkHref="#linear-gradient"
        />
      </defs>
      <path
        className="cls-1"
        fill="url(#linear-gradient)"
        d="m1161.9,81.21l41.73,42.17v101.32l-41.84,42.1h-92.62v4.82c1.35.18,134.42,134.93,134.42,134.93h-64.29l-135.63-139.28h-78.62v139.28h-46.97V81.21h283.83Zm-236.76,139.03h218.1l13.96-13.78v-64.88l-13.87-13.63h-218.19v92.29Z"
      />
      <path
        className="cls-4"
        fill="url(#linear-gradient)"
        d="m538.48,127.19l-9.63,10.09v73.45l9.94,9.84h268.75v46.27h-269.02l-9.63,9.93v73.8l9.97,9.36h268.78v46.43h-283.3l-46.59-46.5v-92.64l22.74-18.93v-8.64l-22.74-19.27v-92.55l46.55-46.6h283.12v45.96h-268.93Z"
      />
      <path
        className="cls-2"
        fill="url(#linear-gradient)"
        d="m365.32,81.32l41.91,42.28v240.78l-41.94,41.96H81.76V81.32h283.56Zm-236.84,46.42v231.86h218.29l14.07-13.77v-204.06l-13.92-14.04h-218.44Z"
      />
      <path
        className="cls-3"
        fill="url(#linear-gradient)"
        d="m1604.19,127.82v231.98l-46.42,46.8h-237.05l-46.51-46.97v-231.61l46.31-46.75h237.33l46.33,46.55Zm-268.52,231.71h207.59l10.06-9.01v-213.26l-9.76-9.44h-208.57l-9.41,9.62v213l10.08,9.08Z"
      />
    <style jsx>{`
      svg {
        mask-image: linear-gradient(
          60deg,
          black 25%,
          rgba(0, 0, 0, 0.2) 50%,
          black 75%
        );
        mask-size: 400%;
        mask-position: 0%;
      }
      svg:hover {
        mask-position: 100%;
        transition:
          mask-position 1s ease,
          -webkit-mask-position 1s ease;
      }
    `}</style>
  </svg>
)


const config: DocsThemeConfig = {
  primaryHue: { dark: 193, light: 193 }, // Teal/cyan hue for DERO branding
  primarySaturation: { dark: 63, light: 63 }, // Adjust the saturation value for the desired intensity
  project: {
    link: 'https://github.com/deroproject/derohe'
  },
  docsRepositoryBase: 'https://github.com/DHEBP/dero-docs',
  useNextSeoProps() {
    const { route } = useRouter()

    if (route === '/') {
      return { titleTemplate: '%s – DERO', description: '' }
    }

    return {
      titleTemplate: seoConfig.title.template,
      description: ''
    }
  },
  logo,

  head: () => {
    const { frontMatter: meta } = useConfig()
    const { title } = meta
    const router = useRouter()
    const pagePath = router.asPath

    // Get image from frontmatter or fallback to default
    const imageUrl = meta.image 
      ? (meta.image.startsWith('http') ? meta.image : `${seoConfig.openGraph.url}${meta.image}`)
      : `${seoConfig.openGraph.url}${seoConfig.openGraph.images}`

    // Organization schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://derod.org/#organization',
      name: 'DHEBP',
      url: 'https://derod.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://derod.org/assets/apple-touch-icon.png',
        width: 180,
        height: 180
      },
      description: 'Community-maintained documentation for the DERO blockchain, covering nodes, mining, wallets, smart contracts, and privacy technology.',
      sameAs: [
        'https://github.com/DHEBP'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        url: 'https://discord.com/invite/H95TJDp'
      }
    }

    // WebSite schema with SearchAction
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://derod.org/#website',
      name: 'DERO Documentation',
      alternateName: 'derod.org',
      url: 'https://derod.org',
      description: 'Complete guide to DERO blockchain: nodes, mining, wallets, smart contracts, and privacy technology.',
      publisher: { '@id': 'https://derod.org/#organization' },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://derod.org/?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    }

    // SoftwareApplication schema for DERO
    const softwareSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'DERO Blockchain',
      applicationCategory: 'BlockchainApplication',
      operatingSystem: 'Windows, macOS, Linux',
      description: 'Privacy-focused Layer-1 blockchain with homomorphic encryption, private smart contracts, and TELA decentralized apps.',
      url: 'https://github.com/deroproject/derohe',
      downloadUrl: 'https://github.com/deroproject/derohe/releases',
      softwareVersion: '142',
      author: { '@type': 'Organization', name: 'DERO Project' },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      featureList: [
        'Homomorphic encryption',
        'Private smart contracts',
        'Ring signatures',
        'Bulletproofs',
        'TELA decentralized web apps',
        'DVM-BASIC smart contract language',
        'CPU-friendly AstroBWT mining'
      ]
    }

    // TechArticle schema for individual pages
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title || seoConfig.title.default,
      description: meta.description || seoConfig.description,
      image: imageUrl,
      author: {
        '@type': 'Organization',
        name: meta.authors || 'DERO Community'
      },
      publisher: { '@id': 'https://derod.org/#organization' },
      datePublished: meta.date || undefined,
      dateModified: meta.lastUpdated || undefined,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${seoConfig.openGraph.url}${pagePath}`
      },
      isPartOf: { '@id': 'https://derod.org/#website' }
    }

    // Combine schemas into a graph
    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        organizationSchema,
        websiteSchema,
        ...(pagePath === '/' ? [softwareSchema] : []),
        articleSchema
      ]
    }

    return (
      <>
        {seoConfig.icons.map((icon, index) => (
          <link key={index} rel={icon.rel} href={icon.url} />
        ))}
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          key="description"
          name="description"
          content={meta.description || seoConfig.description}
        />
        
        {/* OpenGraph tags */}
        <meta
          key="og:title"
          property="og:title"
          content={title ? title + ' – DERO' : seoConfig.title.default}
        />
        <meta
          key="og:description"
          property="og:description"
          content={meta.description || seoConfig.description}
        />
        <meta key="og:image" property="og:image" content={imageUrl} />
        <meta key="og:url" property="og:url" content={`${seoConfig.openGraph.url}${pagePath}`} />
        <meta key="og:type" property="og:type" content="article" />
        
        {/* Twitter tags */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content={seoConfig.twitter.site} />
        <meta key="twitter:creator" name="twitter:creator" content={seoConfig.twitter.creator} />
        <meta key="twitter:title" name="twitter:title" content={title ? title + ' – DERO' : seoConfig.title.default} />
        <meta key="twitter:description" name="twitter:description" content={meta.description || seoConfig.description} />
        <meta key="twitter:image" name="twitter:image" content={imageUrl} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${seoConfig.openGraph.url}${pagePath}`} />

        {/* AI Discovery Links */}
        <link rel="alternate" type="text/plain" href="https://derod.org/llms.txt" title="LLM Documentation" />
        <link rel="alternate" type="application/json" href="https://derod.org/api/openapi.json" title="OpenAPI Specification" />
        
        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema),
          }}
        />
        
        <meta name="apple-mobile-web-app-title" content="DERO" />
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
     toc:{
      float:true,
     },
     feedback: {
      content: null, // Set to null or an empty value to disable the feedback link
     },
     editLink: {
        text: null,
       },
       navigation: {
          prev: false,
          next: false
        },
        gitTimestamp: null,
        darkMode:true,
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textAlign: 'center' }}>
        <div
          className="dero-footer-links"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem 1.25rem', marginBottom: '1rem', fontSize: '0.875rem' }}
        >
          <a href="/basics/running-a-node" style={{ opacity: 0.7 }}>Run a node</a>
          <a href="/basics/wallets" style={{ opacity: 0.7 }}>Wallets &amp; downloads</a>
          <a href="https://github.com/deroproject/derohe" target="_blank" rel="noreferrer" style={{ opacity: 0.7 }}>GitHub</a>
          <a href="https://github.com/civilware" target="_blank" rel="noreferrer" style={{ opacity: 0.7 }}>Civilware</a>
          <a href="https://discord.com/invite/H95TJDp" target="_blank" rel="noreferrer" style={{ opacity: 0.7 }}>Discord</a>
          <a href="https://matrix.to/#/#general:matrix.dero.live" target="_blank" rel="noreferrer" style={{ opacity: 0.7 }}>Matrix</a>
        </div>
        <p style={{ margin: 0 }}>Privacy Together</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} DHEBP
          <span style={{ opacity: 0.4 }}> · </span>
          <a href="/captain" style={{ opacity: 0.6 }}>Captain Archive</a>
        </p>
        <style jsx>{`
          .dero-footer-links a {
            transition: opacity 0.2s ease;
          }
          .dero-footer-links a:hover {
            opacity: 1 !important;
          }
        `}</style>
      </div>
    )
  }
}

export default config