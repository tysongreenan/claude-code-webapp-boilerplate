---
name: convex-backend
description: Convex backend patterns. Use when writing queries, mutations, actions, or modifying the schema.
---

# Convex Backend Patterns

## Three Function Types

| Type | Purpose | Side effects? | Cached? |
|------|---------|---------------|---------|
| `query` | Read data | No | Yes, auto-subscribed |
| `mutation` | Write data | DB only | No |
| `action` | External APIs | Yes (Stripe, OpenAI, email) | No |

## Schema (`convex/schema.ts`)
- Tables with `defineTable()` + validators from `v`
- Indexes inline: `.index("by_user", ["userId"])`
- No migration files — deploys automatically
- `v.id("tableName")` for foreign keys

## Auth
- NextAuth provides session via JWT cookies — middleware checks `next-auth.session-token`
- `getCurrentUserByEmail(ctx, email)` from `convex/model/auth.ts` resolves email → user record
- `getCurrentUser(ctx)` uses Convex auth identity (legacy Clerk path, still works)
- `internalMutation` / `internalQuery` for server-only functions

## Environment Variables
Set via CLI (NOT .env.local):
```bash
npx convex env set KEY value
npx convex env list
```

## Key Rules
1. Queries are deterministic — no Date.now(), no Math.random()
2. Mutations are transactional — all writes succeed or fail
3. Actions for external APIs (Stripe, OpenAI, Resend, Pinecone)
4. Always validate auth with `getCurrentUser()`
5. Args auto-validated by Convex validators (replaces Zod)
6. Use `internal` imports for server-only functions
