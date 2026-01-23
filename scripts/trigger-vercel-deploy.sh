#!/bin/bash

# Trigger Vercel Deployment via Git Hook
# This forces Vercel to recognize the new commit

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Triggering Vercel Deployment...${NC}"
echo ""

# Create an empty commit to trigger Vercel's webhook
echo -e "${YELLOW}📝 Creating deployment trigger commit...${NC}"
git commit --allow-empty -m "chore: trigger Vercel deployment [skip ci]"

echo -e "${YELLOW}📤 Pushing to trigger Vercel...${NC}"
git push origin main

echo ""
echo -e "${GREEN}✅ Deployment trigger sent!${NC}"
echo -e "${BLUE}📊 Monitor deployment at:${NC}"
echo "   https://vercel.com/dashboard"
echo "   https://romeomukulah.org"
echo ""
echo -e "${YELLOW}💡 If Vercel still doesn't deploy:${NC}"
echo "   1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "   2. Click on 'portfolio-app' project"
echo "   3. Go to Settings > Git"
echo "   4. Check 'Production Branch' is set to 'main'"
echo "   5. Reconnect GitHub integration if needed"
