---
name: stripe-integration
description: Stripe payment patterns for Convex. Use when implementing checkout, subscriptions, or webhooks.
---

# Stripe + Convex

## Architecture

Stripe logic lives in two places:
1. **`convex/stripe.ts`** — Convex actions for creating checkout/portal sessions
2. **`app/api/stripe/webhook/route.ts`** — Next.js route for Stripe webhooks

## Flow
1. Client calls `useAction(api.stripe.createCheckout)` with priceId
2. Convex action creates Stripe Checkout Session, returns URL
3. User completes payment on Stripe
4. Stripe sends webhook to `/api/stripe/webhook`
5. Webhook calls `convex.mutation(api.stripe.upgradeUser)` to upgrade

## Environment Variables
Set in Convex (not .env.local):
```bash
npx convex env set STRIPE_SECRET_KEY sk_test_...
npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
```

## Key Points
- Checkout sessions include `tokenIdentifier` in metadata to link back to user
- Webhook verifies signature before processing
- `upgradeUser` and `downgradeUser` are `internalMutation` — not callable from client
