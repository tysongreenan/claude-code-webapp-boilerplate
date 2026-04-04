---
name: convex-backend
description: Convex backend patterns for this boilerplate. Use when writing queries, mutations, actions, or modifying the schema.
---

# Convex Backend Patterns

## Three Function Types

| Type | Purpose | Side effects? | Cached? |
|------|---------|---------------|---------|
| `query` | Read data | No | Yes, auto-subscribed |
| `mutation` | Write data | DB only | No |
| `action` | External APIs | Yes (Stripe, email) | No |

## Schema (`convex/schema.ts`)
- Define tables with `defineTable()` and validators from `v`
- Indexes declared inline: `.index("by_user", ["userId"])`
- No migration files — schema deploys automatically with `npx convex dev`
- Use `v.id("tableName")` for foreign keys (no implicit joins)

## Query Pattern
```typescript
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    return await ctx.db.query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})
```

## Mutation Pattern
```typescript
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")
    return await ctx.db.insert("projects", { name: args.name, userId: user._id })
  },
})
```

## Action Pattern (external APIs)
```typescript
export const sendEmail = action({
  args: { to: v.string(), subject: v.string() },
  handler: async (ctx, args) => {
    // Actions CAN call external APIs
    const resend = new Resend(process.env.RESEND_API_KEY!)
    await resend.emails.send({ ... })
    // Save results back via mutation
    await ctx.runMutation(internal.logs.save, { ... })
  },
})
```

## Key Rules
1. **Queries are deterministic** — no `Date.now()`, no `Math.random()`, no external calls
2. **Mutations are transactional** — all writes succeed or all fail
3. **Actions are NOT transactional** — use for Stripe, email, external APIs
4. **Always validate auth** — use `getCurrentUser()` from `convex/model/auth.ts`
5. **Args are auto-validated** — Convex validators replace Zod at the DB layer
6. **Internal functions** — use `internalMutation`/`internalQuery` for functions only callable by other functions (not client)
