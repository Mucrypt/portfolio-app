#!/bin/bash

# GitHub Secrets Setup Script
# This script automates the setup of GitHub repository secrets for CI/CD pipelines
# Requirements: GitHub CLI (gh) must be installed and authenticated

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_OWNER="Mucrypt"
REPO_NAME="portfolio-app"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command_exists gh; then
        print_error "GitHub CLI (gh) is not installed. Please install it first:"
        echo "  Ubuntu/Debian: sudo apt install gh"
        echo "  macOS: brew install gh"
        echo "  Or visit: https://cli.github.com/"
        exit 1
    fi
    
    if ! gh auth status >/dev/null 2>&1; then
        print_error "GitHub CLI is not authenticated. Please run: gh auth login"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to set a GitHub secret
set_secret() {
    local secret_name="$1"
    local secret_value="$2"
    local repo="${3:-$REPO_OWNER/$REPO_NAME}"
    
    if [ -z "$secret_value" ]; then
        print_warning "Skipping $secret_name (no value provided)"
        return 0
    fi
    
    print_info "Setting secret: $secret_name"
    if echo "$secret_value" | gh secret set "$secret_name" --repo="$repo"; then
        print_success "Secret $secret_name set successfully"
        return 0
    else
        print_error "Failed to set secret: $secret_name"
        return 1
    fi
}

# Function to prompt for a secret value
prompt_secret() {
    local secret_name="$1"
    local prompt_text="$2"
    local secret_value=""
    
    echo -e "${BLUE}$prompt_text${NC}"
    read -r -s secret_value
    echo
    
    if [ -n "$secret_value" ]; then
        set_secret "$secret_name" "$secret_value"
    else
        print_warning "Skipping $secret_name (no value entered)"
    fi
}

# Main function
main() {
    print_info "=== GitHub Secrets Setup for $REPO_OWNER/$REPO_NAME ==="
    echo
    
    check_prerequisites
    echo
    
    # AWS Credentials
    print_info "=== AWS Credentials ==="
    prompt_secret "AWS_ACCESS_KEY_ID" "Enter AWS Access Key ID:"
    prompt_secret "AWS_SECRET_ACCESS_KEY" "Enter AWS Secret Access Key:"
    prompt_secret "AWS_REGION" "Enter AWS Region (e.g., us-east-1):"
    echo
    
    # Supabase Credentials
    print_info "=== Supabase Credentials ==="
    prompt_secret "NEXT_PUBLIC_SUPABASE_URL" "Enter Supabase URL:"
    prompt_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Enter Supabase Anon Key:"
    prompt_secret "SUPABASE_SERVICE_ROLE_KEY" "Enter Supabase Service Role Key:"
    echo
    
    # Database Credentials (if using direct connection)
    print_info "=== Database Credentials (Optional) ==="
    prompt_secret "DATABASE_URL" "Enter Database URL (optional, press Enter to skip):"
    echo
    
    # Container Registry Credentials
    print_info "=== Container Registry ==="
    prompt_secret "DOCKER_USERNAME" "Enter Docker Hub username (optional):"
    prompt_secret "DOCKER_PASSWORD" "Enter Docker Hub password (optional):"
    echo
    
    # EKS Cluster Configuration
    print_info "=== EKS Cluster Configuration ==="
    
    # Try to get cluster name from Terraform output or kubectl
    if [ -f "$PROJECT_ROOT/terraform/terraform.tfstate" ]; then
        CLUSTER_NAME=$(cd "$PROJECT_ROOT/terraform" && terraform output -raw cluster_name 2>/dev/null || echo "")
    fi
    
    if [ -z "$CLUSTER_NAME" ]; then
        CLUSTER_NAME=$(kubectl config current-context 2>/dev/null | sed 's/.*\///' || echo "")
    fi
    
    if [ -n "$CLUSTER_NAME" ]; then
        print_info "Detected EKS cluster name: $CLUSTER_NAME"
        set_secret "EKS_CLUSTER_NAME" "$CLUSTER_NAME"
    else
        prompt_secret "EKS_CLUSTER_NAME" "Enter EKS Cluster Name:"
    fi
    echo
    
    # GitHub Token (for GitHub Actions)
    print_info "=== GitHub Personal Access Token (Optional) ==="
    print_info "This is only needed if you want to use advanced GitHub API features"
    prompt_secret "GH_TOKEN" "Enter GitHub Personal Access Token (optional, press Enter to skip):"
    echo
    
    # Application Secrets
    print_info "=== Application Secrets ==="
    prompt_secret "NEXTAUTH_SECRET" "Enter NextAuth Secret (for authentication):"
    prompt_secret "NEXTAUTH_URL" "Enter NextAuth URL (e.g., https://romeomukulah.org):"
    echo
    
    # Email Configuration (if using email service)
    print_info "=== Email Configuration (Optional) ==="
    prompt_secret "EMAIL_SERVER_HOST" "Enter Email Server Host (optional):"
    prompt_secret "EMAIL_SERVER_PORT" "Enter Email Server Port (optional):"
    prompt_secret "EMAIL_SERVER_USER" "Enter Email Server User (optional):"
    prompt_secret "EMAIL_SERVER_PASSWORD" "Enter Email Server Password (optional):"
    prompt_secret "EMAIL_FROM" "Enter Email From Address (optional):"
    echo
    
    # Additional secrets
    print_info "=== Additional Configuration ==="
    
    # Domain name
    DOMAIN_NAME="romeomukulah.org"
    print_info "Setting DOMAIN_NAME to: $DOMAIN_NAME"
    set_secret "DOMAIN_NAME" "$DOMAIN_NAME"
    
    # Environment
    ENVIRONMENT="production"
    print_info "Setting ENVIRONMENT to: $ENVIRONMENT"
    set_secret "ENVIRONMENT" "$ENVIRONMENT"
    
    echo
    print_success "=== GitHub Secrets Setup Complete ==="
    print_info "You can view your secrets at: https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
    echo
    
    # List all secrets (without values)
    print_info "Current secrets in repository:"
    gh secret list --repo="$REPO_OWNER/$REPO_NAME" || true
}

# Run main function
main "$@"
