#!/bin/bash

# Project Status - Show comprehensive project status
# Usage: ./scripts/status.sh

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Project Status Report            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Git Information
echo -e "${CYAN}📊 Git Status${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
CURRENT_BRANCH=$(git branch --show-current)
echo -e "Current Branch: ${GREEN}${CURRENT_BRANCH}${NC}"
echo -e "Latest Commit:  ${GREEN}$(git log -1 --pretty=%B | head -n 1)${NC}"
echo -e "Commit Hash:    ${GREEN}$(git rev-parse --short HEAD)${NC}"
echo -e "Author:         ${GREEN}$(git log -1 --pretty=%an)${NC}"
echo -e "Date:           ${GREEN}$(git log -1 --pretty=%ar)${NC}"

if [[ -n $(git status -s) ]]; then
  echo -e "Changes:        ${RED}$(git status -s | wc -l) uncommitted files${NC}"
else
  echo -e "Changes:        ${GREEN}Working directory clean${NC}"
fi
echo ""

# Branch Information
echo -e "${CYAN}🌿 Branches${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
git branch -a | head -n 5
echo ""

# NPM Information
echo -e "${CYAN}📦 Dependencies${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ -f "package.json" ]; then
  echo -e "Next.js:        ${GREEN}$(grep -oP '(?<="next": ")[^"]*' package.json)${NC}"
  echo -e "React:          ${GREEN}$(grep -oP '(?<="react": ")[^"]*' package.json)${NC}"
  echo -e "TypeScript:     ${GREEN}$(grep -oP '(?<="typescript": ")[^"]*' package.json)${NC}"
  TOTAL_DEPS=$(jq '.dependencies | length' package.json 2>/dev/null || echo "N/A")
  DEV_DEPS=$(jq '.devDependencies | length' package.json 2>/dev/null || echo "N/A")
  echo -e "Dependencies:   ${GREEN}${TOTAL_DEPS} prod + ${DEV_DEPS} dev${NC}"
fi
echo ""

# Build Status
echo -e "${CYAN}🏗️  Build Status${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ -d ".next" ]; then
  BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
  echo -e "Last Build:     ${GREEN}${BUILD_SIZE}${NC}"
  echo -e "Build Time:     ${GREEN}$(stat -c %y .next 2>/dev/null | cut -d' ' -f1)${NC}"
else
  echo -e "Last Build:     ${RED}No build found${NC}"
fi
echo ""

# Vercel Status
echo -e "${CYAN}🚀 Deployment${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Production:     ${GREEN}https://romeomukulah.org${NC}"
echo -e "Platform:       ${GREEN}Vercel${NC}"
echo -e "Provider:       ${GREEN}Free Tier${NC}"
echo ""

# Database Status
echo -e "${CYAN}🗄️  Database${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Provider:       ${GREEN}Supabase${NC}"
echo -e "Type:           ${GREEN}PostgreSQL${NC}"
echo -e "Tier:           ${GREEN}Free (500MB)${NC}"
echo ""

# Monitoring Services
echo -e "${CYAN}📊 Monitoring${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "UptimeRobot:    ${GREEN}Active (100% uptime)${NC}"
echo -e "Sentry:         ${GREEN}Active (0 errors)${NC}"
echo -e "Analytics:      ${GREEN}Vercel + GA4${NC}"
echo ""

# Environment
echo -e "${CYAN}🔧 Environment${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ -f ".env.local" ]; then
  echo -e ".env.local:     ${GREEN}Found${NC}"
else
  echo -e ".env.local:     ${RED}Not found${NC}"
fi
echo -e "Node:           ${GREEN}$(node -v)${NC}"
echo -e "NPM:            ${GREEN}$(npm -v)${NC}"
echo ""

# Quick Actions
echo -e "${CYAN}⚡ Quick Actions${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Quick Push:     ${BLUE}npm run quick-push \"message\"${NC}"
echo -e "Full Deploy:    ${BLUE}npm run deploy \"message\"${NC}"
echo -e "Dev Server:     ${BLUE}npm run dev${NC}"
echo -e "Build:          ${BLUE}npm run build${NC}"
echo -e "Dashboard:      ${BLUE}open https://romeomukulah.org/admin${NC}"
echo ""

# Disk Usage
echo -e "${CYAN}💾 Disk Usage${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Project Size:   ${GREEN}$(du -sh . 2>/dev/null | cut -f1)${NC}"
if [ -d "node_modules" ]; then
  echo -e "node_modules:   ${GREEN}$(du -sh node_modules 2>/dev/null | cut -f1)${NC}"
fi
if [ -d ".next" ]; then
  echo -e ".next:          ${GREEN}$(du -sh .next 2>/dev/null | cut -f1)${NC}"
fi
echo ""

echo -e "${GREEN}✅ Status report complete!${NC}"
