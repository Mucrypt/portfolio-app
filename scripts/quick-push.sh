#!/bin/bash

# Quick Push Script - Fast commit and push to current branch
# Usage: ./scripts/quick-push.sh "commit message"

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}⚡ Quick Push${NC}"
echo ""

if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Commit message required${NC}"
  echo "Usage: ./scripts/quick-push.sh \"your commit message\""
  exit 1
fi

COMMIT_MESSAGE="$1"
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${YELLOW}📋 Branch: ${CURRENT_BRANCH}${NC}"
echo -e "${YELLOW}💬 Message: ${COMMIT_MESSAGE}${NC}"
echo ""

# Add all changes
git add .

# Show what's being committed
echo -e "${BLUE}📝 Files to commit:${NC}"
git status -s
echo ""

# Commit
if git commit -m "$COMMIT_MESSAGE"; then
  echo -e "${GREEN}✅ Committed${NC}"
else
  echo -e "${YELLOW}⚠️  No changes to commit${NC}"
fi

# Push
echo -e "${BLUE}🚀 Pushing to ${CURRENT_BRANCH}...${NC}"
if git push origin "$CURRENT_BRANCH"; then
  echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
else
  echo -e "${RED}❌ Push failed${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
