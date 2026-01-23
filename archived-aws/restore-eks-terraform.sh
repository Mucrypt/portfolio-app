#!/bin/bash

################################################################################
# EKS Cluster Restoration using Terraform
# Infrastructure as Code approach for reproducible deployments
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

# Configuration
CLUSTER_NAME="nexusai-cluster"
REGION="eu-north-1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/terraform"

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║      Terraform EKS Restoration v1.0.0                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing=0
    
    for tool in aws terraform kubectl; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "$tool is not installed"
            missing=1
        fi
    done
    
    if [ $missing -eq 1 ]; then
        log_error "Missing required tools. Run: ./restore-check-prerequisites.sh"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Run: aws configure"
        exit 1
    fi
    
    # Check Terraform directory
    if [ ! -d "$TERRAFORM_DIR" ]; then
        log_error "Terraform directory not found: $TERRAFORM_DIR"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

show_cost_warning() {
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                  COST WARNING ⚠️                       ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}This will create AWS resources that cost approximately:${NC}"
    echo ""
    echo "  • ~\$18/day (~\$540/month)"
    echo "  • EKS Control Plane: \$73/month"
    echo "  • 3x EC2 nodes: \$90-120/month"
    echo "  • Load Balancer: \$20-30/month"
    echo "  • Other services: \$50-80/month"
    echo ""
    echo -e "${RED}Charges begin IMMEDIATELY after resources are created!${NC}"
    echo ""
    echo -e "${YELLOW}Estimated time: 25-35 minutes${NC}"
    echo ""
}

confirm_creation() {
    echo -e "${YELLOW}Do you want to proceed with Terraform deployment?${NC}"
    echo ""
    read -p "Type 'yes' to continue or 'no' to cancel: " -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Terraform deployment cancelled"
        exit 0
    fi
}

initialize_terraform() {
    log_info "Initializing Terraform..."
    
    cd "$TERRAFORM_DIR"
    
    if terraform init; then
        log_success "Terraform initialized"
    else
        log_error "Terraform initialization failed"
        exit 1
    fi
}

plan_infrastructure() {
    log_info "Planning infrastructure changes..."
    echo ""
    
    cd "$TERRAFORM_DIR"
    
    if terraform plan -out=tfplan; then
        echo ""
        log_success "Terraform plan created"
    else
        log_error "Terraform plan failed"
        exit 1
    fi
}

review_plan() {
    echo ""
    echo "Terraform will create the following resources:"
    echo "  • VPC with public and private subnets"
    echo "  • EKS cluster control plane"
    echo "  • 3x EC2 worker nodes (t3.medium)"
    echo "  • IAM roles and policies"
    echo "  • Security groups"
    echo "  • Load balancer"
    echo ""
    read -p "Review looks good? Continue? (yes/no): " -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Terraform apply cancelled"
        rm -f tfplan
        exit 0
    fi
}

apply_infrastructure() {
    log_info "Creating infrastructure with Terraform..."
    echo ""
    log_warning "This will take 25-35 minutes. Please be patient..."
    echo ""
    
    cd "$TERRAFORM_DIR"
    
    if terraform apply tfplan; then
        log_success "Infrastructure created successfully!"
    else
        log_error "Terraform apply failed"
        exit 1
    fi
    
    # Cleanup plan file
    rm -f tfplan
}

configure_kubectl() {
    log_info "Configuring kubectl..."
    
    aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION"
    
    log_success "kubectl configured"
}

verify_cluster() {
    log_info "Verifying cluster..."
    
    # Wait for nodes
    log_info "Waiting for nodes to be ready..."
    local retries=0
    local max_retries=30
    
    while [ $retries -lt $max_retries ]; do
        local ready_nodes=$(kubectl get nodes --no-headers 2>/dev/null | grep -c "Ready" || echo "0")
        
        if [ "$ready_nodes" -ge 3 ]; then
            log_success "$ready_nodes nodes are ready"
            break
        else
            log_info "Waiting for nodes... ($ready_nodes/3 ready)"
            sleep 10
            retries=$((retries + 1))
        fi
    done
    
    # Show cluster info
    echo ""
    log_info "Cluster Information:"
    kubectl get nodes -o wide
}

show_outputs() {
    log_info "Terraform outputs:"
    echo ""
    
    cd "$TERRAFORM_DIR"
    terraform output || true
}

show_next_steps() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║      Terraform Deployment Complete! 🎉               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "EKS cluster '$CLUSTER_NAME' is ready!"
    echo ""
    echo "Cluster Information:"
    echo "  • Name: $CLUSTER_NAME"
    echo "  • Region: $REGION"
    echo "  • Nodes: 3 (t3.medium)"
    echo "  • Cost: ~\$18/day (~\$540/month)"
    echo ""
    echo "Infrastructure managed by Terraform:"
    echo "  • State file: terraform/terraform.tfstate"
    echo "  • To modify: Edit terraform/*.tf files"
    echo "  • To update: terraform plan && terraform apply"
    echo ""
    echo "Next Steps:"
    echo "  1. Deploy your application:"
    echo "     ./restore-app-deploy.sh"
    echo ""
    echo "  2. Check cluster status:"
    echo "     kubectl get nodes"
    echo ""
    echo "  3. View Terraform state:"
    echo "     cd terraform && terraform show"
    echo ""
    echo -e "${YELLOW}⚠️  Remember: You're now being charged ~\$18/day!${NC}"
    echo ""
    echo "To delete cluster and stop charges:"
    echo "  cd terraform && terraform destroy"
    echo "  OR: ./restore-cleanup.sh"
    echo ""
}

cleanup_on_error() {
    log_error "An error occurred during infrastructure creation"
    echo ""
    echo "Do you want to destroy the partially created infrastructure?"
    read -p "Type 'yes' to destroy or 'no' to keep: " -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Destroying infrastructure..."
        cd "$TERRAFORM_DIR"
        terraform destroy -auto-approve || true
    fi
}

main() {
    print_header
    check_prerequisites
    show_cost_warning
    confirm_creation
    
    # Set trap for cleanup on error
    trap cleanup_on_error ERR
    
    initialize_terraform
    plan_infrastructure
    review_plan
    apply_infrastructure
    configure_kubectl
    verify_cluster
    show_outputs
    show_next_steps
}

main "$@"
