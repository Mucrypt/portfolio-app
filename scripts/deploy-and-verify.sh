#!/bin/bash

# Enhanced Deployment Script with Vercel Verification
# Usage: ./scripts/deploy-and-verify.sh "commit message"

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Full Deploy + Vercel Verification       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Run the standard deploy
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Commit message required${NC}"
  echo "Usage: ./scripts/deploy-and-verify.sh \"your commit message\""
  exit 1
fi

echo -e "${BLUE}🚀 Running full deployment...${NC}"
bash scripts/deploy-full.sh "$1"

# Step 2: Wait a bit for GitHub Actions to trigger Vercel
echo ""
echo -e "${YELLOW}⏳ Waiting 10 seconds for Vercel webhook...${NC}"
sleep 10

# Step 3: Check Vercel status
echo -e "${BLUE}🔍 Checking Vercel deployment status...${NC}"
echo ""

# Try to get latest deployment info (requires vercel CLI)
if command -v vercel &> /dev/null; then
  echo -e "${GREEN}✅ Vercel CLI found - checking deployment...${NC}"
  cd /home/mukulah/portfolio-app
  vercel ls --limit 1 2>/dev/null || echo -e "${YELLOW}⚠️  Could not fetch deployment info${NC}"
else
  echo -e "${YELLOW}⚠️  Vercel CLI not installed${NC}"
  echo -e "${BLUE}💡 Install with: npm i -g vercel${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      Deployment Verification Complete      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📊 Check deployment status:${NC}"
echo -e "   🌐 Vercel Dashboard: ${BLUE}https://vercel.com/dashboard${NC}"
echo -e "   🔄 GitHub Actions: ${BLUE}https://github.com/Mucrypt/portfolio-app/actions${NC}"
echo -e "   ✨ Live Site: ${GREEN}https://romeomukulah.org${NC}"
echo ""
echo -e "${YELLOW}⚠️  If deployment didn't trigger:${NC}"
echo -e "   1. Check Vercel Dashboard → Settings → Git"
echo -e "   2. Ensure 'Production Branch' is set to 'main'"
echo -e "   3. Verify GitHub integration is connected"
echo -e "   4. Run: ${BLUE}bash scripts/trigger-vercel-deploy.sh${NC}"
echo ""
