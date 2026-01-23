#!/bin/bash

# ESLint Summary Script - Detailed breakdown of errors and warnings
# Usage: ./scripts/lint-summary.sh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           ESLint Summary Report               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# Run ESLint and capture output
LINT_OUTPUT=$(npm run lint 2>&1)

# Count total problems
TOTAL_ERRORS=$(echo "$LINT_OUTPUT" | grep -oP '\d+(?= error)' | head -1 || echo "0")
TOTAL_WARNINGS=$(echo "$LINT_OUTPUT" | grep -oP '\d+(?= warning)' | head -1 || echo "0")

echo -e "${CYAN}📊 Overall Statistics:${NC}"
echo -e "   Errors:   ${RED}${TOTAL_ERRORS}${NC}"
echo -e "   Warnings: ${YELLOW}${TOTAL_WARNINGS}${NC}"
echo ""

# Categorize issues by type
echo -e "${CYAN}📋 Issues by Category:${NC}"
echo ""

# TypeScript any usage
ANY_COUNT=$(echo "$LINT_OUTPUT" | grep -c "no-explicit-any" || echo "0")
if [ "$ANY_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  TypeScript 'any' usage: ${ANY_COUNT}${NC}"
  echo -e "   ${CYAN}Fix:${NC} Replace 'any' with specific types"
  echo -e "   ${CYAN}Impact:${NC} Non-blocking (warning)"
fi

# React Hooks issues
HOOKS_COUNT=$(echo "$LINT_OUTPUT" | grep -c "react-hooks" || echo "0")
if [ "$HOOKS_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  React Hooks issues: ${HOOKS_COUNT}${NC}"
  echo -e "   ${CYAN}Types:${NC}"
  
  # Check specific hook issues
  PURITY=$(echo "$LINT_OUTPUT" | grep -c "react-hooks/purity" || echo "0")
  if [ "$PURITY" -gt 0 ]; then
    echo -e "     • Purity violations: ${PURITY} (calling impure functions)"
  fi
  
  DEPS=$(echo "$LINT_OUTPUT" | grep -c "exhaustive-deps" || echo "0")
  if [ "$DEPS" -gt 0 ]; then
    echo -e "     • Missing dependencies: ${DEPS}"
  fi
  
  IMMUTABILITY=$(echo "$LINT_OUTPUT" | grep -c "immutability" || echo "0")
  if [ "$IMMUTABILITY" -gt 0 ]; then
    echo -e "     • Immutability issues: ${IMMUTABILITY}"
  fi
  
  echo -e "   ${CYAN}Impact:${NC} Some may cause bugs, review recommended"
fi

# Unused variables
UNUSED_COUNT=$(echo "$LINT_OUTPUT" | grep -c "no-unused-vars" || echo "0")
if [ "$UNUSED_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Unused variables: ${UNUSED_COUNT}${NC}"
  echo -e "   ${CYAN}Fix:${NC} Remove unused imports/variables or prefix with '_'"
  echo -e "   ${CYAN}Impact:${NC} Non-blocking (warning)"
fi

# Unescaped entities
ENTITIES_COUNT=$(echo "$LINT_OUTPUT" | grep -c "no-unescaped-entities" || echo "0")
if [ "$ENTITIES_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Unescaped HTML entities: ${ENTITIES_COUNT}${NC}"
  echo -e "   ${CYAN}Fix:${NC} Use &apos; for ', &quot; for \", etc."
  echo -e "   ${CYAN}Impact:${NC} Non-blocking (cosmetic)"
fi

# Image optimization
IMG_COUNT=$(echo "$LINT_OUTPUT" | grep -c "no-img-element" || echo "0")
if [ "$IMG_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Image optimization: ${IMG_COUNT}${NC}"
  echo -e "   ${CYAN}Fix:${NC} Use next/image instead of <img>"
  echo -e "   ${CYAN}Impact:${NC} Performance (recommended)"
fi

echo ""

# Check if there are blocking errors
if [ "$TOTAL_ERRORS" -gt 0 ]; then
  echo -e "${RED}╔═══════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ❌ BLOCKING ERRORS - MUST FIX BEFORE DEPLOY  ║${NC}"
  echo -e "${RED}╚═══════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${YELLOW}Run 'npm run lint' to see full error details${NC}"
  exit 1
else
  echo -e "${GREEN}╔═══════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║        ✅ No Blocking Errors Found!           ║${NC}"
  echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
  echo ""
  
  if [ "$TOTAL_WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}💡 ${TOTAL_WARNINGS} warnings found (non-blocking)${NC}"
    echo -e "${CYAN}   You can deploy, but consider fixing warnings for better code quality${NC}"
  else
    echo -e "${GREEN}🎉 Perfect! No errors or warnings!${NC}"
  fi
  
  echo ""
  echo -e "${CYAN}📝 Recommendations:${NC}"
  echo -e "   1. Fix purity violations to prevent render issues"
  echo -e "   2. Replace 'any' types for better type safety"
  echo -e "   3. Use next/image for automatic optimization"
  echo -e "   4. Remove unused imports to keep code clean"
  
  exit 0
fi
