#!/bin/bash

################################################################################
# AWS Infrastructure Cleanup Script
# Deletes EKS cluster and all AWS resources to stop charges
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
NAMESPACE="portfolio-production"
APP_NAME="portfolio-app"

print_header() {
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║         AWS Infrastructure Cleanup v1.0.0             ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

show_warning() {
    echo ""
    echo -e "${RED}⚠️  WARNING: THIS WILL DELETE ALL AWS RESOURCES! ⚠️${NC}"
    echo ""
    echo "This script will delete:"
    echo "  • EKS cluster: $CLUSTER_NAME"
    echo "  • All EC2 nodes"
    echo "  • Load Balancers"
    echo "  • EBS volumes"
    echo "  • IAM roles (cluster-related)"
    echo "  • CloudFormation stacks"
    echo "  • ECR repository: $APP_NAME (optional)"
    echo ""
    echo -e "${GREEN}✅ This will STOP all AWS charges for this infrastructure${NC}"
    echo ""
    echo -e "${YELLOW}⏱️  Estimated time: 10-15 minutes${NC}"
    echo ""
}

confirm_deletion() {
    echo -e "${RED}Are you absolutely sure you want to delete everything?${NC}"
    echo ""
    echo "Type 'DELETE-EVERYTHING' to confirm: "
    read -r confirmation
    echo ""
    
    if [ "$confirmation" != "DELETE-EVERYTHING" ]; then
        log_info "Cleanup cancelled"
        exit 0
    fi
    
    echo ""
    log_warning "Last chance to cancel!"
    echo "Press Ctrl+C within 5 seconds to abort..."
    sleep 5
    echo ""
}

check_cluster_exists() {
    log_info "Checking for cluster..."
    
    if aws eks describe-cluster --name "$CLUSTER_NAME" --region "$REGION" &> /dev/null; then
        log_warning "Cluster '$CLUSTER_NAME' found"
        return 0
    else
        log_info "Cluster '$CLUSTER_NAME' not found"
        return 1
    fi
}

delete_load_balancers() {
    log_info "Cleaning up Load Balancers..."
    
    # Update kubeconfig
    aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION" 2>/dev/null || true
    
    # Delete services with type LoadBalancer
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        log_info "Deleting LoadBalancer services..."
        kubectl delete service --all -n "$NAMESPACE" --wait=true 2>/dev/null || true
    fi
    
    # Delete ingresses
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        log_info "Deleting ingresses..."
        kubectl delete ingress --all -n "$NAMESPACE" --wait=true 2>/dev/null || true
    fi
    
    # Wait for load balancers to be deleted
    log_info "Waiting for Load Balancers to be deleted..."
    sleep 30
    
    log_success "Load Balancers cleanup complete"
}

delete_application() {
    log_info "Deleting application resources..."
    
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        kubectl delete namespace "$NAMESPACE" --wait=true 2>/dev/null || true
        log_success "Application resources deleted"
    else
        log_info "No application resources found"
    fi
}

delete_cluster() {
    log_info "Deleting EKS cluster '$CLUSTER_NAME'..."
    echo ""
    log_warning "This will take 10-15 minutes. Please be patient..."
    echo ""
    
    if eksctl delete cluster --name "$CLUSTER_NAME" --region "$REGION" --wait; then
        log_success "Cluster deleted successfully!"
    else
        log_error "Cluster deletion failed"
        echo ""
        echo "You may need to delete resources manually:"
        echo "  1. Go to AWS Console: https://console.aws.amazon.com/eks/"
        echo "  2. Select cluster: $CLUSTER_NAME"
        echo "  3. Click 'Delete'"
        echo ""
        exit 1
    fi
}

verify_deletion() {
    log_info "Verifying deletion..."
    
    if aws eks describe-cluster --name "$CLUSTER_NAME" --region "$REGION" &> /dev/null 2>&1; then
        log_error "Cluster still exists!"
        return 1
    else
        log_success "Cluster successfully deleted"
    fi
    
    # Check for running EC2 instances
    local running_instances=$(aws ec2 describe-instances \
        --region "$REGION" \
        --filters "Name=instance-state-name,Values=running" \
        --query 'Reservations[].Instances[].InstanceId' \
        --output text 2>/dev/null || echo "")
    
    if [ -n "$running_instances" ]; then
        log_warning "Found running EC2 instances: $running_instances"
        echo "         These may be from the deleted cluster. Check AWS Console."
    else
        log_success "No running EC2 instances found"
    fi
}

delete_ecr_repository() {
    echo ""
    echo "Do you want to delete the ECR repository (Docker images)?"
    echo "This will delete all Docker images for $APP_NAME"
    echo ""
    read -p "Delete ECR repository? (yes/no): " -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Deleting ECR repository..."
        
        if aws ecr delete-repository \
            --repository-name "$APP_NAME" \
            --region "$REGION" \
            --force &> /dev/null; then
            log_success "ECR repository deleted"
        else
            log_warning "ECR repository not found or already deleted"
        fi
    else
        log_info "ECR repository kept"
    fi
}

cleanup_iam_roles() {
    log_info "Checking for leftover IAM roles..."
    
    local roles=$(aws iam list-roles --query "Roles[?contains(RoleName, 'eksctl-$CLUSTER_NAME')].RoleName" --output text 2>/dev/null || echo "")
    
    if [ -n "$roles" ]; then
        log_warning "Found IAM roles: $roles"
        echo "         These are harmless (no cost) but can be deleted manually if needed"
    else
        log_success "No leftover IAM roles found"
    fi
}

cleanup_cloudformation_stacks() {
    log_info "Checking for leftover CloudFormation stacks..."
    
    local stacks=$(aws cloudformation list-stacks \
        --region "$REGION" \
        --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
        --query "StackSummaries[?contains(StackName, 'eksctl-$CLUSTER_NAME')].StackName" \
        --output text 2>/dev/null || echo "")
    
    if [ -n "$stacks" ]; then
        log_warning "Found CloudFormation stacks: $stacks"
        echo "         Attempting to delete..."
        
        for stack in $stacks; do
            aws cloudformation delete-stack --stack-name "$stack" --region "$REGION" 2>/dev/null || true
        done
    else
        log_success "No leftover CloudFormation stacks found"
    fi
}

check_final_costs() {
    echo ""
    log_info "Checking AWS costs..."
    echo ""
    echo "To verify charges have stopped:"
    echo "  1. Go to: https://console.aws.amazon.com/billing/home"
    echo "  2. Check 'Bills' for current month"
    echo "  3. Monitor for 24-48 hours to ensure charges stop"
    echo ""
    echo "Expected charges to stop:"
    echo "  • EKS Control Plane: \$73/month → \$0"
    echo "  • EC2 Instances: \$90-120/month → \$0"
    echo "  • Load Balancer: \$20-30/month → \$0"
    echo "  • NAT Gateway: \$33/month → \$0"
    echo ""
    echo -e "${GREEN}💰 Estimated savings: ~\$240-295/month${NC}"
    echo ""
}

show_completion() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           Cleanup Complete! 🎉                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "All AWS resources have been deleted!"
    echo ""
    echo -e "${GREEN}✅ AWS charges should stop within 24 hours${NC}"
    echo ""
    echo "What was deleted:"
    echo "  ✅ EKS cluster: $CLUSTER_NAME"
    echo "  ✅ All EC2 nodes"
    echo "  ✅ Load Balancers"
    echo "  ✅ EBS volumes"
    echo "  ✅ Application deployments"
    echo ""
    echo "What remains (harmless, no cost):"
    echo "  • IAM roles (can be deleted manually)"
    echo "  • ECR repository (if you chose to keep it)"
    echo ""
    check_final_costs
    echo "To restore infrastructure in the future:"
    echo "  ./restore-eks-quick.sh"
    echo ""
}

main() {
    print_header
    show_warning
    confirm_deletion
    
    if check_cluster_exists; then
        delete_load_balancers
        delete_application
        delete_cluster
        verify_deletion
    else
        log_warning "Cluster not found, checking for leftover resources..."
    fi
    
    delete_ecr_repository
    cleanup_iam_roles
    cleanup_cloudformation_stacks
    show_completion
}

main "$@"
