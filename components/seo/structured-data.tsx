'use client'

import { useMemo } from 'react'

interface StructuredDataProps {
  type: 'faq' | 'article' | 'breadcrumb' | 'webpage'
  data: any
}

// JSON-LD structured data for SEO — developer-controlled schema, not user input
export function StructuredData({ type, data }: StructuredDataProps) {
  const schema = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'

    switch (type) {
      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.map((item: any) => ({
            "@type": "Question",
            "name": item.question || item.name || '',
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer || item.acceptedAnswer?.text || ''
            }
          }))
        }

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": { "@type": "Person", "name": data.author || "Team" },
          "publisher": {
            "@type": "Organization",
            "name": "Your App",
            "logo": { "@type": "ImageObject", "url": `${baseUrl}/favicon.svg` }
          },
          "datePublished": data.datePublished,
          "dateModified": data.dateModified || data.datePublished,
          "image": data.image || `${baseUrl}/favicon.svg`,
        }

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }

      case 'webpage':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": data.name,
          "description": data.description,
          "url": data.url,
        }

      default:
        return null
    }
  }, [type, data])

  if (!schema) return null

  // Schema is developer-defined structured data, not user-generated content
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
