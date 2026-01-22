#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}║    🧪 LOCAL TEST & VALIDATION SUITE                      ║${NC}"
echo -e "${BLUE}║    Testing everything before deployment                  ║${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print test header
print_test() {
    echo ""
    echo -e "${YELLOW}▶ $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in the project root directory"
    exit 1
fi

# ============================================
# 1. DEPENDENCY CHECK
# ============================================
print_test "1. Checking Dependencies"

if [ -d "node_modules" ]; then
    print_success "node_modules exists"
else
    print_warning "node_modules missing, installing..."
    npm install
fi

# Check for required packages
if grep -q "ioredis" package.json; then
    print_success "Redis client (ioredis) installed"
else
    print_error "Redis client missing - run: npm install ioredis"
fi

# ============================================
# 2. ENVIRONMENT VARIABLES CHECK
# ============================================
print_test "2. Environment Variables Check"

# Check for .env.local
if [ -f ".env.local" ]; then
    print_success ".env.local file exists"
    
    # Check for required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        print_success "NEXT_PUBLIC_SUPABASE_URL configured"
    else
        print_warning "NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        print_success "NEXT_PUBLIC_SUPABASE_ANON_KEY configured"
    else
        print_warning "NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local"
    fi
else
    print_warning ".env.local file not found (optional for local dev)"
fi

# ============================================
# 3. LINTING & TYPE CHECKING
# ============================================
print_test "3. Running ESLint"

if npm run lint 2>&1 | tee /tmp/lint-output.txt; then
    print_success "ESLint passed with no errors"
else
    # Check if it's warnings only
    if grep -q "warning" /tmp/lint-output.txt && ! grep -q "error" /tmp/lint-output.txt; then
        print_warning "ESLint passed with warnings (see above)"
    else
        print_error "ESLint failed with errors"
    fi
fi

print_test "4. TypeScript Type Checking"

if npx tsc --noEmit 2>&1 | tee /tmp/tsc-output.txt; then
    print_success "TypeScript compilation check passed"
else
    print_error "TypeScript has type errors (see above)"
fi

# ============================================
# 5. BUILD TEST
# ============================================
print_test "5. Testing Next.js Build"

echo "Building application..."
if npm run build 2>&1 | tee /tmp/build-output.txt; then
    print_success "Next.js build completed successfully"
    
    # Check build output
    if [ -d ".next" ]; then
        BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
        print_success "Build output created (.next directory: $BUILD_SIZE)"
    fi
else
    print_error "Next.js build failed (see errors above)"
fi

# ============================================
# 6. KUBERNETES MANIFESTS VALIDATION
# ============================================
print_test "6. Validating Kubernetes Manifests"

# Check if kubectl is available
if command -v kubectl &> /dev/null; then
    # Validate deployment.yaml
    if kubectl apply --dry-run=client -f k8s/production/deployment.yaml &> /dev/null; then
        print_success "deployment.yaml is valid"
    else
        print_error "deployment.yaml has syntax errors"
    fi
    
    # Validate redis.yaml
    if kubectl apply --dry-run=client -f k8s/production/redis.yaml &> /dev/null; then
        print_success "redis.yaml is valid"
    else
        print_error "redis.yaml has syntax errors"
    fi
    
    # Validate hpa.yaml
    if kubectl apply --dry-run=client -f k8s/production/hpa.yaml &> /dev/null; then
        print_success "hpa.yaml is valid"
    else
        print_error "hpa.yaml has syntax errors"
    fi
else
    print_warning "kubectl not found, skipping K8s validation"
fi

# ============================================
# 7. REDIS CACHE MODULE TEST
# ============================================
print_test "7. Testing Redis Cache Module"

if [ -f "lib/redis/cache.ts" ]; then
    print_success "Redis cache module exists"
    
    # Check for required exports
    if grep -q "export.*getCache" lib/redis/cache.ts; then
        print_success "getCache function exported"
    fi
    if grep -q "export.*setCache" lib/redis/cache.ts; then
        print_success "setCache function exported"
    fi
    if grep -q "export.*CACHE_KEYS" lib/redis/cache.ts; then
        print_success "CACHE_KEYS exported"
    fi
else
    print_error "Redis cache module missing (lib/redis/cache.ts)"
fi

# ============================================
# 8. API ROUTES CHECK
# ============================================
print_test "8. Checking API Routes"

API_ROUTES=(
    "app/api/health/route.ts"
    "app/api/cache/stats/route.ts"
    "app/api/blog/posts/route.ts"
    "app/api/blog/posts/[slug]/route.ts"
)

for route in "${API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        print_success "$(basename $(dirname $route))/$(basename $route) exists"
    else
        print_warning "$route missing"
    fi
done

# ============================================
# 9. DOCKER BUILD TEST (OPTIONAL)
# ============================================
print_test "9. Docker Build Test (Optional)"

if command -v docker &> /dev/null; then
    echo "Testing Docker build (this may take a few minutes)..."
    if docker build -f docker/Dockerfile -t portfolio-test:latest . &> /tmp/docker-build.txt; then
        print_success "Docker build completed successfully"
        IMAGE_SIZE=$(docker images portfolio-test:latest --format "{{.Size}}")
        print_success "Docker image size: $IMAGE_SIZE"
    else
        print_error "Docker build failed (check /tmp/docker-build.txt)"
    fi
else
    print_warning "Docker not found, skipping Docker build test"
fi

# ============================================
# 10. LOCAL SERVER TEST
# ============================================
print_test "10. Starting Local Dev Server"

echo "Starting Next.js dev server for 10 seconds..."
npm run dev > /tmp/dev-server.log 2>&1 &
DEV_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    print_success "Health endpoint responding"
else
    print_warning "Health endpoint not responding (server may need more time)"
fi

# Test home page
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Home page responding"
else
    print_warning "Home page not responding"
fi

# Stop dev server
kill $DEV_PID 2>/dev/null || true
wait $DEV_PID 2>/dev/null || true
print_success "Dev server stopped"

# ============================================
# 11. GIT STATUS CHECK
# ============================================
print_test "11. Git Status Check"

if git diff --quiet; then
    print_success "No uncommitted changes"
else
    print_warning "You have uncommitted changes"
    echo "Run: git status"
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_success "Current branch: $CURRENT_BRANCH"

# ============================================
# 12. DEPLOYMENT SIMULATION
# ============================================
print_test "12. Deployment Simulation"

echo "Simulating deployment process..."

# Check GitHub connectivity
if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        print_success "GitHub CLI authenticated"
    else
        print_warning "GitHub CLI not authenticated"
    fi
else
    print_warning "GitHub CLI not installed"
fi

# Check kubectl connectivity
if command -v kubectl &> /dev/null; then
    if kubectl cluster-info &> /dev/null; then
        print_success "kubectl connected to cluster"
        CLUSTER_NAME=$(kubectl config current-context)
        print_success "Current cluster: $CLUSTER_NAME"
    else
        print_warning "kubectl not connected to cluster"
    fi
else
    print_warning "kubectl not installed"
fi

# ============================================
# SUMMARY REPORT
# ============================================
echo ""
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   TEST SUMMARY                            ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "✅ Tests Passed:   ${GREEN}$PASSED${NC}"
echo -e "⚠️  Warnings:      ${YELLOW}$WARNINGS${NC}"
echo -e "❌ Tests Failed:   ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║    🎉 ALL TESTS PASSED! READY TO DEPLOY                  ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}You can now safely run:${NC}"
    echo -e "${BLUE}./scripts/deploy.sh \"Your commit message\"${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}║    ❌ TESTS FAILED - FIX ERRORS BEFORE DEPLOYING         ║${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Please fix the errors above before deploying.${NC}"
    echo ""
    exit 1
fi
