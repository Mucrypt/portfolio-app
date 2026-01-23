#!/bin/bash

# Production Deployment Script - Push to GitHub and Deploy to Vercel
# This script handles the complete deployment workflow

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Production Deployment - Full Pipeline    ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check for commit message
if [ -z "$1" ]; then
    print_error "Commit message required"
    echo "Usage: $0 \"your commit message\""
    exit 1
fi

COMMIT_MESSAGE="$1"

print_header

# Step 1: Check for uncommitted changes
echo -e "${BLUE}📋 Step 1/7: Checking for changes...${NC}"
if [[ -z $(git status -s) ]]; then
    print_warning "No changes to commit"
    echo "Do you want to trigger a Vercel redeployment anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 0
    fi
    SKIP_COMMIT=true
else
    print_success "Changes detected"
    git status --short
    SKIP_COMMIT=false
fi

# Step 2: Run ESLint
echo -e "\n${BLUE}🔍 Step 2/7: Running ESLint...${NC}"
npm run lint:summary

# Step 3: Run TypeScript check
echo -e "\n${BLUE}🔍 Step 3/7: Running TypeScript check...${NC}"
npm run type-check
print_success "TypeScript check passed"

# Step 4: Commit changes (if any)
if [ "$SKIP_COMMIT" = false ]; then
    echo -e "\n${BLUE}📝 Step 4/7: Committing changes...${NC}"
    git add -A
    git commit -m "$COMMIT_MESSAGE"
    print_success "Changes committed"
else
    echo -e "\n${BLUE}📝 Step 4/7: Skipping commit (no changes)${NC}"
fi

# Step 5: Push to GitHub
if [ "$SKIP_COMMIT" = false ]; then
    echo -e "\n${BLUE}🚀 Step 5/7: Pushing to GitHub...${NC}"
    BRANCH=$(git branch --show-current)
    git push origin "$BRANCH"
    print_success "Pushed to GitHub ($BRANCH)"
else
    echo -e "\n${BLUE}🚀 Step 5/7: Skipping push (no changes)${NC}"
    BRANCH=$(git branch --show-current)
fi

# Step 6: Deploy to Vercel
echo -e "\n${BLUE}🚀 Step 6/7: Deploying to Vercel...${NC}"
print_info "Starting Vercel deployment..."

