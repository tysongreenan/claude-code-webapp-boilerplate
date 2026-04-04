# Webapp Boilerplate v2 — Convex + Clerk

## Tech Stack
- **Framework:** Next.js 14, React 18, TypeScript
- **Backend:** Convex (real-time database, server functions, file storage)
- **Auth:** Clerk (managed authentication, Google OAuth, email/password)
- **Styling:** Tailwind CSS, Radix UI, Framer Motion
- **Payments:** Stripe (checkout, subscriptions, webhooks)
- **Email:** Resend (transactional email via Convex actions)
- **Content:** Markdown blog (gray-matter, remark)
- **Deployment:** Vercel (frontend) + Convex Cloud (backend)

---

## Agent Team

### Main Coder (Opus) — Primary agent
**Role:** Writes all code, coordinates the team, makes architectural decisions.
**Skills:**
- Next.js 14 App Router, React Server Components
- TypeScript, async/await, Promises
- Convex — schema, queries, mutations, actions
- Clerk — authentication, middleware, user management
- Tailwind CSS, Radix UI, Framer Motion
- Stripe — checkout, subscriptions, webhooks
- Git workflow and version control

### Frontend Designer (Opus)
**Role:** UX/UI specialist. Consulted for layout, component design, and user experience.
**Skills files:** Must read and follow:
- `.claude/.agents/skills/frontend-design/SKILL.md`
- `.claude/.agents/skills/brand-guidelines/SKILL.md`

### Backend Developer (Opus)
**Role:** Backend specialist for Convex, Stripe, and deployment.
**Skills files:** Must read and follow:
- `.claude/.agents/skills/convex-backend/SKILL.md`
- `.claude/.agents/skills/stripe-integration/SKILL.md`

### Code Reviewer (Sonnet)
**Role:** Reviews code. Catches bugs and suggests improvements.

### File Master (Haiku)
**Role:** Fast codebase navigator. Searches files, finds definitions.

### Blog Content Writer (Opus)
**Role:** SEO blog content specialist. Writes long-form blog posts.

### Copywriter (Haiku)
**Role:** Writes all user-facing text and handles SEO.
**Skill file:** `.claude/.agents/skills/nextjs-seo/SKILL.md`

---

## Workflow
1. **Find** — Ask File Master (Haiku) to locate relevant code
2. **Design** — Ask Frontend Designer (Opus) for UX/UI guidance
3. **Copy** — Ask Copywriter (Haiku) for text content and SEO
4. **Code** — Main Coder (Opus) writes the implementation
5. **Review** — Send to Code Reviewer (Sonnet)
6. **Fix** — Address review feedback

---

## Project Structure

```
convex/                 # Convex backend (replaces prisma/ + lib/auth + API routes)
  schema.ts             # Database schema (tables, indexes, validators)
  auth.config.ts        # Clerk auth provider config
  users.ts              # User queries/mutations (synced from Clerk)
  projects.ts           # Project CRUD (real-time)
  teams.ts              # Team management + invitations
  stripe.ts             # Stripe checkout/portal actions + upgrade mutations
  email.ts              # Resend email actions
  model/auth.ts         # getCurrentUser() helper
app/                    # Next.js App Router
  api/stripe/webhook/   # Only API route needed (Stripe webhook)
  auth/                 # Clerk sign-in/sign-up pages
  blog/                 # Blog (index + [slug])
  dashboard/            # Protected dashboard (real-time)
components/
  ui/                   # Button, Card, Input (shadcn pattern)
  providers/            # Convex + Clerk + Theme provider
lib/
  utils.ts              # cn(), formatDate, etc.
  blog.ts               # Markdown blog utilities
content/blog/           # Markdown blog posts
middleware.ts           # Clerk auth middleware
```

## Key Patterns

### Convex Functions (3 types)
- **Queries** — read-only, cached, auto-subscribed via `useQuery`
- **Mutations** — read-write, transactional, called via `useMutation`
- **Actions** — side effects (Stripe, Resend), called via `useAction`

### Auth Flow
- Clerk handles all sign-in/sign-up UI and OAuth
- Clerk webhook syncs user to Convex via `users.upsertFromClerk`
- `getCurrentUser()` helper resolves Clerk identity → Convex user record
- Middleware protects `/dashboard` routes

### Real-Time
- Every `useQuery` is a live subscription — no polling, no cache invalidation
- Mutations update all connected clients instantly via WebSocket
- Open two tabs to see it in action

### Payments
- `convex/stripe.ts` creates checkout sessions (action) and upgrades users (mutation)
- Stripe webhook at `/api/stripe/webhook` calls Convex mutations directly
- Customer portal for subscription management
