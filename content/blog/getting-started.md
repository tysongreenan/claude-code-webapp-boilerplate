---
title: "Getting Started with the Boilerplate"
description: "How to set up and customize this boilerplate for your own project. Clone, configure, and ship in minutes."
date: "2026-04-04"
author: "team"
tags: ["Guide", "Setup"]
published: true
keywords: ["nextjs boilerplate", "claude code", "webapp starter", "convex setup"]
schema:
  mainEntity:
    - name: "How do I set up the boilerplate?"
      acceptedAnswer:
        text: "Clone the repo, open Claude Code, and say 'set up the project'. Claude handles deps, backend init, env vars, and the dev server automatically."
    - name: "What do I need to get started?"
      acceptedAnswer:
        text: "Node.js 20+, a Convex account (free), and a Clerk account (free). Everything else is optional."
    - name: "Can I use this for commercial projects?"
      acceptedAnswer:
        text: "Yes, the boilerplate is MIT licensed. Use it for personal or commercial projects."
---

<div class="direct-answer">
<strong>Direct Answer:</strong> Clone the repo, open Claude Code, and type "set up the project." Claude handles everything — dependencies, backend, env vars, admin key, and dev server. You'll be building in under 5 minutes.
</div>

---

## Table of Contents

- [What's included](#whats-included)
- [Quick setup](#quick-setup)
- [How the blog works](#how-the-blog-works)
- [Frequently Asked Questions](#frequently-asked-questions)

---

## What's included

This boilerplate gives you a complete product foundation:

- **Auth + Teams** — sign-in, Google OAuth, workspaces with roles
- **Payments** — Stripe checkout, subscriptions, webhooks, customer portal
- **AI Chatbot** — RAG-powered support bot trained on your content
- **Admin Dashboard** — real-time stats, user management, knowledge base
- **63 UI Components** — full shadcn library ready to use
- **105 Block Templates** — pre-built page sections for rapid development

---

## Quick setup

### Step 1: Clone

```bash
git clone https://github.com/your-repo my-app
cd my-app
```

### Step 2: Let Claude handle it

```bash
claude
# Then type: "set up the project"
```

Claude Code reads the pre-built setup plan and:
1. Installs dependencies
2. Initializes your backend
3. Asks for API keys one by one
4. Generates your admin setup key
5. Starts the dev server

### Step 3: Claim admin

1. Register at `http://localhost:3000/auth/register`
2. Go to `http://localhost:3000/admin/setup`
3. Enter the admin key Claude generated

---

## How the blog works

Blog posts are markdown files in `content/blog/`. Each post has:

- **Frontmatter** — title, description, date, tags, keywords, canonical URL
- **Direct Answer box** — for AEO (Answer Engine Optimization)
- **Table of Contents** — auto-generated from headings
- **FAQ section** — with JSON-LD structured data for Google
- **Related posts** — shown at the bottom, matched by tags

See `content/blog/BLOG_WRITING_GUIDE.md` for the complete format.

---

## Frequently Asked Questions

### How do I set up the boilerplate?

**Answer:** Clone the repo, open Claude Code, and say "set up the project." Claude handles deps, backend init, env vars, and the dev server automatically.

### What do I need to get started?

**Answer:** Node.js 20+, a Convex account (free), and a Clerk account (free). Everything else (Stripe, OpenAI, PostHog, etc.) is optional and can be added later.

### Can I use this for commercial projects?

**Answer:** Yes, the boilerplate is MIT licensed. Use it for personal or commercial projects without restrictions.

---

**Ready to build?** Clone the repo and let Claude Code handle the setup.
