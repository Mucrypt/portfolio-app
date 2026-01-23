#!/bin/bash

# Clean Build Script - Remove all build artifacts and rebuild
# Usage: ./scripts/clean-build.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧹 Clean Build${NC}"
echo ""

# Remove build artifacts
echo -e "${YELLOW}🗑️  Removing .next directory...${NC}"
rm -rf .next

echo -e "${YELLOW}🗑️  Removing node_modules/.cache...${NC}"
rm -rf node_modules/.cache

echo -e "${YELLOW}🗑️  Removing out directory...${NC}"
rm -rf out

echo -e "${YELLOW}🗑️  Removing .turbo cache...${NC}"
rm -rf .turbo

echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Reinstall dependencies (optional)
read -p "Reinstall dependencies? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}📦 Removing node_modules...${NC}"
  rm -rf node_modules
  
  echo -e "${YELLOW}📦 Installing dependencies...${NC}"
  npm install
  
  echo -e "${GREEN}✅ Dependencies installed${NC}"
  echo ""
fi

# Build
echo -e "${BLUE}🏗️  Building project...${NC}"
if npm run build; then
  echo -e "${GREEN}✅ Build successful!${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}🎉 Clean build complete!${NC}"