# Deploy to production with filtered output
# Filter out verbose build messages but keep URLs and important status
if vercel --prod --yes 2>&1 | \
    grep -v "Vercel CLI" | \
    grep -v "Retrieving project" | \
    grep -v "Deploying mukulahs-projects" | \
    grep -v "Uploading \[" | \
    grep -v "Building: ~/chunks" | \
    grep -v "Building: ~/edge" | \
    grep -v "Building: Running build" | \
    grep -v "Building: Build machine" | \
    grep -v "Building: Retrieving list" | \
    grep -v "Building: Downloading" | \
    grep -v "Building: Restored build cache" | \
    grep -v "Building: Running \"vercel build\"" | \
    grep -v "Building: Vercel CLI" | \
    grep -v "Building: Running \"install\"" | \
    grep -v "Building: up to date" | \
    grep -v "Building: [0-9]* packages" | \
    grep -v "Building: run \`npm fund\`" | \
    grep -v "Building: found 0 vulnerabilities" | \
    grep -v "Building: Detected Next.js" | \
    grep -v "Building: Running \"npm run build\"" | \
    grep -v "Building: > portfolio-app" | \
    grep -v "Building: > next build" | \
    grep -v "Building: ▲ Next.js" | \
    grep -v "Building: - Experiments" | \
    grep -v "Building: ·" | \
    grep -v "Building: Creating an optimized" | \
    grep -v "Building: ✓ Compiled successfully" | \
    grep -v "Building: Running next.config.js" | \
    grep -v "Building: \[@sentry/nextjs" | \
    grep -v "Building: > Found [0-9]* files" | \
    grep -v "Building: > Analyzing" | \
    grep -v "Building: > Rewriting" | \
    grep -v "Building: > Adding source map" | \
    grep -v "Building: > Bundling" | \
    grep -v "Building: > Bundled" | \
    grep -v "Building: > Bundle ID:" | \
    grep -v "Building: > Optimizing" | \
    grep -v "Building: > Uploading" | \
    grep -v "Building: > Uploaded files" | \
    grep -v "Building: > Processing" | \
    grep -v "Building: > File upload" | \
    grep -v "Building: > Organization:" | \
    grep -v "Building: > Projects:" | \
    grep -v "Building: > Release:" | \
    grep -v "Building: > Dist:" | \
    grep -v "Building: > Upload type:" | \
    grep -v "Building: Source Map Upload" | \
    grep -v "Building: Scripts" | \
    grep -v "Building: Source Maps" | \
    grep -v "Building: ✓ Completed runAfterProductionCompile" | \
    grep -v "Building: Running TypeScript" | \
    grep -v "Building: Collecting page data" | \
    grep -v "Building: ℹ️  Redis caching" | \
    grep -v "Building: Generating static pages" | \
    grep -v "Building: ✓ Generating static pages" | \
    grep -v "Building: Finalizing page" | \
    grep -v "Building: Route (app)" | \
    grep -v "Building: ┌" | \
    grep -v "Building: ├" | \
    grep -v "Building: └" | \
    grep -v "Building: ƒ Proxy" | \
    grep -v "Building: ○  (Static)" | \
    grep -v "Building: ƒ  (Dynamic)" | \
    grep -v "Building: Traced Next.js" | \
    grep -v "Building: Created all serverless" | \
    grep -v "Building: Collected static files" | \
    grep -v "Building: Build Completed" | \
    grep -v "Building: Deploying outputs" | \
    grep -v "Building: Deployment completed" | \
    grep -v "Completing..." | \
    grep -v "sourcemap at" | \
    grep -v "debug id" | \
    grep -v "^Building: ~/" | \
    grep -v "warning: could not determine a source map" | \
    tee /tmp/vercel-deploy.log; then
    print_success "Vercel deployment initiated"
    
    # Extract deployment URL from original unfiltered log
    DEPLOY_URL=$(vercel ls 2>&1 | grep -oP 'https://[^\s]+vercel\.app' | head -1)
    if [ -n "$DEPLOY_URL" ]; then
        echo -e "\n${GREEN}🌐 Deployment URL: $DEPLOY_URL${NC}"
    fi
else
    print_error "Vercel deployment failed"
    echo -e "\n${YELLOW}Troubleshooting:${NC}"
    echo "1. Make sure you're logged in: vercel login"
    echo "2. Make sure project is linked: vercel link"
    echo "3. Check Vercel dashboard: https://vercel.com/dashboard"
    exit 1
fi

# Step 7: Verify deployment
echo -e "\n${BLUE}🔍 Step 7/7: Verifying deployment...${NC}"
sleep 5  # Wait a bit for deployment to register

print_info "Checking deployment status..."
if vercel ls 2>&1 | head -10; then
    print_success "Deployment verification complete"
else
    print_warning "Could not verify deployment status"
fi

# Final summary
echo -e "\n${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deployment Complete! 🎉            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}\n"

if [ "$SKIP_COMMIT" = false ]; then
    print_success "Code pushed to GitHub: $BRANCH"
fi
print_success "Deployed to Vercel Production"
echo ""
echo -e "${BLUE}📊 Monitor deployment:${NC}"
echo "   Vercel Dashboard: https://vercel.com/dashboard"
echo "   GitHub Actions: https://github.com/Mucrypt/portfolio-app/actions"
echo "   Live Site: https://romeomukulah.org"
echo ""
echo -e "${BLUE}💡 Useful commands:${NC}"
echo "   Check logs: vercel logs"
echo "   List deployments: vercel ls"
echo "   Rollback: ./scripts/vercel-rollback.sh"
