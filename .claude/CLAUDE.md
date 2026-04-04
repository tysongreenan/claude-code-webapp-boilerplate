# Webapp Boilerplate v2 — Convex + Clerk + AI

## FIRST TIME SETUP
**When the user says "set up the project", "get started", "initialize", or "configure everything":**
Read and follow the plan at `.claude/plans/setup.md` — it has the complete step-by-step
setup process with agent assignments, environment variable configuration, and verification steps.
The plan is designed to one-shot the entire setup with minimal back-and-forth.

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

## Setup (Claude Code handles this)

When the user says "set up the project" or "get started", follow these steps:

### 1. Install dependencies
```bash
npm install
```

### 2. Initialize Convex
```bash
npx convex dev
```
This creates the Convex project and generates `convex/_generated/`.

### 3. Set Convex environment variables
The user will provide API keys. Set them with:
```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN <value>
npx convex env set STRIPE_SECRET_KEY <value>
npx convex env set STRIPE_WEBHOOK_SECRET <value>
npx convex env set OPENAI_API_KEY <value>
npx convex env set PINECONE_API_KEY <value>
npx convex env set PINECONE_INDEX knowledge
npx convex env set RESEND_API_KEY <value>
```

### 4. Generate and set the admin setup key
This is critical — it secures the /admin panel:
```bash
# Generate a random key
openssl rand -hex 24
# Set it in Convex
npx convex env set ADMIN_SETUP_KEY <the-generated-key>
```
Tell the user to save this key — they'll enter it once at /admin/setup to claim admin access.

### 5. Create .env.local
Copy `.env.example` to `.env.local` and fill in the client-side keys (NEXT_PUBLIC_*).

### 6. Start dev server
```bash
npm run dev
```

### Admin Security
- The ADMIN_SETUP_KEY prevents random users from claiming admin after deployment
- Only someone with the key can become admin at /admin/setup
- After claiming, the key is no longer needed (one-time use)
- Additional admins can be granted by existing admins from the admin panel

---

## Slash Commands (Custom Skills)

These are pre-built skills the user can invoke:

| Command | What it does |
|---------|-------------|
| `/monitor` | Check Vercel logs for errors, diagnose and fix them |
| `/deploy` or `/deploy prod` | Pre-flight checks → deploy → post-deploy verification |
| `/health` | Check all 10 services are connected and responding |
| `/ingest-blog` | Feed all blog posts into the AI chatbot knowledge base |

### Automation with Loop and Schedule

These commands are designed to work with Claude Code's automation features:

**Continuous monitoring (during development):**
```
/loop 5m /monitor
```
Checks Vercel logs every 5 minutes. Auto-fixes code bugs it finds.

**Daily health check:**
```
/schedule "Daily health" --cron "0 9 * * *" --prompt "/health"
```

**When the user says "monitor my site" or "set up monitoring":**
Read and follow `.claude/plans/ops.md` — it has the full ops automation playbook.

---

## Plans

| Plan | Trigger | File |
|------|---------|------|
| **Setup** | "set up the project", "get started" | `.claude/plans/setup.md` |
| **Ops** | "monitor my site", "set up monitoring" | `.claude/plans/ops.md` |
