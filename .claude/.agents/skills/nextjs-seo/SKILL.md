---
name: nextjs-seo
description: Next.js SEO optimization. Use when building pages or implementing metadata.
---

# Next.js SEO

## Essential Files
- `app/layout.tsx` — Root metadata
- `app/sitemap.ts` — XML sitemap
- `app/robots.ts` — Robots configuration

## Page Metadata
```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description (150-160 chars)',
  alternates: { canonical: '/page-path' },
  openGraph: { title: '...', description: '...', type: 'article' },
}
```

## Key Rules
1. Every indexable page needs unique title + description
2. Use `alternates.canonical` on all pages
3. Blog posts use `generateStaticParams` for SSG
4. Use `robots: { index: false }` for dashboard/auth pages
5. Use semantic HTML (h1-h6, article, nav, main)
