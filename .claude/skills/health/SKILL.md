---
name: health
description: Check all connected services are working — Convex, Clerk, Stripe, OpenAI, Pinecone, Upstash, PostHog, Sentry.
user_invocable: true
---

# /health — Service Health Check

Verify all services are connected and responding.

## Steps

Check each service. Report status as OK / WARN / FAIL.

### 1. Convex
```bash
npx convex env list 2>/dev/null && echo "OK" || echo "FAIL"
```
Also check: does `convex/_generated/api.ts` exist?

### 2. Clerk
Check if keys are set in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — should start with `pk_`
- `CLERK_SECRET_KEY` — should start with `sk_`

### 3. Stripe
Check Convex env:
```bash
npx convex env list | grep STRIPE
```
Should see `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

### 4. OpenAI
```bash
npx convex env list | grep OPENAI
```
Should see `OPENAI_API_KEY`.

### 5. Pinecone
```bash
npx convex env list | grep PINECONE
```
Should see `PINECONE_API_KEY` and `PINECONE_INDEX`.

### 6. Upstash Redis
Check `.env.local` for `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

### 7. PostHog
Check `.env.local` for `NEXT_PUBLIC_POSTHOG_KEY`.

### 8. Sentry
Check `.env.local` for `NEXT_PUBLIC_SENTRY_DSN`.

### 9. Resend
```bash
npx convex env list | grep RESEND
```

### 10. Admin
```bash
npx convex env list | grep ADMIN_SETUP_KEY
```

## Report Format

```
Service Health Check
─────────────────────
Convex    ✓ OK
Clerk     ✓ OK
Stripe    ✓ OK
OpenAI    ✓ OK
Pinecone  ○ NOT SET (chatbot won't work)
Upstash   ○ NOT SET (rate limiting disabled)
PostHog   ○ NOT SET (analytics disabled)
Sentry    ○ NOT SET (error tracking disabled)
Resend    ✓ OK
Admin Key ✓ OK

7/10 services configured
Core services (Convex, Clerk, Stripe): ALL OK
```

Mark NOT SET as warnings (not failures) — the app still works without optional services.

## Usage

```
/health
```

Schedule daily health check:
```
/schedule "Health check" --cron "0 8 * * *" --prompt "/health"
```
