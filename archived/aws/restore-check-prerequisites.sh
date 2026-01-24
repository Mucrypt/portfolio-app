#!/bin/bash

################################################################################
# AWS Infrastructure Prerequisites Check
# Verifies all required tools and credentials before restoration
################################################################################

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

MISSING_TOOLS=()
WARNINGS=()

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║         AWS Prerequisites Check v1.0.0               ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_tool() {
    local tool=$1
    local install_cmd=$2
    
    if command -v "$tool" &> /dev/null; then
        local version=$($tool --version 2>&1 | head -1 || echo "unknown")
        log_success "$tool is installed ($version)"
        return 0
    else
        log_error "$tool is NOT installed"
        MISSING_TOOLS+=("$tool")
        echo "         Install with: $install_cmd"
        return 1
    fi
}

check_aws_credentials() {
    log_info "Checking AWS credentials..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not installed"
        return 1
    fi
    
    if aws sts get-caller-identity &> /dev/null; then
        local account=$(aws sts get-caller-identity --query Account --output text)
        local user=$(aws sts get-caller-identity --query Arn --output text)
        log_success "AWS credentials configured"
        echo "         Account: $account"
        echo "         User: $user"
        return 0
    else
        log_error "AWS credentials NOT configured"
        echo "         Run: aws configure"
        return 1
    fi
}

check_aws_region() {
    log_info "Checking AWS region..."
    
    local region=$(aws configure get region 2>/dev/null || echo "")
    
    if [ -z "$region" ]; then
        log_warning "AWS region not set"
        echo "         Run: aws configure set region eu-north-1"
        WARNINGS+=("AWS region not configured")
    else
        log_success "AWS region: $region"
    fi
}

check_docker() {
    log_info "Checking Docker..."
    
    if command -v docker &> /dev/null; then
        if docker ps &> /dev/null; then
            local version=$(docker --version)
            log_success "Docker is running ($version)"
        else
            log_warning "Docker installed but not running"
            echo "         Run: sudo systemctl start docker"
            WARNINGS+=("Docker not running")
        fi
    else
        log_error "Docker is NOT installed"
        MISSING_TOOLS+=("docker")
        echo "         Install from: https://docs.docker.com/get-docker/"
    fi
}

check_kubectl_config() {
    log_info "Checking kubectl configuration..."
    
    if command -v kubectl &> /dev/null; then
        if kubectl config current-context &> /dev/null; then
            local context=$(kubectl config current-context)
            log_warning "kubectl is already configured (context: $context)"
            echo "         This will be overwritten during cluster creation"
        else
            log_success "kubectl ready for configuration"
        fi
    fi
}

check_disk_space() {
    log_info "Checking disk space..."
    
    local available=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    
    if [ "$available" -lt 10 ]; then
        log_warning "Low disk space: ${available}GB available"
        echo "         Recommended: at least 10GB free"
        WARNINGS+=("Low disk space")
    else
        log_success "Disk space: ${available}GB available"
    fi
}

check_git_status() {
    log_info "Checking Git repository..."
    
    if [ -d ".git" ]; then
        local branch=$(git branch --show-current 2>/dev/null || echo "unknown")
        local status=$(git status --porcelain 2>/dev/null | wc -l)
        
        log_success "Git repository detected (branch: $branch)"
        
        if [ "$status" -gt 0 ]; then
            log_warning "$status uncommitted changes"
            WARNINGS+=("Uncommitted Git changes")
        fi
    else
        log_warning "Not in a Git repository"
    fi
}

estimate_costs() {
    echo ""
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║              COST WARNING - READ CAREFULLY            ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Running these scripts will create AWS resources that cost money:${NC}"
    echo ""
    echo "  • EKS Control Plane:     ~\$73/month"
    echo "  • 3x t3.medium nodes:    ~\$90-120/month"
    echo "  • Load Balancer:         ~\$20-30/month"
    echo "  • NAT Gateway:           ~\$33/month"
    echo "  • EBS Volumes:           ~\$9/month"
    echo "  • Data Transfer:         ~\$10-20/month"
    echo ""
    echo -e "${RED}  TOTAL: ~\$240-295/month (\$2,880-3,540/year)${NC}"
    echo ""
    echo -e "${YELLOW}Charges begin IMMEDIATELY when you create the cluster!${NC}"
    echo ""
}

main() {
    print_header
    
    log_info "Checking required tools..."
    echo ""
    
    # Check all required tools
    check_tool "aws" "curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip && unzip awscliv2.zip && sudo ./aws/install"
    check_tool "kubectl" "curl -LO https://dl.k8s.io/release/\$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/"
    check_tool "eksctl" "curl -sL https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_\$(uname -s)_amd64.tar.gz | tar xz -C /tmp && sudo mv /tmp/eksctl /usr/local/bin"
    check_tool "helm" "curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash"
    check_tool "docker" "https://docs.docker.com/get-docker/"
    check_tool "git" "sudo apt-get install git  # or: sudo yum install git"
    check_tool "jq" "sudo apt-get install jq  # or: sudo yum install jq"
    
    echo ""
    check_aws_credentials
    check_aws_region
    check_docker
    check_kubectl_config
    check_disk_space
    check_git_status
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Summary
    if [ ${#MISSING_TOOLS[@]} -eq 0 ]; then
        log_success "All required tools are installed!"
    else
        log_error "Missing ${#MISSING_TOOLS[@]} required tools:"
        for tool in "${MISSING_TOOLS[@]}"; do
            echo "  • $tool"
        done
        echo ""
        log_error "Please install missing tools before proceeding"
        estimate_costs
        exit 1
    fi
    
    if [ ${#WARNINGS[@]} -gt 0 ]; then
        log_warning "${#WARNINGS[@]} warnings:"
        for warning in "${WARNINGS[@]}"; do
            echo "  • $warning"
        done
        echo ""
    fi
    
    estimate_costs
    
    log_success "Prerequisites check complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Review the cost warning above"
    echo "  2. Run: ./restore-eks-quick.sh (fastest)"
    echo "     OR: ./restore-eks-terraform.sh (infrastructure as code)"
    echo ""
}

main "$@"
