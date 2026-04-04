# Ops Plan — Ongoing AI-Powered Site Maintenance

> **Trigger:** User says "monitor my site", "watch for errors", "set up monitoring",
> or "keep the site healthy"
>
> This plan sets up autonomous maintenance using Claude Code's loop and schedule features.

---

## Recommended Monitoring Setup

Tell the user these commands and what each does:

### 1. Continuous error monitoring (while developing)
```
/loop 5m /monitor
```
Every 5 minutes, checks Vercel logs for errors and auto-fixes what it can.
Great for development — catches bugs as they happen.

### 2. Daily health check
```
/schedule "Daily health check" --cron "0 9 * * *" --prompt "/health"
```
Every morning at 9am, verifies all services are connected. Alerts if anything is down.

### 3. Post-deploy verification
After every deploy, run:
```
/deploy prod
```
This includes pre-flight checks AND post-deploy verification automatically.

### 4. Blog content sync
After writing new blog posts:
```
/ingest-blog
```
Feeds new content to the AI chatbot so it stays current.

---

## What Claude Code Can Automate

| Task | Command | Frequency |
|------|---------|-----------|
| Error detection + fix | `/loop 5m /monitor` | Every 5 min (dev) |
| Service health check | `/schedule` + `/health` | Daily |
| Safe deploys | `/deploy prod` | On demand |
| Blog → chatbot sync | `/ingest-blog` | After new posts |
| Dependency updates | `npm outdated` → review → update | Weekly |
| Security audit | `npm audit` → fix | Weekly |

---

## Error Response Protocol

When `/monitor` finds an error:

### Severity: Critical (5xx in production)
1. Read the stack trace
2. Identify the broken file and line
3. Fix the bug
4. Show the diff to the user
5. If confident, suggest immediate deploy

### Severity: Warning (slow functions, high error rate)
1. Identify the pattern (which endpoint, how often)
2. Suggest optimization (caching, index, query fix)
3. Create a task for the fix

### Severity: Info (deprecation warnings, non-blocking)
1. Log it
2. Add to a "tech debt" list
3. Don't interrupt the user

---

## Using Hooks for Automation

Claude Code hooks can automate behaviors. Add these to your settings if you want:

### Auto-lint after editing
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": { "toolName": "Edit" },
      "command": "npx next lint --file $TOOL_INPUT_FILE_PATH --quiet 2>/dev/null || true"
    }]
  }
}
```

### Auto-build check before committing
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": { "toolName": "Bash", "command": "git commit" },
      "command": "npm run build 2>&1 | tail -5"
    }]
  }
}
```

---

## Scaling Checklist

When the site grows, use Claude Code to handle these:

- [ ] Set up Vercel Analytics (built into Vercel dashboard)
- [ ] Configure Sentry alerts for error spikes
- [ ] Set up PostHog funnels for conversion tracking
- [ ] Add Upstash rate limiting to public API routes
- [ ] Configure Stripe webhook retry policies
- [ ] Set up Convex usage alerts
- [ ] Add database indexes for slow queries (check Convex dashboard)
- [ ] Configure CDN caching headers for static assets
