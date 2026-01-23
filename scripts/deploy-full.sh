#!/bin/bash

# Full Deployment Script - Push to GitHub and Deploy to Vercel
# Usage: ./scripts/deploy-full.sh "commit message"

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Deploy to GitHub → Vercel Auto-Deploy   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Get commit message
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Commit message required${NC}"
  echo "Usage: ./scripts/deploy-full.sh \"your commit message\""
  exit 1
fi

COMMIT_MESSAGE="$1"
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${YELLOW}📋 Current branch: ${CURRENT_BRANCH}${NC}"
echo ""

# Step 1: Check for uncommitted changes
echo -e "${BLUE}🔍 Step 1/8: Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  Uncommitted changes found${NC}"
  git status -s
else
  echo -e "${GREEN}✅ Working directory clean${NC}"
fi
echo ""

# Step 2: Run linting
echo -e "${BLUE}🔍 Step 2/8: Running ESLint...${NC}"
if npm run lint:summary; then
  echo ""
else
  echo -e "${RED}❌ Critical linting errors found. Fix before deploying.${NC}"
  exit 1
fi

# Step 3: Run TypeScript check
echo -e "${BLUE}🔍 Step 3/8: Running TypeScript check...${NC}"
if npm run type-check 2>/dev/null || npx tsc --noEmit; then
  echo -e "${GREEN}✅ TypeScript check passed${NC}"
else
  echo -e "${RED}❌ TypeScript check failed. Fix errors before deploying.${NC}"
  exit 1
fi
echo ""

# Step 4: Check for critical build issues (without full build)
echo -e "${BLUE}⚡ Step 4/8: Pre-flight checks...${NC}"
echo -e "${YELLOW}ℹ️  Skipping local build (Vercel will build in the cloud)${NC}"
echo -e "${GREEN}✅ All checks passed - ready to deploy${NC}"
echo ""

# Step 5: Commit changes
echo -e "${BLUE}📝 Step 5/8: Committing changes...${NC}"
git add .
if git commit -m "$COMMIT_MESSAGE"; then
  echo -e "${GREEN}✅ Changes committed${NC}"
else
  echo -e "${YELLOW}⚠️  No changes to commit or commit failed${NC}"
fi
echo ""

# Step 6: Push to current branch
echo -e "${BLUE}🚀 Step 6/8: Pushing to ${CURRENT_BRANCH}...${NC}"
if git push origin "$CURRENT_BRANCH"; then
  echo -e "${GREEN}✅ Pushed to GitHub (${CURRENT_BRANCH})${NC}"
else
  echo -e "${RED}❌ Push failed${NC}"
  exit 1
fi
echo ""

# Step 7: Merge to main (with confirmation)
echo -e "${BLUE}🔀 Step 7/8: Merge to main?${NC}"
read -p "Do you want to merge to main and deploy to production? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Switching to main branch...${NC}"
  git checkout main
  
  echo -e "${YELLOW}Pulling latest changes...${NC}"
  git pull origin main
  
  echo -e "${YELLOW}Merging ${CURRENT_BRANCH} into main...${NC}"
  if git merge "$CURRENT_BRANCH" -m "Merge ${CURRENT_BRANCH}: $COMMIT_MESSAGE"; then
    echo -e "${GREEN}✅ Merged to main${NC}"
    
    echo -e "${YELLOW}Pushing main to GitHub...${NC}"
    if git push origin main; then
      echo -e "${GREEN}✅ Pushed to main${NC}"
      echo -e "${GREEN}🎉 Vercel will auto-deploy from main branch!${NC}"
    else
      echo -e "${RED}❌ Failed to push main${NC}"
      exit 1
    fi
    
    # Switch back to feature branch
    echo -e "${YELLOW}Switching back to ${CURRENT_BRANCH}...${NC}"
    git checkout "$CURRENT_BRANCH"
  else
    echo -e "${RED}❌ Merge failed. Please resolve conflicts manually.${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}⏭️  Skipping merge to main${NC}"
fi
echo ""

# Step 8: Summary
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Deployment Complete!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Changes pushed to GitHub: ${CURRENT_BRANCH}${NC}"

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${GREEN}✅ Merged to main and pushed${NC}"
  echo -e "${GREEN}✅ Vercel deployment started automatically${NC}"
  echo ""
  echo -e "${BLUE}📊 Monitor deployment:${NC}"
  echo -e "   Vercel: https://vercel.com/dashboard"
  echo -e "   GitHub: https://github.com/Mucrypt/portfolio-app/actions"
  echo -e "   Live Site: https://romeomukulah.org"
fi
echo ""
echo -e "${YELLOW}💡 Useful commands:${NC}"
echo -e "   Check deployment: ${BLUE}./scripts/vercel-monitor.sh${NC}"
echo -e "   View logs: ${BLUE}./scripts/logs.sh${NC}"
echo -e "   Rollback: ${BLUE}./scripts/vercel-rollback.sh${NC}"
echo ""
