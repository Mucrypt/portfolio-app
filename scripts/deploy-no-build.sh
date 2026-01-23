#!/bin/bash

# Deployment Script (No Local Build)
# Skips build step and lets Vercel handle it

set -e

# Get commit message from arguments or use default
COMMIT_MSG="${1:-Update deployment}"

echo "╔════════════════════════════════════════════╗"
echo "║   Quick Deployment to GitHub & Vercel      ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📋 Current branch: $CURRENT_BRANCH"
echo ""

# Step 1: Check for changes
echo "🔍 Step 1/5: Checking for uncommitted changes..."
if [[ -z $(git status -s) ]]; then
  echo "✅ No uncommitted changes"
else
  echo "⚠️  Uncommitted changes found"
  git status -s
fi
echo ""

# Step 2: Run ESLint
echo "🔍 Step 2/5: Running ESLint..."
if npm run lint; then
  echo "✅ Linting passed"
else
  echo "❌ Linting failed. Fix errors before deploying."
  exit 1
fi
echo ""

# Step 3: TypeScript check
echo "🔍 Step 3/5: Running TypeScript check..."
if npm run type-check; then
  echo "✅ TypeScript check passed"
else
  echo "❌ TypeScript check failed. Fix errors before deploying."
  exit 1
fi
echo ""

# Step 4: Git operations
echo "📦 Step 4/5: Committing and pushing to GitHub..."
git add .
git commit -m "$COMMIT_MSG" || echo "⚠️  No changes to commit"
git push origin "$CURRENT_BRANCH"
echo "✅ Pushed to GitHub"
echo ""

# Step 5: Merge prompt
echo "🔀 Step 5/5: Merge to main?"
echo ""
echo "Current branch: $CURRENT_BRANCH"
echo "Would you like to merge to main and trigger Vercel deployment? (y/n)"
read -r MERGE_CHOICE

if [[ "$MERGE_CHOICE" =~ ^[Yy]$ ]]; then
  echo ""
  echo "🔀 Merging $CURRENT_BRANCH into main..."
  
  # Checkout main
  git checkout main
  
  # Pull latest
  git pull origin main
  
  # Merge feature branch
  git merge "$CURRENT_BRANCH" --no-edit
  
  # Push to main
  git push origin main
  
  # Return to feature branch
  git checkout "$CURRENT_BRANCH"
  
  echo "✅ Merged to main and pushed"
  echo ""
  echo "🚀 Vercel will now build and deploy automatically!"
  echo "   Visit: https://vercel.com/dashboard to monitor"
else
  echo ""
  echo "⏭️  Skipped merge to main"
  echo "   Your changes are pushed to $CURRENT_BRANCH"
  echo "   Merge manually when ready:"
  echo "   git checkout main && git merge $CURRENT_BRANCH && git push"
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║          Deployment Complete! 🎉           ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   ✅ Linting passed"
echo "   ✅ TypeScript check passed"
echo "   ✅ Code pushed to GitHub"
if [[ "$MERGE_CHOICE" =~ ^[Yy]$ ]]; then
  echo "   ✅ Merged to main"
  echo "   ⏳ Vercel deployment in progress..."
else
  echo "   ⏭️  Not merged to main yet"
fi
echo ""
echo "🌐 Your site:"
echo "   Production: https://romeomukulah.org"
echo "   Preview: https://portfolio-app-git-$CURRENT_BRANCH-your-username.vercel.app"
echo ""
