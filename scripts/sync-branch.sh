#!/bin/bash

# Sync Feature Branch with Main
# Usage: ./scripts/sync-branch.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Sync Branch with Main${NC}"
echo ""

CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo -e "${RED}❌ You're already on main branch${NC}"
  exit 1
fi

echo -e "${YELLOW}📋 Current branch: ${CURRENT_BRANCH}${NC}"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  Uncommitted changes found. Stashing...${NC}"
  git stash push -m "Auto-stash before sync $(date +%Y-%m-%d_%H-%M-%S)"
  STASHED=true
else
  STASHED=false
fi

# Fetch latest from remote
echo -e "${BLUE}📥 Fetching latest changes...${NC}"
git fetch origin

# Switch to main
echo -e "${BLUE}🔀 Switching to main...${NC}"
git checkout main

# Pull main
echo -e "${BLUE}⬇️  Pulling main...${NC}"
git pull origin main

# Switch back to feature branch
echo -e "${BLUE}🔀 Switching back to ${CURRENT_BRANCH}...${NC}"
git checkout "$CURRENT_BRANCH"

# Rebase on main
echo -e "${BLUE}🔄 Rebasing on main...${NC}"
if git rebase main; then
  echo -e "${GREEN}✅ Rebase successful${NC}"
else
  echo -e "${RED}❌ Rebase failed. Resolve conflicts and run: git rebase --continue${NC}"
  exit 1
fi

# Restore stashed changes
if [ "$STASHED" = true ]; then
  echo -e "${BLUE}📤 Restoring stashed changes...${NC}"
  git stash pop
fi

echo ""
echo -e "${GREEN}✅ Branch synced with main!${NC}"
echo -e "${YELLOW}💡 Push force required: ${BLUE}git push -f origin ${CURRENT_BRANCH}${NC}"
