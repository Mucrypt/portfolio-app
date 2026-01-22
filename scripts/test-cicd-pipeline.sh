#!/bin/bash

# CI/CD Pipeline Testing Script
# This script tests the GitHub Actions CI/CD pipelines
# Requirements: GitHub CLI (gh), kubectl, and AWS CLI must be installed and configured

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
WORKFLOWS_DIR="$PROJECT_ROOT/.github/workflows"

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
    
    local missing_tools=()
    
    if ! command_exists gh; then
        missing_tools+=("gh (GitHub CLI)")
    fi
    
    if ! command_exists kubectl; then
        missing_tools+=("kubectl")
    fi
    
    if ! command_exists aws; then
        missing_tools+=("aws (AWS CLI)")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    if ! gh auth status >/dev/null 2>&1; then
        print_error "GitHub CLI is not authenticated. Please run: gh auth login"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to list all workflows
list_workflows() {
    print_info "Available GitHub Actions workflows:"
    gh workflow list --repo="$REPO_OWNER/$REPO_NAME" || true
    echo
}

# Function to get workflow status
get_workflow_status() {
    local workflow_name="$1"
    local run_id="$2"
    
    if [ -n "$run_id" ]; then
        gh run view "$run_id" --repo="$REPO_OWNER/$REPO_NAME"
    else
        gh run list --workflow="$workflow_name" --repo="$REPO_OWNER/$REPO_NAME" --limit=1
    fi
}

# Function to wait for workflow to complete
wait_for_workflow() {
    local run_id="$1"
    local timeout="${2:-600}" # Default 10 minutes
    local elapsed=0
    local interval=10
    
    print_info "Waiting for workflow run $run_id to complete..."
    
    while [ $elapsed -lt $timeout ]; do
        local status=$(gh run view "$run_id" --repo="$REPO_OWNER/$REPO_NAME" --json status --jq '.status')
        local conclusion=$(gh run view "$run_id" --repo="$REPO_OWNER/$REPO_NAME" --json conclusion --jq '.conclusion')
        
        if [ "$status" == "completed" ]; then
            if [ "$conclusion" == "success" ]; then
                print_success "Workflow completed successfully"
                return 0
            else
                print_error "Workflow failed with conclusion: $conclusion"
                return 1
            fi
        fi
        
        echo -ne "\r${BLUE}[INFO]${NC} Status: $status | Elapsed: ${elapsed}s / ${timeout}s"
        sleep $interval
        elapsed=$((elapsed + interval))
    done
    
    echo
    print_error "Workflow timed out after ${timeout}s"
    return 1
}

# Function to trigger a workflow
trigger_workflow() {
    local workflow_file="$1"
    local ref="${2:-main}"
    
    print_info "Triggering workflow: $workflow_file on branch: $ref"
    
    if gh workflow run "$workflow_file" --repo="$REPO_OWNER/$REPO_NAME" --ref="$ref"; then
        print_success "Workflow triggered successfully"
        sleep 5 # Wait for workflow to start
        
        # Get the latest run ID
        local run_id=$(gh run list --workflow="$workflow_file" --repo="$REPO_OWNER/$REPO_NAME" --limit=1 --json databaseId --jq '.[0].databaseId')
        
        if [ -n "$run_id" ]; then
            print_info "Run ID: $run_id"
            print_info "View at: https://github.com/$REPO_OWNER/$REPO_NAME/actions/runs/$run_id"
            return 0
        else
            print_warning "Could not get run ID"
            return 1
        fi
    else
        print_error "Failed to trigger workflow"
        return 1
    fi
}

# Function to test CI workflow
test_ci_workflow() {
    print_info "=== Testing CI Workflow ==="
    
    local workflow_file="ci.yml"
    
    if trigger_workflow "$workflow_file"; then
        local run_id=$(gh run list --workflow="$workflow_file" --repo="$REPO_OWNER/$REPO_NAME" --limit=1 --json databaseId --jq '.[0].databaseId')
        
        if [ -n "$run_id" ]; then
            wait_for_workflow "$run_id"
        fi
    fi
    
    echo
}

