#!/bin/bash

################################################################################
# Vercel Environment Setup Script
# Manages environment variables for Vercel deployments
################################################################################

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

################################################################################
# Main Functions
################################################################################

setup_vercel_env() {
    log_info "Setting up Vercel environment variables..."
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        log_warning ".env.local not found"
        exit 1
    fi
    
    # Source environment variables
    set -a
    source .env.local
    set +a
    
    log_info "Adding environment variables to Vercel..."
    
    # Add production environment variables
    vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$NEXT_PUBLIC_SUPABASE_URL" || true
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$NEXT_PUBLIC_SUPABASE_ANON_KEY" || true
    vercel env add NEXT_PUBLIC_SITE_URL production <<< "$NEXT_PUBLIC_SITE_URL" || true
    vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production <<< "$NEXT_PUBLIC_GA_MEASUREMENT_ID" || true
    vercel env add REDIS_ENABLED production <<< "false" || true
    
    # Add preview environment variables
    vercel env add NEXT_PUBLIC_SUPABASE_URL preview <<< "$NEXT_PUBLIC_SUPABASE_URL" || true
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview <<< "$NEXT_PUBLIC_SUPABASE_ANON_KEY" || true
    vercel env add NEXT_PUBLIC_SITE_URL preview <<< "https://preview.romeomukulah.org" || true
    vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID preview <<< "$NEXT_PUBLIC_GA_MEASUREMENT_ID" || true
    vercel env add REDIS_ENABLED preview <<< "false" || true
    
    # Add development environment variables
    vercel env add NEXT_PUBLIC_SUPABASE_URL development <<< "$NEXT_PUBLIC_SUPABASE_URL" || true
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development <<< "$NEXT_PUBLIC_SUPABASE_ANON_KEY" || true
    vercel env add NEXT_PUBLIC_SITE_URL development <<< "http://localhost:3000" || true
    vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID development <<< "$NEXT_PUBLIC_GA_MEASUREMENT_ID" || true
    vercel env add REDIS_ENABLED development <<< "false" || true
    
    log_success "Environment variables configured"
}

list_vercel_env() {
    log_info "Listing Vercel environment variables..."
    vercel env ls
}

pull_vercel_env() {
    local environment="${1:-development}"
    log_info "Pulling $environment environment variables..."
    vercel env pull .env.vercel.local --environment="$environment"
    log_success "Environment variables pulled to .env.vercel.local"
}

remove_vercel_env() {
    local var_name="$1"
    local environment="${2:-production}"
    log_info "Removing $var_name from $environment..."
    vercel env rm "$var_name" "$environment" --yes
    log_success "Removed $var_name"
}

print_usage() {
    echo "Usage: $0 {setup|list|pull|remove} [args]"
    echo ""
    echo "Commands:"
    echo "  setup          - Set up all environment variables"
    echo "  list           - List all environment variables"
    echo "  pull [env]     - Pull environment variables (default: development)"
    echo "  remove <name> [env] - Remove an environment variable (default: production)"
    echo ""
}

################################################################################
# Main
################################################################################

case "${1:-}" in
    setup)
        setup_vercel_env
        ;;
    list)
        list_vercel_env
        ;;
    pull)
        pull_vercel_env "${2:-development}"
        ;;
    remove)
        if [ -z "${2:-}" ]; then
            echo "Error: Variable name required"
            print_usage
            exit 1
        fi
        remove_vercel_env "$2" "${3:-production}"
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
