# Webapp Boilerplate v2 — Convex + Clerk + AI

## Tech Stack
- **Framework:** Next.js 14, React 18, TypeScript
- **Backend:** Convex (real-time database, server functions, file storage)
- **Auth:** Clerk (managed authentication, Google OAuth, email/password)
- **Styling:** Tailwind CSS, Radix UI, Framer Motion
- **Payments:** Stripe (checkout, subscriptions, webhooks)
- **Email:** Resend (transactional email via Convex actions)
- **AI Chatbot:** OpenAI embeddings + Pinecone vector DB + RAG
- **Analytics:** PostHog (product analytics, session replay, feature flags)
- **Error Tracking:** Sentry (error capture, performance monitoring)
- **Cache/Rate Limiting:** Upstash Redis (serverless)
- **Content:** Markdown blog (gray-matter, remark)
- **Deployment:** Vercel (frontend) + Convex Cloud (backend)

---

## Agent Team

### Main Coder (Opus) — Primary agent
**Role:** Writes all code, coordinates the team, makes architectural decisions.
**Skills:**
- Next.js 14 App Router, React Server Components
- Convex — schema, queries, mutations, actions
- Clerk — authentication, middleware
- OpenAI + Pinecone — embeddings, RAG, AI chatbot
- Stripe — checkout, subscriptions, webhooks
- Tailwind CSS, Radix UI, Framer Motion
- PostHog, Sentry, Upstash integration

### Frontend Designer (Opus)
**Role:** UX/UI specialist.
**Skills files:**
- `.claude/.agents/skills/frontend-design/SKILL.md`
- `.claude/.agents/skills/brand-guidelines/SKILL.md`

### Backend Developer (Opus)
**Role:** Backend specialist for Convex, AI, Stripe, deployment.
**Skills files:**
- `.claude/.agents/skills/convex-backend/SKILL.md`
- `.claude/.agents/skills/stripe-integration/SKILL.md`
- `.claude/.agents/skills/ai-chatbot/SKILL.md`

### Code Reviewer (Sonnet)
**Role:** Reviews code. Catches bugs, security issues, performance problems.

### File Master (Haiku)
**Role:** Fast codebase navigator.

### Blog Content Writer (Opus)
**Role:** SEO blog content specialist.

### Copywriter (Haiku)
**Role:** User-facing text and SEO.
**Skill file:** `.claude/.agents/skills/nextjs-seo/SKILL.md`

---

## Workflow
1. **Find** — File Master locates relevant code
2. **Design** — Frontend Designer for UX/UI guidance
3. **Copy** — Copywriter for text and SEO
4. **Code** — Main Coder implements
5. **Review** — Code Reviewer checks quality
6. **Fix** — Address feedback

---

## Project Structure

```
convex/                 # Backend
  schema.ts             # Database schema (users, teams, projects, payments, AI knowledge base)
  auth.config.ts        # Clerk provider config
  users.ts              # User CRUD (synced from Clerk)
  projects.ts           # Projects (real-time)
  teams.ts              # Teams + invitations
  stripe.ts             # Stripe actions + mutations
  email.ts              # Resend email actions
  ai.ts                 # AI pipeline (ingest, embed, chat)
  model/auth.ts         # getCurrentUser() helper
app/                    # Next.js pages
  api/stripe/webhook/   # Stripe webhook (only API route)
  auth/                 # Clerk sign-in/register
  blog/                 # Markdown blog
  dashboard/            # Real-time dashboard
components/
  ui/                   # Button, Card, Input
  chat/                 # AI chatbot widget
  providers/            # Convex + Clerk + PostHog + Theme
lib/
  utils.ts              # cn(), formatDate
  blog.ts               # Markdown blog parser
  upstash.ts            # Redis client, rate limiter, cache helpers
  sentry.ts             # Error capture helper
sentry.client.config.ts # Sentry browser config
sentry.server.config.ts # Sentry server config
scripts/setup.sh        # CLI checker + setup wizard
content/blog/           # Markdown posts
middleware.ts           # Clerk auth middleware
```

## Key Patterns

### Real-Time Data
Every `useQuery` is a live subscription. No polling, no cache invalidation. Open two tabs to see it.

### AI Chatbot (RAG)
- Ingest: text → chunk → embed (OpenAI) → store (Pinecone + Convex)
- Chat: question → embed → search Pinecone → top 5 chunks → GPT-4o-mini → answer
- Widget: `<ChatWidget />` — floating bubble on every page

### Payments
Stripe checkout via Convex actions. Webhook at `/api/stripe/webhook` calls Convex mutations.

### Observability
- **PostHog** — auto-tracks pageviews, identifies users via Clerk
- **Sentry** — catches errors client + server, session replay on errors

### Rate Limiting
`lib/upstash.ts` — `createRateLimiter()` for API protection

## CLI Tools

| CLI | Install | Purpose |
|-----|---------|---------|
| Node.js | nodejs.org | Runtime |
| Convex | `npm install convex` (bundled) | Backend dev |
| Vercel | `npm i -g vercel` | Deploy frontend |
| Stripe | `brew install stripe/stripe-cli/stripe` | Test webhooks |

## Setup
Run `bash scripts/setup.sh` for guided setup.
