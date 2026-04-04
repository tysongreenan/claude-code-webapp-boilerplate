# Project Setup Plan

> **Trigger:** User says "set up the project", "get started", "initialize", or "configure everything"
>
> Follow this plan step by step. Use the agent team to parallelize where marked.

---

## Phase 1 — Prerequisites (File Master checks)

**Agent:** File Master (Haiku) — fast checks in parallel

- [ ] Verify Node.js 20+ is installed: `node --version`
- [ ] Verify npm is installed: `npm --version`
- [ ] Check if `node_modules/` exists — if not, run `npm install`
- [ ] Check if `.env.local` exists — if not, copy from `.env.example`
- [ ] Check if `convex/_generated/` exists — if not, Convex needs initialization

**Output:** Report what's missing before proceeding.

---

## Phase 2 — Service Accounts (Ask the user)

Tell the user they need accounts for these services. List them all at once so they can open tabs in parallel:

```
You'll need accounts on these services (all have free tiers):

1. Convex     → npx convex dev (creates account automatically)
2. Clerk      → https://dashboard.clerk.com
3. Stripe     → https://dashboard.stripe.com
4. OpenAI     → https://platform.openai.com/api-keys
5. Pinecone   → https://app.pinecone.io (create index "knowledge", dimension 1536, cosine)
6. Upstash    → https://console.upstash.com (create a Redis database)
7. PostHog    → https://posthog.com
8. Sentry     → https://sentry.io
9. Resend     → https://resend.com

Open these now and I'll configure everything as you give me the keys.
```

**Do NOT proceed until user confirms they have at least Convex + Clerk ready.**
The others (Stripe, OpenAI, Pinecone, etc.) can be added later.

---

## Phase 3 — Initialize Convex

- [ ] Run `npx convex dev` — this creates the Convex project and generates types
- [ ] Wait for it to complete and confirm `convex/_generated/` exists
- [ ] Note the `NEXT_PUBLIC_CONVEX_URL` it outputs

**If user already has a Convex project:** Run `npx convex dev` to connect to it.

---

## Phase 4 — Configure Environment Variables

### 4a. Convex server env vars (set via CLI)

Ask the user for each key and set them one by one:

```bash
# REQUIRED — secures the admin panel
npx convex env set ADMIN_SETUP_KEY $(openssl rand -hex 24)

# Auth
npx convex env set CLERK_JWT_ISSUER_DOMAIN <ask user>

# Payments (can skip for now — Stripe will be non-functional)
npx convex env set STRIPE_SECRET_KEY <ask user>
npx convex env set STRIPE_WEBHOOK_SECRET <ask user>

# AI Chatbot (can skip for now — chatbot will show "not configured")
npx convex env set OPENAI_API_KEY <ask user>
npx convex env set PINECONE_API_KEY <ask user>
npx convex env set PINECONE_INDEX knowledge

# Email (can skip — emails won't send)
npx convex env set RESEND_API_KEY <ask user>
```

**IMPORTANT:** Generate the ADMIN_SETUP_KEY automatically and tell the user:
```
Your admin setup key is: <generated-key>
Save this — you'll enter it once at /admin/setup after the app starts.
```

### 4b. Next.js client env vars (.env.local)

Write these to `.env.local`:

```
CONVEX_DEPLOYMENT=<from npx convex dev output>
NEXT_PUBLIC_CONVEX_URL=<from npx convex dev output>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<ask user>
CLERK_SECRET_KEY=<ask user>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<ask user or leave empty>
NEXT_PUBLIC_POSTHOG_KEY=<ask user or leave empty>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_SENTRY_DSN=<ask user or leave empty>
UPSTASH_REDIS_REST_URL=<ask user or leave empty>
UPSTASH_REDIS_REST_TOKEN=<ask user or leave empty>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Minimum viable setup:** Only Convex + Clerk keys are required to start.
Everything else gracefully degrades (chatbot shows fallback, Stripe disabled, etc.)

---

## Phase 5 — Start Dev Server

- [ ] Run `npm run dev` (starts both Next.js and Convex)
- [ ] Verify http://localhost:3000 loads
- [ ] Verify the landing page renders

---

## Phase 6 — Claim Admin Access

Tell the user:
```
1. Go to http://localhost:3000/auth/register and create your account
2. Go to http://localhost:3000/admin/setup
3. Enter the admin setup key I generated: <the-key>
4. You're now the site admin!
```

---

## Phase 7 — Verify Features (Code Reviewer validates)

**Agent:** Code Reviewer (Sonnet) — verify each feature works

- [ ] Landing page loads at /
- [ ] Sign up / sign in works via Clerk
- [ ] Dashboard loads at /dashboard (shows user info)
- [ ] Admin panel loads at /admin (shows stats)
- [ ] Knowledge base at /admin/knowledge (form renders)
- [ ] Blog loads at /blog with sample post
- [ ] Chat widget appears (floating bubble in bottom-right)

---

## Phase 8 — Optional Enhancements

After the base is working, ask the user what they want to build. Then:

**Agent:** Frontend Designer (Opus) — for UI/UX decisions
**Agent:** Backend Developer (Opus) — for data model and API design
**Agent:** Copywriter (Haiku) — for page copy and SEO metadata

Suggested first tasks:
- [ ] Customize brand colors in `app/globals.css`
- [ ] Update site name and metadata in `app/layout.tsx`
- [ ] Add content to the knowledge base at /admin/knowledge
- [ ] Create Stripe products and add price IDs to env
- [ ] Replace favicon at `public/favicon.svg`
- [ ] Write first real blog post in `content/blog/`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `convex/_generated` missing | Run `npx convex dev` |
| Clerk sign-in fails | Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in .env.local |
| Admin setup says "key not configured" | Run `npx convex env set ADMIN_SETUP_KEY <key>` |
| Chat widget says "not configured" | Set OPENAI_API_KEY and PINECONE_API_KEY in Convex |
| Stripe checkout fails | Set STRIPE_SECRET_KEY in Convex env vars |
| PostHog not tracking | Set NEXT_PUBLIC_POSTHOG_KEY in .env.local |
