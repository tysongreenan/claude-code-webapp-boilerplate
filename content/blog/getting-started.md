---
title: "Getting Started with the Boilerplate"
description: "How to set up and customize this boilerplate for your own project."
date: "2026-04-04"
author: "Team"
tags: ["guide", "setup"]
---

## Welcome

This boilerplate uses **Convex** for the backend and **Clerk** for auth — giving you real-time data and managed authentication out of the box.

## What's different from v1

- **Real-time by default** — every `useQuery` auto-subscribes via WebSocket
- **No migrations** — schema changes deploy automatically with `npx convex dev`
- **Managed auth** — Clerk handles sign-in, sign-up, OAuth, email verification
- **Fewer moving parts** — no Prisma, no Supabase, no NextAuth config

## Quick start

1. Clone the repo and run `npm install`
2. Run `npx convex dev` to set up your Convex backend
3. Add your Clerk keys to `.env.local`
4. Run `npm run dev` to start both Next.js and Convex

## The real-time demo

Open your dashboard in two browser tabs. Create a project in one — it appears in the other instantly, no refresh needed. This is Convex's killer feature.
