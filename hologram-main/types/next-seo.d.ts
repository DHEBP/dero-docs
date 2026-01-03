declare module 'next-seo' {
  export interface NextSeoProps {
    title?: string
    description?: string
    canonical?: string
    openGraph?: {
      url?: string
      title?: string
      description?: string
      images?: Array<{
        url: string
        width?: number
        height?: number
        alt?: string
      }>
    }
  }
}