# Function to test deployment
test_deployment() {
    print_info "=== Testing Deployment ==="
    
    # Check if cluster is accessible
    if ! kubectl cluster-info >/dev/null 2>&1; then
        print_error "Cannot access Kubernetes cluster"
        return 1
    fi
    
    print_success "Kubernetes cluster is accessible"
    
    # Check deployments
    print_info "Current deployments:"
    kubectl get deployments --all-namespaces | grep portfolio || true
    
    # Check services
    print_info "Current services:"
    kubectl get services --all-namespaces | grep portfolio || true
    
    # Check ingress
    print_info "Current ingress:"
    kubectl get ingress --all-namespaces | grep portfolio || true
    
    echo
}

# Function to test Docker build
test_docker_build() {
    print_info "=== Testing Docker Build ==="
    
    if ! command_exists docker; then
        print_warning "Docker is not installed, skipping Docker build test"
        return 0
    fi
    
    cd "$PROJECT_ROOT"
    
    print_info "Building Docker image..."
    if docker build -t portfolio-test:latest -f docker/Dockerfile.production .; then
        print_success "Docker build successful"
        
        # Clean up test image
        docker rmi portfolio-test:latest || true
    else
        print_error "Docker build failed"
        return 1
    fi
    
    echo
}

# Function to run smoke tests
run_smoke_tests() {
    print_info "=== Running Smoke Tests ==="
    
    # Get the application URL
    local app_url=""
    
    # Try to get from ingress
    if command_exists kubectl; then
        app_url=$(kubectl get ingress -n default -o jsonpath='{.items[0].spec.rules[0].host}' 2>/dev/null || echo "")
        
        if [ -n "$app_url" ]; then
            app_url="https://$app_url"
        fi
    fi
    
    # Fallback to domain name
    if [ -z "$app_url" ]; then
        app_url="https://romeomukulah.org"
    fi
    
    print_info "Testing application at: $app_url"
    
    # Test if application is accessible
    if command_exists curl; then
        if curl -Is "$app_url" | head -n 1 | grep -q "HTTP/"; then
            print_success "Application is accessible"
        else
            print_warning "Application might not be accessible yet"
        fi
    else
        print_warning "curl is not installed, skipping accessibility test"
    fi
    
    echo
}

# Function to check workflow logs
check_workflow_logs() {
    local workflow_file="$1"
    
    print_info "=== Checking Workflow Logs ==="
    
    local run_id=$(gh run list --workflow="$workflow_file" --repo="$REPO_OWNER/$REPO_NAME" --limit=1 --json databaseId --jq '.[0].databaseId')
    
    if [ -n "$run_id" ]; then
        print_info "Showing logs for run: $run_id"
        gh run view "$run_id" --repo="$REPO_OWNER/$REPO_NAME" --log
    else
        print_warning "No runs found for workflow: $workflow_file"
    fi
    
    echo
}

# Function to display summary
display_summary() {
    print_info "=== CI/CD Testing Summary ==="
    
    echo -e "${BLUE}Repository:${NC} https://github.com/$REPO_OWNER/$REPO_NAME"
    echo -e "${BLUE}Actions:${NC} https://github.com/$REPO_OWNER/$REPO_NAME/actions"
    echo
    
    print_info "Recent workflow runs:"
    gh run list --repo="$REPO_OWNER/$REPO_NAME" --limit=5
    
    echo
}

# Main function
main() {
    print_info "=== CI/CD Pipeline Testing for $REPO_OWNER/$REPO_NAME ==="
    echo
    
    check_prerequisites
    echo
    
    list_workflows
    
    # Run tests
    test_docker_build
    test_deployment
    run_smoke_tests
    
    # Display summary
    display_summary
    
    print_success "=== CI/CD Testing Complete ==="
}

# Parse command line arguments
case "${1:-}" in
    ci)
        check_prerequisites
        test_ci_workflow
        ;;
    deploy)
        check_prerequisites
        test_deployment
        ;;
    docker)
        check_prerequisites
        test_docker_build
        ;;
    smoke)
        check_prerequisites
        run_smoke_tests
        ;;
    logs)
        check_prerequisites
        check_workflow_logs "${2:-ci.yml}"
        ;;
    list)
        check_prerequisites
        list_workflows
        ;;
    trigger)
        check_prerequisites
        trigger_workflow "${2:-ci.yml}" "${3:-main}"
        ;;
    *)
        main "$@"
        ;;
esac
