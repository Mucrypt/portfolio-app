#!/bin/bash

# Portfolio Application - AWS EKS Setup Script
# This script sets up the EKS cluster and all necessary components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Portfolio App - AWS EKS Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Configuration
CLUSTER_NAME="${EKS_CLUSTER_NAME:-portfolio-cluster}"
AWS_REGION="${AWS_REGION:-us-east-1}"
NODE_TYPE="${NODE_TYPE:-t3.medium}"
NODE_COUNT="${NODE_COUNT:-3}"

echo -e "${YELLOW}Configuration:${NC}"
echo "  Cluster Name: $CLUSTER_NAME"
echo "  Region: $AWS_REGION"
echo "  Node Type: $NODE_TYPE"
echo "  Node Count: $NODE_COUNT"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}✗ AWS CLI not found. Please install it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS CLI installed${NC}"

if ! command -v eksctl &> /dev/null; then
    echo -e "${RED}✗ eksctl not found. Installing...${NC}"
    curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
    sudo mv /tmp/eksctl /usr/local/bin
fi
echo -e "${GREEN}✓ eksctl installed${NC}"

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl not found. Installing...${NC}"
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    rm kubectl
fi
echo -e "${GREEN}✓ kubectl installed${NC}"

if ! command -v helm &> /dev/null; then
    echo -e "${RED}✗ Helm not found. Installing...${NC}"
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi
echo -e "${GREEN}✓ Helm installed${NC}"

echo ""
echo -e "${YELLOW}Creating EKS cluster...${NC}"

# Create EKS cluster
eksctl create cluster \
  --name $CLUSTER_NAME \
  --region $AWS_REGION \
  --node-type $NODE_TYPE \
  --nodes $NODE_COUNT \
  --nodes-min 2 \
  --nodes-max 10 \
  --managed \
  --with-oidc \
  --ssh-access \
  --ssh-public-key ~/.ssh/id_rsa.pub \
  --tags Environment=production,Project=portfolio-app

echo -e "${GREEN}✓ EKS cluster created${NC}"

# Update kubeconfig
echo -e "${YELLOW}Updating kubeconfig...${NC}"
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
echo -e "${GREEN}✓ kubeconfig updated${NC}"

# Install AWS Load Balancer Controller
echo -e "${YELLOW}Installing AWS Load Balancer Controller...${NC}"

# Create IAM policy
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.6.0/docs/install/iam_policy.json

aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json || true

rm iam_policy.json

# Create IAM service account
eksctl create iamserviceaccount \
  --cluster=$CLUSTER_NAME \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/AWSLoadBalancerControllerIAMPolicy \
  --approve \
  --region=$AWS_REGION || true

# Install AWS Load Balancer Controller using Helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

echo -e "${GREEN}✓ AWS Load Balancer Controller installed${NC}"

# Install Nginx Ingress Controller
echo -e "${YELLOW}Installing Nginx Ingress Controller...${NC}"

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.metrics.enabled=true \
  --set controller.podAnnotations."prometheus\.io/scrape"=true \
  --set controller.podAnnotations."prometheus\.io/port"=10254

echo -e "${GREEN}✓ Nginx Ingress Controller installed${NC}"

# Install cert-manager
echo -e "${YELLOW}Installing cert-manager...${NC}"

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for cert-manager to be ready
echo "Waiting for cert-manager pods to be ready..."
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=cert-manager \
  -n cert-manager \
  --timeout=300s

echo -e "${GREEN}✓ cert-manager installed${NC}"

# Create namespaces
echo -e "${YELLOW}Creating namespaces...${NC}"
kubectl apply -f k8s/base/namespace.yaml
echo -e "${GREEN}✓ Namespaces created${NC}"

# Install metrics server
echo -e "${YELLOW}Installing metrics server...${NC}"
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
echo -e "${GREEN}✓ Metrics server installed${NC}"

# Get Load Balancer URL
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}EKS Cluster Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${YELLOW}Getting Ingress Load Balancer URL...${NC}"
echo "This may take a few minutes..."

# Wait for load balancer to be provisioned
sleep 60

LB_URL=$(kubectl get svc ingress-nginx-controller \
  -n ingress-nginx \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

if [ -n "$LB_URL" ]; then
    echo -e "${GREEN}Load Balancer URL: $LB_URL${NC}"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Update your DNS records:"
    echo "   - Create A record for romeomukulah.org pointing to: $LB_URL"
    echo "   - Create A record for www.romeomukulah.org pointing to: $LB_URL"
    echo "   - Create A record for staging.romeomukulah.org pointing to: $LB_URL"
    echo ""
    echo "2. Apply SSL certificates:"
    echo "   kubectl apply -f k8s/production/certificate.yaml"
    echo ""
    echo "3. Deploy the application:"
    echo "   helm install portfolio-production ./helm/portfolio --namespace portfolio-production -f helm/portfolio/values-production.yaml"
    echo ""
    echo "4. Check deployment status:"
    echo "   kubectl get pods -n portfolio-production"
else
    echo -e "${YELLOW}⚠ Load Balancer URL not available yet. Run this command later:${NC}"
    echo "   kubectl get svc ingress-nginx-controller -n ingress-nginx"
fi

echo ""
echo -e "${GREEN}Cluster Information:${NC}"
echo "  Cluster Name: $CLUSTER_NAME"
echo "  Region: $AWS_REGION"
echo "  Kubeconfig: Updated"
echo ""
echo -e "${GREEN}Useful Commands:${NC}"
echo "  View nodes:     kubectl get nodes"
echo "  View pods:      kubectl get pods --all-namespaces"
echo "  View services:  kubectl get svc --all-namespaces"
echo ""
