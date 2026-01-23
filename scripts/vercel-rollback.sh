#!/bin/bash

################################################################################
# Vercel Rollback Script
# Quick rollback to previous deployment
################################################################################

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

################################################################################
# Functions
################################################################################

list_deployments() {
    log_info "Recent deployments:"
    vercel ls | head -15
}

get_previous_deployment() {
    # Get the second deployment (first is current, second is previous)
    PREVIOUS_URL=$(vercel ls --json 2>/dev/null | jq -r '.[1].url' 2>/dev/null || echo "")
    
    if [ -z "$PREVIOUS_URL" ]; then
        log_error "Could not find previous deployment"
        exit 1
    fi
    
    echo "https://$PREVIOUS_URL"
}

confirm_rollback() {
    local previous_url=$1
    echo ""
    log_warning "You are about to rollback production to:"
    echo "  $previous_url"
    echo ""
    read -p "Continue? (yes/no): " -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Rollback cancelled"
        exit 0
    fi
}

perform_rollback() {
    local deployment_url=$1
    log_info "Rolling back to: $deployment_url"
    
    # Promote the previous deployment to production
    if vercel promote "$deployment_url" --yes; then
        log_success "Rollback successful!"
        return 0
    else
        log_error "Rollback failed"
        return 1
    fi
}

verify_rollback() {
    local url="https://romeomukulah.org"
    log_info "Verifying rollback..."
    
    sleep 10 # Wait for DNS propagation
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${url}/api/health" || echo "000")
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        log_success "Production health check passed"
    else
        log_error "Production health check failed (HTTP $HTTP_CODE)"
        return 1
    fi
}

################################################################################
# Main
################################################################################

main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║         Vercel Rollback Script v1.0.0                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check if specific deployment URL provided
    if [ -n "${1:-}" ]; then
        DEPLOYMENT_URL="$1"
        log_info "Using provided deployment: $DEPLOYMENT_URL"
    else
        # Get previous deployment
        DEPLOYMENT_URL=$(get_previous_deployment)
    fi
    
    # Show current deployments
    list_deployments
    echo ""
    
    # Confirm rollback
    confirm_rollback "$DEPLOYMENT_URL"
    
    # Perform rollback
    if perform_rollback "$DEPLOYMENT_URL"; then
        verify_rollback
        echo ""
        log_success "Rollback completed successfully! 🎉"
        echo ""
        log_info "Production URL: https://romeomukulah.org"
        log_info "Rolled back to: $DEPLOYMENT_URL"
    else
        log_error "Rollback failed. Please check Vercel dashboard."
        exit 1
    fi
}

# Show usage
if [ "${1:-}" == "--help" ] || [ "${1:-}" == "-h" ]; then
    echo "Usage: $0 [deployment-url]"
    echo ""
    echo "Rollback production to a previous deployment"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Rollback to previous deployment"
    echo "  $0 https://portfolio-xxx.vercel.app  # Rollback to specific deployment"
    echo ""
    exit 0
fi

main "$@"
