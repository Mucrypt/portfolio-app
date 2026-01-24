#!/bin/bash

################################################################################
# Application Deployment Script
# Deploys portfolio application to EKS cluster
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
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║       Application Deployment Script v1.0.0           ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if cluster exists
    if ! aws eks describe-cluster --name "$CLUSTER_NAME" --region "$REGION" &> /dev/null; then
        log_error "Cluster '$CLUSTER_NAME' does not exist"
        echo "         Run: ./restore-eks-quick.sh first"
        exit 1
    fi
    
    # Check kubectl connection
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        echo "         Run: aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! docker ps &> /dev/null; then
        log_error "Docker is not running"
        echo "         Run: sudo systemctl start docker"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

get_ecr_repository() {
    log_info "Setting up ECR repository..."
    
    local account_id=$(aws sts get-caller-identity --query Account --output text)
    local ecr_uri="$account_id.dkr.ecr.$REGION.amazonaws.com/$APP_NAME"
    
    # Create repository if it doesn't exist
    if ! aws ecr describe-repositories --repository-names "$APP_NAME" --region "$REGION" &> /dev/null; then
        log_info "Creating ECR repository..."
        aws ecr create-repository --repository-name "$APP_NAME" --region "$REGION" || true
    fi
    
    log_success "ECR repository ready: $ecr_uri"
    echo "$ecr_uri"
}

build_and_push_image() {
    log_info "Building and pushing Docker image..."
    
    local ecr_uri=$1
    local account_id=$(aws sts get-caller-identity --query Account --output text)
    
    cd "$PROJECT_ROOT"
    
    # Login to ECR
    log_info "Logging in to ECR..."
    aws ecr get-login-password --region "$REGION" | \
        docker login --username AWS --password-stdin "$account_id.dkr.ecr.$REGION.amazonaws.com"
    
    # Build image
    log_info "Building Docker image..."
    if [ -f "Dockerfile" ]; then
        docker build -t "$APP_NAME:latest" .
    elif [ -f "archived-aws/docker/Dockerfile" ]; then
        docker build -t "$APP_NAME:latest" -f archived-aws/docker/Dockerfile .
    else
        log_error "Dockerfile not found"
        exit 1
    fi
    
    # Tag and push
    log_info "Tagging and pushing image..."
    docker tag "$APP_NAME:latest" "$ecr_uri:latest"
    docker tag "$APP_NAME:latest" "$ecr_uri:$(date +%Y%m%d-%H%M%S)"
    
    docker push "$ecr_uri:latest"
    docker push "$ecr_uri:$(date +%Y%m%d-%H%M%S)"
    
    log_success "Image pushed to ECR"
}

create_namespace() {
    log_info "Creating namespace..."
    
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        log_success "Namespace '$NAMESPACE' already exists"
    else
        kubectl create namespace "$NAMESPACE"
        log_success "Namespace '$NAMESPACE' created"
    fi
}

deploy_redis() {
    log_info "Deploying Redis..."
    
    if [ -f "$SCRIPT_DIR/k8s/production/redis.yaml" ]; then
        kubectl apply -f "$SCRIPT_DIR/k8s/production/redis.yaml"
        
        # Wait for Redis to be ready
        kubectl wait --for=condition=ready pod -l app=redis -n "$NAMESPACE" --timeout=120s || \
            log_warning "Redis pod not ready yet (will continue anyway)"
        
        log_success "Redis deployed"
    else
        log_warning "Redis manifest not found, skipping..."
    fi
}

create_configmap() {
    log_info "Creating ConfigMap..."
    
    # Create ConfigMap from .env.local
    if [ -f "$PROJECT_ROOT/.env.local" ]; then
        kubectl create configmap portfolio-env \
            --from-env-file="$PROJECT_ROOT/.env.local" \
            -n "$NAMESPACE" \
            --dry-run=client -o yaml | kubectl apply -f -
        
        log_success "ConfigMap created"
    else
        log_warning ".env.local not found, creating minimal ConfigMap..."
        
        kubectl create configmap portfolio-env \
            --from-literal=NODE_ENV=production \
            --from-literal=PORT=3000 \
            -n "$NAMESPACE" \
            --dry-run=client -o yaml | kubectl apply -f -
    fi
}

