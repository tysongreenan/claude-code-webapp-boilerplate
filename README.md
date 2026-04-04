# Claude Code Webapp Boilerplate v2 — Convex Edition

A simpler, real-time production boilerplate designed for [Claude Code](https://claude.ai/claude-code). Convex replaces Prisma + Supabase. Clerk replaces NextAuth. Fewer files, fewer configs, more power.

## v1 vs v2

| | v1 (Supabase) | v2 (Convex) |
|---|---|---|
| **Database** | Supabase + Prisma ORM | Convex (built-in) |
| **Auth** | NextAuth.js (manual config) | Clerk (managed) |
| **Real-time** | None (manual polling) | Automatic (every query) |
| **Migrations** | Prisma migrate | None (auto-deploy) |
| **Backend files** | prisma/ + lib/auth.ts + lib/prisma.ts + lib/supabase-client.ts + 6 API routes | convex/ + 1 API route |
| **Packages** | prisma + @prisma/client + @supabase/supabase-js + next-auth + bcryptjs | convex + @clerk/nextjs |
| **Cache invalidation** | Manual | None needed |

## What's Included

| Feature | Stack |
|---------|-------|
| **Backend** | Convex (real-time database, server functions) |
| **Auth** | Clerk (email/password + Google OAuth) |
| **Payments** | Stripe (checkout, subscriptions, webhooks, portal) |
| **Email** | Resend (via Convex actions) |
| **Teams** | Multi-workspace with roles |
| **Blog** | Markdown with SEO + static generation |
| **SEO** | Metadata, sitemap, robots, Open Graph |
| **Design** | Tailwind + Radix UI + dark mode |
| **Claude Code** | CLAUDE.md agent team + 6 skill files |

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/claude-code-webapp-boilerplate-v2.git my-app
cd my-app
npm install
```

### 2. Set up Convex

```bash
npx convex dev
# This creates your backend, generates types, and starts watching for changes
```

### 3. Set up Clerk

1. Create a Clerk app at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy your keys to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
3. In Clerk Dashboard, set up a JWT template for Convex
4. Set the issuer domain in Convex:
   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-domain.clerk.accounts.dev
   ```

### 4. Set up Stripe

```bash
npx convex env set STRIPE_SECRET_KEY sk_test_...
npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
```

### 5. Run

```bash
npm run dev
# Starts both Next.js and Convex dev server
```

### 6. Build with Claude Code

```bash
claude
```

## Project Structure

```
convex/                 # Backend (schema, queries, mutations, actions)
app/                    # Next.js pages
  api/stripe/webhook/   # Only API route (everything else is Convex)
  auth/                 # Clerk sign-in/sign-up
  blog/                 # Markdown blog
  dashboard/            # Real-time dashboard
components/ui/          # Button, Card, Input
lib/                    # utils, blog parser
content/blog/           # Markdown posts
.claude/                # Agent team + skills
```

## The Real-Time Demo

Open `/dashboard` in two browser tabs. Create a project in one — it appears in the other instantly. No refresh, no polling, no WebSocket setup. This is what Convex gives you for free.

## License

MIT
