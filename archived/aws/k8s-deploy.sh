#!/bin/bash

# Portfolio Application - Kubernetes Deployment Helper
# This script helps deploy the application to Kubernetes

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Portfolio App - Kubernetes Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}✗ kubectl not configured. Please run setup-eks.sh first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Select environment:${NC}"
echo "1) Staging"
echo "2) Production"
read -p "Enter choice [1-2]: " env_choice

case $env_choice in
    1)
        ENV="staging"
        NAMESPACE="portfolio-staging"
        VALUES_FILE="helm/portfolio/values-staging.yaml"
        ;;
    2)
        ENV="production"
        NAMESPACE="portfolio-production"
        VALUES_FILE="helm/portfolio/values-production.yaml"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}Deploying to: ${GREEN}$ENV${NC}"
echo -e "${YELLOW}Namespace: ${GREEN}$NAMESPACE${NC}"
echo ""

# Confirm deployment
read -p "Continue with deployment? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Create namespace if not exists
echo -e "${YELLOW}Creating namespace...${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✓ Namespace ready${NC}"

# Create secrets (prompt for values)
echo ""
echo -e "${YELLOW}Creating application secrets...${NC}"

read -p "Enter Supabase URL: " SUPABASE_URL
read -p "Enter Supabase Anon Key: " SUPABASE_KEY

kubectl create secret generic app-secrets \
    --from-literal=NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
    --from-literal=NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_KEY" \
    --namespace=$NAMESPACE \
    --dry-run=client -o yaml | kubectl apply -f -

echo -e "${GREEN}✓ Secrets created${NC}"

# Create Docker registry secret (if using GHCR)
echo ""
echo -e "${YELLOW}Creating Docker registry secret...${NC}"

read -p "Enter GitHub username: " GH_USER
read -sp "Enter GitHub Personal Access Token: " GH_TOKEN
echo ""

kubectl create secret docker-registry ghcr-secret \
    --docker-server=ghcr.io \
    --docker-username=$GH_USER \
    --docker-password=$GH_TOKEN \
    --namespace=$NAMESPACE \
    --dry-run=client -o yaml | kubectl apply -f -

echo -e "${GREEN}✓ Registry secret created${NC}"

# Apply SSL certificates (production only)
if [[ $ENV == "production" ]]; then
    echo ""
    echo -e "${YELLOW}Applying SSL certificates...${NC}"
    kubectl apply -f k8s/production/certificate.yaml
    echo -e "${GREEN}✓ SSL certificates configured${NC}"
fi

# Deploy with Helm
echo ""
echo -e "${YELLOW}Deploying application with Helm...${NC}"

helm upgrade --install portfolio-$ENV ./helm/portfolio \
    --namespace $NAMESPACE \
    --values $VALUES_FILE \
    --set image.tag=${IMAGE_TAG:-latest} \
    --wait \
    --timeout 10m

echo -e "${GREEN}✓ Application deployed${NC}"

# Wait for deployment to be ready
echo ""
echo -e "${YELLOW}Waiting for pods to be ready...${NC}"

kubectl wait --for=condition=ready pod \
    -l app.kubernetes.io/name=portfolio \
    --namespace=$NAMESPACE \
    --timeout=5m

echo -e "${GREEN}✓ All pods are ready${NC}"

# Display deployment information
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${YELLOW}Deployment Information:${NC}"
kubectl get pods -n $NAMESPACE
echo ""

echo -e "${YELLOW}Service Information:${NC}"
kubectl get svc -n $NAMESPACE
echo ""

echo -e "${YELLOW}Ingress Information:${NC}"
kubectl get ingress -n $NAMESPACE
echo ""

# Get application URL
if [[ $ENV == "production" ]]; then
    URL="https://romeomukulah.org"
else
    URL="https://staging.romeomukulah.org"
fi

echo -e "${GREEN}Application URL: $URL${NC}"
echo ""

# Display useful commands
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View logs:        kubectl logs -f -l app.kubernetes.io/name=portfolio -n $NAMESPACE"
echo "  View pods:        kubectl get pods -n $NAMESPACE"
echo "  Describe pod:     kubectl describe pod <pod-name> -n $NAMESPACE"
echo "  Port forward:     kubectl port-forward svc/portfolio-$ENV 3000:80 -n $NAMESPACE"
echo "  Rollback:         helm rollback portfolio-$ENV -n $NAMESPACE"
echo "  Uninstall:        helm uninstall portfolio-$ENV -n $NAMESPACE"
echo ""

# Run smoke test
echo -e "${YELLOW}Running smoke test...${NC}"
sleep 10

if curl -f -s "$URL/api/health" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Smoke test passed!${NC}"
else
    echo -e "${YELLOW}⚠ Smoke test inconclusive. Check logs for details.${NC}"
fi

echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}"