update_deployment_manifest() {
    log_info "Updating deployment manifest..."
    
    local ecr_uri=$1
    local manifest_file="$SCRIPT_DIR/k8s/production/deployment.yaml"
    
    if [ ! -f "$manifest_file" ]; then
        log_error "Deployment manifest not found: $manifest_file"
        exit 1
    fi
    
    # Create a temporary copy with updated image
    cp "$manifest_file" "$manifest_file.tmp"
    
    # Update image in manifest
    sed -i "s|image:.*|image: $ecr_uri:latest|g" "$manifest_file.tmp"
    
    echo "$manifest_file.tmp"
}

deploy_application() {
    log_info "Deploying application..."
    
    local manifest_file=$1
    local k8s_dir="$SCRIPT_DIR/k8s/production"
    
    # Deploy application
    kubectl apply -f "$manifest_file"
    
    # Deploy service
    if [ -f "$k8s_dir/service.yaml" ]; then
        kubectl apply -f "$k8s_dir/service.yaml"
    fi
    
    # Deploy HPA
    if [ -f "$k8s_dir/hpa.yaml" ]; then
        kubectl apply -f "$k8s_dir/hpa.yaml"
    fi
    
    # Deploy ingress
    if [ -f "$k8s_dir/ingress.yaml" ]; then
        kubectl apply -f "$k8s_dir/ingress.yaml"
    fi
    
    log_success "Application deployed"
}

wait_for_deployment() {
    log_info "Waiting for deployment to be ready..."
    
    kubectl wait --for=condition=available \
        deployment/portfolio \
        -n "$NAMESPACE" \
        --timeout=300s || log_warning "Deployment not ready yet"
    
    log_success "Deployment is ready"
}

get_load_balancer_url() {
    log_info "Getting Load Balancer URL..."
    
    local retries=0
    local max_retries=30
    
    while [ $retries -lt $max_retries ]; do
        local lb_hostname=$(kubectl get service -n "$NAMESPACE" -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
        
        if [ -n "$lb_hostname" ]; then
            log_success "Load Balancer URL: http://$lb_hostname"
            echo ""
            echo "Your application is accessible at:"
            echo "  http://$lb_hostname"
            echo ""
            return 0
        else
            log_info "Waiting for Load Balancer... ($retries/$max_retries)"
            sleep 10
            retries=$((retries + 1))
        fi
    done
    
    log_warning "Load Balancer URL not available yet"
    echo "         Check later with: kubectl get service -n $NAMESPACE"
}

show_deployment_info() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         Application Deployment Complete! 🎉          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log_info "Deployment Information:"
    echo ""
    kubectl get pods -n "$NAMESPACE"
    echo ""
    kubectl get services -n "$NAMESPACE"
    echo ""
    
    log_info "Useful Commands:"
    echo ""
    echo "View pods:"
    echo "  kubectl get pods -n $NAMESPACE"
    echo ""
    echo "View logs:"
    echo "  kubectl logs -n $NAMESPACE -l app=portfolio --tail=100 -f"
    echo ""
    echo "Check service:"
    echo "  kubectl get service -n $NAMESPACE"
    echo ""
    echo "Get Load Balancer URL:"
    echo "  kubectl get ingress -n $NAMESPACE"
    echo ""
    echo "Scale deployment:"
    echo "  kubectl scale deployment portfolio -n $NAMESPACE --replicas=5"
    echo ""
}

main() {
    print_header
    check_prerequisites
    
    # Get ECR repository
    local ecr_uri=$(get_ecr_repository)
    
    # Build and push image
    echo ""
    log_warning "Building Docker image will take 5-10 minutes..."
    read -p "Continue? (yes/no): " -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        log_info "Deployment cancelled"
        exit 0
    fi
    
    build_and_push_image "$ecr_uri"
    
    # Deploy to Kubernetes
    create_namespace
    create_configmap
    deploy_redis
    
    local manifest=$(update_deployment_manifest "$ecr_uri")
    deploy_application "$manifest"
    
    # Cleanup temp file
    rm -f "$manifest"
    
    wait_for_deployment
    get_load_balancer_url
    show_deployment_info
}

main "$@"
