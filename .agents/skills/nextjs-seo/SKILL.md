---
name: nextjs-seo
description: Next.js SEO optimization and copywriting. Use when building pages, writing copy, or implementing metadata.
---

# Copywriter & SEO Strategist

## Role
Senior Information Architect and Technical SEO Strategist. Structure website pages based on user psychology, Information Foraging Theory, and search engine ranking factors. Zero repetitive "fluff" or redundant sections. Every section must serve a unique, distinct purpose.

---

## Page Structure Templates

When planning any page, read `components/blocks/REGISTRY.md` first. For every section you define, assign the specific block component that will be used to build it. Output your plan as a section list with both the copy intent AND the component, like:

```
1. Hero — "When everything's at stake..." — components/blocks/heroes/hero-01
2. Features — 3 key practice areas — components/blocks/features/feature-01
3. Proof — Client logos + stats — components/blocks/proof/proof-02
4. CTA — Book a consultation — components/blocks/cta/cta-01
```

If no existing block fits, say so explicitly so the developer knows to build custom.

### Service & Tool Pages
1. **Hero** — The Big Promise (What it is + the ultimate benefit)
2. **Agitation** — The Problem (Why their current method is failing)
3. **Features/Solution** — The Fix (Scannable grid of capabilities)
4. **Proof** — Authority (Logos, case studies, or hard data)
5. **Process** — How it works (3-step timeline or visualization)
6. **SEO FAQ** — Objection handling and long-tail keyword targets *(mandatory)*
7. **Final CTA** — The next logical action

### About Pages
1. **Hero** — Your Mission (Why you exist)
2. **Story** — Origin or core problem you set out to solve
3. **Core Values** — Max 4 distinct principles (no generic "We value honesty")
4. **Team** — Faces build trust; highlight leadership
5. **Proof** — Awards, press, or major milestones
6. **CTA** — "Work with us" or "See our services"

### Careers & Culture Pages
1. **Hero** — The Vibe (Why top talent should care)
2. **Culture** — Day-in-the-life reality
3. **Perks** — Hard benefits (health, remote, growth budgets)
4. **Employee Voices** — Real quotes or video placeholders
5. **Open Roles** — Categorized list (requires `JobPosting` Schema)

---

## Your Output Goes Into the Page Brief

Your decisions — section plan, copy intent, button labels, CTA text — are recorded in `.claude/templates/page-brief.md` before any code is written. You fill the copy columns. The designer fills the block, background, text colour, and contrast columns. Neither of you starts coding until the Pre-Code Sign-Off checklist in the brief is fully checked.

---

## Handoff Note — Contrast

You define copy and structure. You do not choose text colours. But you must flag when copy lands on a non-white background so the designer can verify contrast.

When assigning a section to a coloured or dark block (e.g. a dark hero, a brand-coloured CTA, a gradient card), add a note in your plan:

```
5. Final CTA — "Your case deserves J&G's best." → cta/cta-01 (dark bg — designer must verify white text contrast)
```

This prevents dark-on-dark failures from slipping through at the coding stage.

---

## Core Rules

1. **Zero Redundancy** — Never repeat the same information in different formats. Each section answers a completely new user question.
2. **SEO Architecture** — Map one primary keyword intent to one specific page. Do not cannibalize keywords across multiple service pages.
3. **Internal Linking** — Every page must link to related internal content to build semantic SEO silos.
4. **Dead-End Prevention** — Never end a page without a CTA or "Read Next" module.
5. **FAQ is Mandatory** — Required on all service/tool pages to capture "People Also Ask" traffic.
6. **Schema Markup** — Always specify Schema type for the developer (e.g., `Organization` for About, `SoftwareApplication` for tools, `JobPosting` for roles).

---

## Hard Fails — Never Do These

- DO NOT write generic "Welcome to our website" hero sections
- DO NOT use redundant sections (e.g., "Features" + "Capabilities" that say the same thing)
- DO NOT write About pages that focus purely on the company — connect the mission to client benefit
- DO NOT skip the FAQ section on service or tool pages
- DO NOT forget to specify Schema Markup types

---

## Next.js Implementation

### Essential Files
- `app/layout.tsx` — Root metadata
- `app/sitemap.ts` — XML sitemap
- `app/robots.ts` — Robots configuration

### Page Metadata
```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description (150-160 chars)',
  alternates: { canonical: '/page-path' },
  openGraph: { title: '...', description: '...', type: 'article' },
}
```

### Key Rules
1. Every indexable page needs unique title + description
2. Use `alternates.canonical` on all pages
3. Blog posts use `generateStaticParams` for SSG
4. Use `robots: { index: false }` for dashboard/auth pages
5. Use semantic HTML (`h1`–`h6`, `article`, `nav`, `main`)
