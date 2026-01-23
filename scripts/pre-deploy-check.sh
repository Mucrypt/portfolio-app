#!/bin/bash

# Pre-Deployment Checks
# Usage: ./scripts/pre-deploy-check.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Pre-Deployment Checks               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# Check 1: Node modules
echo -e "${BLUE}🔍 Check 1: Node modules...${NC}"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ Node modules installed${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ Node modules not found. Run: npm install${NC}"
  ((CHECKS_FAILED++))
fi
echo ""

# Check 2: Environment variables
echo -e "${BLUE}🔍 Check 2: Environment variables...${NC}"
if [ -f ".env.local" ] || [ -f ".env" ]; then
  echo -e "${GREEN}✅ Environment file found${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠️  No .env file found${NC}"
fi
echo ""

# Check 3: Git status
echo -e "${BLUE}🔍 Check 3: Git status...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}   Current branch: ${CURRENT_BRANCH}${NC}"
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  Uncommitted changes:${NC}"
  git status -s
else
  echo -e "${GREEN}✅ Working directory clean${NC}"
  ((CHECKS_PASSED++))
fi
echo ""

# Check 4: ESLint
echo -e "${BLUE}🔍 Check 4: ESLint...${NC}"
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_ERRORS=$(echo "$LINT_OUTPUT" | grep "error" | wc -l)
LINT_WARNINGS=$(echo "$LINT_OUTPUT" | grep "warning" | wc -l)

if [ "$LINT_ERRORS" -eq 0 ]; then
  echo -e "${GREEN}✅ Linting passed${NC}"
  if [ "$LINT_WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}   ⚠️  ${LINT_WARNINGS} warnings found (non-blocking)${NC}"
  fi
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ Linting failed: ${LINT_ERRORS} errors${NC}"
  echo -e "${YELLOW}   To see details: npm run lint${NC}"
  ((CHECKS_FAILED++))
fi
echo ""

# Check 5: TypeScript
echo -e "${BLUE}🔍 Check 5: TypeScript...${NC}"
TS_OUTPUT=$(npx tsc --noEmit 2>&1)
TS_ERRORS=$(echo "$TS_OUTPUT" | grep -c "error TS" || true)

if [ "$TS_ERRORS" -eq 0 ]; then
  echo -e "${GREEN}✅ TypeScript check passed${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ TypeScript errors: ${TS_ERRORS} found${NC}"
  echo -e "${YELLOW}   To see details: npm run type-check${NC}"
  ((CHECKS_FAILED++))
fi
echo ""

# Check 6: Critical files exist
echo -e "${BLUE}🔍 Check 6: Critical files...${NC}"
CRITICAL_FILES=("next.config.ts" "package.json" "app/layout.tsx" "app/page.tsx")
MISSING_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo -e "${RED}   ❌ Missing: $file${NC}"
    ((MISSING_FILES++))
  fi
done
if [ "$MISSING_FILES" -eq 0 ]; then
  echo -e "${GREEN}✅ All critical files present${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ $MISSING_FILES critical files missing${NC}"
  ((CHECKS_FAILED++))
fi
echo ""

# Check 7: Package.json scripts
echo -e "${BLUE}🔍 Check 7: Deployment readiness...${NC}"
DEPLOY_READY=true
if ! grep -q '"deploy":' package.json; then
  echo -e "${YELLOW}   ⚠️  No deploy script in package.json${NC}"
  DEPLOY_READY=false
fi
if ! grep -q '"build":' package.json; then
  echo -e "${RED}   ❌ No build script in package.json${NC}"
  DEPLOY_READY=false
  ((CHECKS_FAILED++))
fi
if [ "$DEPLOY_READY" = true ]; then
  echo -e "${GREEN}✅ Deployment scripts configured${NC}"
  ((CHECKS_PASSED++))
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Check Summary                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Passed: ${CHECKS_PASSED}${NC}"
echo -e "${RED}❌ Failed: ${CHECKS_FAILED}${NC}"
echo ""

if [ $CHECKS_FAILED -gt 0 ]; then
  echo -e "${RED}⚠️  Some checks failed. Fix issues before deploying.${NC}"
  exit 1
else
  echo -e "${GREEN}🎉 All critical checks passed! Ready to deploy.${NC}"
fi
