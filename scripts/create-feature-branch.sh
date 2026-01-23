#!/bin/bash

# Create Feature Branch
# Usage: ./scripts/create-feature-branch.sh feature-name

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🌿 Create Feature Branch${NC}"
echo ""

if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Feature name required${NC}"
  echo "Usage: ./scripts/create-feature-branch.sh feature-name"
  echo ""
  echo "Examples:"
  echo "  ./scripts/create-feature-branch.sh new-dashboard"
  echo "  ./scripts/create-feature-branch.sh fix-login-bug"
  echo "  ./scripts/create-feature-branch.sh add-blog-comments"
  exit 1
fi

FEATURE_NAME="$1"
BRANCH_NAME="feature/${FEATURE_NAME}"

# Check if on main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${YELLOW}⚠️  Not on main branch. Switching to main...${NC}"
  git checkout main
fi

# Pull latest
echo -e "${BLUE}📥 Pulling latest changes from main...${NC}"
git pull origin main

# Create and checkout new branch
echo -e "${BLUE}🌿 Creating branch: ${BRANCH_NAME}${NC}"
git checkout -b "$BRANCH_NAME"

# Push to remote
echo -e "${BLUE}🚀 Pushing branch to GitHub...${NC}"
git push -u origin "$BRANCH_NAME"

echo ""
echo -e "${GREEN}✅ Feature branch created!${NC}"
echo -e "${YELLOW}📋 Branch name: ${BRANCH_NAME}${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   1. Make your changes"
echo -e "   2. Quick push: ${BLUE}./scripts/quick-push.sh \"commit message\"${NC}"
echo -e "   3. Deploy: ${BLUE}./scripts/deploy-full.sh \"commit message\"${NC}"
