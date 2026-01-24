#!/bin/bash

################################################################################
# Quick EKS Cluster Restoration Script
# Restores AWS EKS cluster using eksctl (fastest method)
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
CONFIG_FILE="cluster-config.yaml"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║       Quick EKS Cluster Restoration v1.0.0           ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing=0
    
    for tool in aws eksctl kubectl; do
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
    echo -e "${RED}Charges begin IMMEDIATELY after cluster creation!${NC}"
    echo ""
    echo -e "${YELLOW}Estimated time: 20-30 minutes${NC}"
    echo ""
}

confirm_creation() {
    echo -e "${YELLOW}Do you want to proceed with cluster creation?${NC}"
    echo ""
    read -p "Type 'yes' to continue or 'no' to cancel: " -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Cluster creation cancelled"
        exit 0
    fi
}

check_existing_cluster() {
    log_info "Checking for existing cluster..."
    
    if aws eks describe-cluster --name "$CLUSTER_NAME" --region "$REGION" &> /dev/null; then
        log_warning "Cluster '$CLUSTER_NAME' already exists!"
        echo ""
        echo "Options:"
        echo "  1. Delete existing cluster and recreate"
        echo "  2. Use existing cluster"
        echo "  3. Cancel"
        echo ""
        read -p "Choose option (1/2/3): " -r
        
        case $REPLY in
            1)
                log_info "Deleting existing cluster..."
                eksctl delete cluster --name "$CLUSTER_NAME" --region "$REGION" --wait
                log_success "Existing cluster deleted"
                ;;
            2)
                log_info "Using existing cluster"
                return 0
                ;;
            *)
                log_info "Cancelled"
                exit 0
                ;;
        esac
    else
        log_success "No existing cluster found"
    fi
}

create_cluster() {
    log_info "Creating EKS cluster '$CLUSTER_NAME'..."
    echo ""
    log_warning "This will take 20-30 minutes. Please be patient..."
    echo ""
    
    cd "$SCRIPT_DIR"
    
    if [ ! -f "$CONFIG_FILE" ]; then
        log_error "Config file not found: $CONFIG_FILE"
        exit 1
    fi
    
    # Create cluster
    if eksctl create cluster -f "$CONFIG_FILE"; then
        log_success "Cluster created successfully!"
    else
        log_error "Cluster creation failed"
        exit 1
    fi
}

verify_cluster() {
    log_info "Verifying cluster..."
    
    # Update kubeconfig
    aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION"
    
    # Wait for nodes to be ready
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
    
    if [ $retries -eq $max_retries ]; then
        log_error "Nodes failed to become ready"
        exit 1
    fi
    
    # Show cluster info
    echo ""
    log_info "Cluster Information:"
    kubectl get nodes -o wide
}

install_addons() {
    log_info "Installing cluster add-ons..."
    
    # Install AWS Load Balancer Controller
    log_info "Installing AWS Load Balancer Controller..."
    
    helm repo add eks https://aws.github.io/eks-charts 2>/dev/null || true
    helm repo update
    
    # Create service account
    eksctl create iamserviceaccount \
        --cluster="$CLUSTER_NAME" \
        --namespace=kube-system \
        --name=aws-load-balancer-controller \
        --attach-policy-arn=arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess \
        --override-existing-serviceaccounts \
        --approve \
        --region="$REGION" 2>/dev/null || true
    
    # Install controller
    helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
        -n kube-system \
        --set clusterName="$CLUSTER_NAME" \
        --set serviceAccount.create=false \
        --set serviceAccount.name=aws-load-balancer-controller \
        --wait || log_warning "Load Balancer Controller installation failed (may already exist)"
    
    # Install metrics server
    log_info "Installing metrics server..."
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml 2>/dev/null || true
    
    log_success "Add-ons installation complete"
}

show_next_steps() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           Cluster Restoration Complete! 🎉           ║${NC}"
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
    echo "Next Steps:"
    echo "  1. Deploy your application:"
    echo "     ./restore-app-deploy.sh"
    echo ""
    echo "  2. Check cluster status:"
    echo "     kubectl get nodes"
    echo "     kubectl get pods --all-namespaces"
    echo ""
    echo "  3. View costs in AWS Console:"
    echo "     https://console.aws.amazon.com/billing/home"
    echo ""
    echo -e "${YELLOW}⚠️  Remember: You're now being charged ~\$18/day!${NC}"
    echo ""
    echo "To delete cluster and stop charges:"
    echo "  ./restore-cleanup.sh"
    echo ""
}

cleanup_on_error() {
    log_error "An error occurred during cluster creation"
    echo ""
    echo "Do you want to delete the partially created cluster?"
    read -p "Type 'yes' to delete or 'no' to keep: " -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Deleting cluster..."
        eksctl delete cluster --name "$CLUSTER_NAME" --region "$REGION" --wait || true
    fi
}

main() {
    print_header
    check_prerequisites
    show_cost_warning
    confirm_creation
    check_existing_cluster
    
    # Set trap for cleanup on error
    trap cleanup_on_error ERR
    
    create_cluster
    verify_cluster
    install_addons
    show_next_steps
}

main "$@"
