# Claude Code Webapp Boilerplate v2 — Full Stack + AI

A production-ready, AI-powered webapp boilerplate designed for [Claude Code](https://claude.ai/claude-code). Real-time backend, managed auth, payments, AI chatbot, analytics, error tracking — everything wired up.

## The Stack

| Layer | Tool | Why |
|-------|------|-----|
| **Frontend** | Next.js 14, React 18, TypeScript | Industry standard |
| **Backend** | Convex | Real-time DB, server functions, no migrations |
| **Auth** | Clerk | Managed auth, OAuth, zero config |
| **Payments** | Stripe | Checkout, subscriptions, webhooks, portal |
| **AI Chatbot** | OpenAI + Pinecone | RAG-powered support bot on every page |
| **Email** | Resend | Transactional email (welcome, invites) |
| **Analytics** | PostHog | Product analytics, session replay, feature flags |
| **Errors** | Sentry | Error tracking, performance monitoring |
| **Cache** | Upstash Redis | Rate limiting, caching |
| **Design** | Tailwind + Radix UI | HSL theming, dark mode, accessible |
| **Content** | Markdown blog | SEO-optimized, static generation |
| **Deploy** | Vercel + Convex Cloud | Zero config deployment |
| **AI Dev** | Claude Code | Agent team with 7 skill files |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/claude-code-webapp-boilerplate-v2.git my-app
cd my-app

# 2. Open Claude Code and let it handle everything
claude

# Then just say:
# "Set up the project"
#
# Claude Code will:
# - Install dependencies
# - Initialize Convex
# - Ask you for API keys (one by one)
# - Configure all environment variables
# - Generate your admin setup key
# - Start the dev server
# - Walk you through admin claim
#
# The entire setup is pre-planned in .claude/plans/setup.md
```

### Manual setup (without Claude Code)

```bash
bash scripts/setup.sh    # Check CLIs, install deps, generate admin key
npx convex dev            # Initialize Convex backend
# Fill in .env.local + Convex env vars (see .env.example)
npm run dev               # Start dev server
```

## What's Included

### Core Features
- **Auth** — Clerk sign-in/sign-up with Google OAuth, protected routes
- **Dashboard** — Real-time project list (open in 2 tabs to see live updates)
- **Teams** — Multi-workspace with roles (owner/admin/editor/viewer)
- **Payments** — Stripe checkout, subscription management, customer portal
- **Blog** — Markdown-based with SEO, reading time, static generation

### AI Chatbot
Every site gets a floating AI support agent. The pipeline:
1. **Ingest** — Add your docs/FAQ/pages as text
2. **Embed** — OpenAI chunks and vectorizes content
3. **Store** — Pinecone holds vectors, Convex holds chunks
4. **Chat** — Users ask questions, get answers from YOUR content

### Observability
- **PostHog** — Auto-tracks pageviews, identifies Clerk users, session replay
- **Sentry** — Catches errors on client + server, performance monitoring
- **Upstash Redis** — Rate limiting for APIs, caching for expensive queries

## Services You'll Need

| Service | Free Tier | Dashboard |
|---------|-----------|-----------|
| Convex | 1M function calls/mo | `npx convex dev` (auto-creates) |
| Clerk | 10K MAU | [dashboard.clerk.com](https://dashboard.clerk.com) |
| Stripe | Test mode free | [dashboard.stripe.com](https://dashboard.stripe.com) |
| OpenAI | Pay per token | [platform.openai.com](https://platform.openai.com) |
| Pinecone | 1 index free | [app.pinecone.io](https://app.pinecone.io) |
| Upstash | 10K cmds/day | [console.upstash.com](https://console.upstash.com) |
| PostHog | 1M events/mo | [posthog.com](https://posthog.com) |
| Sentry | 5K errors/mo | [sentry.io](https://sentry.io) |
| Resend | 100 emails/day | [resend.com](https://resend.com) |

## Environment Variables

**In `.env.local`** (Next.js client):
```
CONVEX_DEPLOYMENT, NEXT_PUBLIC_CONVEX_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
NEXT_PUBLIC_SENTRY_DSN
UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
```

**In Convex** (server functions — set via `npx convex env set`):
```
CLERK_JWT_ISSUER_DOMAIN
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
PINECONE_API_KEY, PINECONE_INDEX
RESEND_API_KEY, RESEND_FROM_EMAIL
```

## Project Structure

```
convex/                 # Backend (replaces API routes + DB layer)
  schema.ts             # All tables (users, teams, projects, payments, AI)
  ai.ts                 # RAG pipeline (ingest, embed, chat)
  users.ts, projects.ts, teams.ts, stripe.ts, email.ts
app/                    # Next.js pages
  api/stripe/webhook/   # Only API route needed
components/
  chat/chat-widget.tsx  # Floating AI chatbot
  ui/                   # Button, Card, Input
  providers/            # Convex + Clerk + PostHog + Theme
lib/                    # Utils, blog parser, Upstash, Sentry
scripts/setup.sh        # CLI checker + setup wizard
.claude/                # Agent team (7 roles) + 7 skill files
```

## Stripe Testing

```bash
npm run dev                    # Terminal 1
npm run stripe:listen          # Terminal 2
# Use test card: 4242 4242 4242 4242
```

## Deploy

```bash
# Frontend
vercel

# Backend (automatic with Convex)
npx convex deploy
```

## License

MIT — use for any project, personal or commercial.
