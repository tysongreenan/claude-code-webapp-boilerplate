#!/bin/bash
# ── Webapp Boilerplate v2 — Setup Script ─────────────────
# Checks for required CLIs and walks you through configuration.

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Webapp Boilerplate v2 — Setup           ║"
echo "║  Convex + Clerk + Stripe + AI            ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Check CLIs ───────────────────────────────────────────

check_cli() {
  local name=$1
  local install_cmd=$2
  local required=$3

  if command -v "$name" &> /dev/null; then
    version=$($name --version 2>/dev/null | head -1 || echo "installed")
    echo -e "  ${GREEN}✓${NC} $name ($version)"
    return 0
  else
    if [ "$required" = "required" ]; then
      echo -e "  ${RED}✗${NC} $name — REQUIRED"
      echo -e "    Install: ${YELLOW}$install_cmd${NC}"
      return 1
    else
      echo -e "  ${YELLOW}○${NC} $name — optional"
      echo -e "    Install: ${YELLOW}$install_cmd${NC}"
      return 0
    fi
  fi
}

echo "Checking CLIs..."
echo ""

missing=0

check_cli "node" "https://nodejs.org" "required" || missing=$((missing + 1))
check_cli "npm" "comes with Node.js" "required" || missing=$((missing + 1))
check_cli "npx" "comes with npm" "required" || missing=$((missing + 1))
check_cli "git" "https://git-scm.com" "required" || missing=$((missing + 1))

echo ""
echo "Development CLIs..."
echo ""

check_cli "vercel" "npm i -g vercel" "optional"
check_cli "stripe" "brew install stripe/stripe-cli/stripe" "optional"
# Convex CLI is bundled in node_modules — no global install needed

echo ""

if [ $missing -gt 0 ]; then
  echo -e "${RED}$missing required CLI(s) missing. Install them and re-run this script.${NC}"
  exit 1
fi

# ── Check npm dependencies ───────────────────────────────

echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo -e "  ${YELLOW}Installing npm packages...${NC}"
  npm install
else
  echo -e "  ${GREEN}✓${NC} node_modules exists"
fi

echo ""

# ── Check .env.local ─────────────────────────────────────

echo "Checking environment..."
if [ ! -f ".env.local" ]; then
  echo -e "  ${YELLOW}Creating .env.local from .env.example...${NC}"
  cp .env.example .env.local
  echo -e "  ${YELLOW}⚠ Fill in your keys in .env.local before running the app${NC}"
else
  echo -e "  ${GREEN}✓${NC} .env.local exists"
fi

echo ""

# ── Service setup reminders ──────────────────────────────

echo "Service accounts needed:"
echo ""
echo "  1. Convex     → npx convex dev (creates account + project automatically)"
echo "  2. Clerk      → https://dashboard.clerk.com (free tier)"
echo "  3. Stripe     → https://dashboard.stripe.com (test mode)"
echo "  4. OpenAI     → https://platform.openai.com/api-keys (for AI chatbot)"
echo "  5. Pinecone   → https://app.pinecone.io (free tier, create index 'knowledge')"
echo "  6. Upstash    → https://console.upstash.com (free tier Redis)"
echo "  7. PostHog    → https://posthog.com (free tier analytics)"
echo "  8. Sentry     → https://sentry.io (free tier error tracking)"
echo "  9. Resend     → https://resend.com (free tier email)"
echo ""

# ── Generate admin setup key ─────────────────────────────

ADMIN_KEY=$(openssl rand -hex 24 2>/dev/null || head -c 48 /dev/urandom | xxd -p | head -c 48)
echo "Admin setup key generated (save this — you'll need it once to claim admin):"
echo ""
echo -e "  ${GREEN}$ADMIN_KEY${NC}"
echo ""
echo "Set it in Convex now:"
echo -e "  ${YELLOW}npx convex env set ADMIN_SETUP_KEY $ADMIN_KEY${NC}"
echo ""

echo "Other Convex environment variables:"
echo ""
echo "  npx convex env set CLERK_JWT_ISSUER_DOMAIN https://..."
echo "  npx convex env set STRIPE_SECRET_KEY sk_test_..."
echo "  npx convex env set STRIPE_WEBHOOK_SECRET whsec_..."
echo "  npx convex env set OPENAI_API_KEY sk-..."
echo "  npx convex env set PINECONE_API_KEY ..."
echo "  npx convex env set PINECONE_INDEX knowledge"
echo "  npx convex env set RESEND_API_KEY re_..."
echo ""

echo -e "${GREEN}Setup complete!${NC} Run: npm run dev"
echo ""
echo "After starting, visit /admin/setup and enter the admin key above to claim admin."
echo ""
