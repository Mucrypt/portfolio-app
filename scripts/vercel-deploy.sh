#!/bin/bash

################################################################################
# Vercel Deployment Script
# Professional deployment script for Vercel with health checks and monitoring
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="https://romeomukulah.org"
HEALTH_ENDPOINT="/api/health"
MAX_WAIT_TIME=300 # 5 minutes
POLL_INTERVAL=10

################################################################################
# Functions
################################################################################

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║           Vercel Deployment Script v1.0.0            ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not found. Installing..."
        npm install -g vercel@latest
    fi
    
    # Check if user is logged in
    if ! vercel whoami &> /dev/null; then
        log_error "Not logged in to Vercel. Please run: vercel login"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

run_tests() {
    log_info "Running tests..."
    
    # Type check
    log_info "Running TypeScript type check..."
    if npx tsc --noEmit; then
        log_success "Type check passed"
    else
        log_warning "Type check failed (continuing anyway)"
    fi
    
    # Lint
    log_info "Running linter..."
    if npm run lint 2>&1 | head -20; then
        log_success "Lint check passed"
    else
        log_warning "Lint check failed (continuing anyway)"
    fi
    
    log_success "Tests completed"
}

build_project() {
    log_info "Building project..."
    
    if npm run build; then
        log_success "Build successful"
        return 0
    else
        log_error "Build failed"
        return 1
    fi
}

deploy_to_vercel() {
    local environment=$1
    log_info "Deploying to Vercel ($environment)..."
    
    if [ "$environment" == "production" ]; then
        DEPLOYMENT_URL=$(vercel --prod --yes 2>&1 | grep -oP 'https://[^\s]+\.vercel\.app' | tail -1)
    else
        DEPLOYMENT_URL=$(vercel --yes 2>&1 | grep -oP 'https://[^\s]+\.vercel\.app' | tail -1)
    fi
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        log_error "Failed to get deployment URL"
        return 1
    fi
    
    log_success "Deployed to: $DEPLOYMENT_URL"
    echo "$DEPLOYMENT_URL"
}

wait_for_deployment() {
    local url=$1
    local elapsed=0
    
    log_info "Waiting for deployment to be ready..."
    
    while [ $elapsed -lt $MAX_WAIT_TIME ]; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${url}${HEALTH_ENDPOINT}" || echo "000")
        
        if [ "$HTTP_CODE" -eq 200 ]; then
            log_success "Deployment is ready (HTTP $HTTP_CODE)"
            return 0
        else
            log_info "Waiting... (HTTP $HTTP_CODE) - ${elapsed}s elapsed"
            sleep $POLL_INTERVAL
            elapsed=$((elapsed + POLL_INTERVAL))
        fi
    done
    
    log_error "Deployment did not become ready within ${MAX_WAIT_TIME}s"
    return 1
}

run_health_checks() {
    local url=$1
    log_info "Running health checks..."
    
    # Basic health check
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${url}${HEALTH_ENDPOINT}")
    if [ "$HTTP_CODE" -eq 200 ]; then
        log_success "Health check passed (HTTP $HTTP_CODE)"
    else
        log_error "Health check failed (HTTP $HTTP_CODE)"
        return 1
    fi
    
    # Check response time
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "${url}")
    log_info "Response time: ${RESPONSE_TIME}s"
    
    # Check if analytics is loaded
    if curl -s "$url" | grep -q "G-3BZZ8D5TED"; then
        log_success "Google Analytics detected"
    else
        log_warning "Google Analytics not detected"
    fi
    
    log_success "All health checks passed"
}

get_deployment_info() {
    log_info "Deployment Information:"
    echo ""
    vercel inspect || true
    echo ""
}

cleanup() {
    log_info "Cleaning up..."
    # Add any cleanup tasks here
}

################################################################################
# Main Script
################################################################################

main() {
    print_header
    
    # Parse arguments
    ENVIRONMENT="${1:-production}"
    SKIP_TESTS="${2:-false}"
    
    log_info "Environment: $ENVIRONMENT"
    log_info "Skip tests: $SKIP_TESTS"
    echo ""
    
    # Run deployment steps
    check_prerequisites
    
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    else
        log_warning "Skipping tests"
    fi
    
    # Deploy
    DEPLOYMENT_URL=$(deploy_to_vercel "$ENVIRONMENT")
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        log_error "Deployment failed"
        exit 1
    fi
    
    # Wait and verify
    if [ "$ENVIRONMENT" == "production" ]; then
        wait_for_deployment "$PRODUCTION_URL"
        run_health_checks "$PRODUCTION_URL"
    else
        wait_for_deployment "$DEPLOYMENT_URL"
        run_health_checks "$DEPLOYMENT_URL"
    fi
    
    # Show info
    get_deployment_info
    
    # Success
    echo ""
    log_success "Deployment completed successfully! 🚀"
    echo ""
    if [ "$ENVIRONMENT" == "production" ]; then
        echo -e "${GREEN}🌐 Production URL: $PRODUCTION_URL${NC}"
    fi
    echo -e "${GREEN}🔗 Deployment URL: $DEPLOYMENT_URL${NC}"
    echo ""
}

# Trap cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"
