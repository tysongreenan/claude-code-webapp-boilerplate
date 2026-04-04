---
name: deploy
description: Pre-flight checks then deploy to Vercel. Validates build, env vars, and runs post-deploy verification.
user_invocable: true
---

# /deploy — Safe Deploy to Vercel

Run pre-flight checks, deploy, and verify the deployment works.

## Steps

### 1. Pre-flight checks

Run these in parallel:

**Build check:**
```bash
npm run build
```
If build fails, fix the errors before deploying.

**Env var check:**
```bash
vercel env ls
```
Verify all required env vars are set. Compare against `.env.example`.

**Git check:**
```bash
git status
git log --oneline -3
```
Warn if there are uncommitted changes.

### 2. Deploy

If argument is "prod" or "production":
```bash
vercel --prod
```

Otherwise preview deployment:
```bash
vercel
```

### 3. Post-deploy verification

After deployment completes:

```bash
# Get the deployment URL
DEPLOY_URL=$(vercel ls --limit 1 --json | jq -r '.[0].url')

# Health check
curl -s "https://$DEPLOY_URL/api/health" | jq .

# Check the page loads
curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOY_URL"
```

### 4. Report

- Deployment URL
- Build time
- Health check result
- Any warnings from pre-flight

## Usage

Preview deploy:
```
/deploy
```

Production deploy:
```
/deploy prod
```
