#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Portfolio App Deployment Script${NC}"
echo "=================================="

# Check if commit message is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Commit message required${NC}"
    echo "Usage: ./scripts/deploy.sh \"Your commit message\""
    exit 1
fi

COMMIT_MESSAGE="$1"
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo -e "${YELLOW}📝 Branch: $BRANCH${NC}"
echo -e "${YELLOW}💬 Commit: $COMMIT_MESSAGE${NC}"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}📦 Committing changes...${NC}"
    git add .
    git commit -m "$COMMIT_MESSAGE"
    echo -e "${GREEN}✅ Changes committed${NC}"
else
    echo -e "${YELLOW}ℹ️  No changes to commit${NC}"
fi

# Push to GitHub
echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
git push origin "$BRANCH"
COMMIT_SHA=$(git rev-parse HEAD)
echo -e "${GREEN}✅ Pushed commit: $COMMIT_SHA${NC}"

# Wait for CI workflow to start
echo -e "${YELLOW}⏳ Waiting for CI workflow to start...${NC}"
sleep 10

# Get the workflow run ID
RUN_ID=$(gh run list --branch "$BRANCH" --limit 1 --json databaseId --jq '.[0].databaseId')
echo -e "${YELLOW}🔄 Watching CI workflow (ID: $RUN_ID)...${NC}"

# Watch the workflow
while true; do
    STATUS=$(gh run view "$RUN_ID" --json status --jq '.status')
    
    if [ "$STATUS" == "completed" ]; then
        CONCLUSION=$(gh run view "$RUN_ID" --json conclusion --jq '.conclusion')
        if [ "$CONCLUSION" == "success" ]; then
            echo -e "${GREEN}✅ CI workflow completed successfully${NC}"
            break
        else
            echo -e "${RED}❌ CI workflow failed with conclusion: $CONCLUSION${NC}"
            echo -e "${YELLOW}View logs: gh run view $RUN_ID --log${NC}"
            exit 1
        fi
    fi
    
    echo -e "${YELLOW}⏳ CI still running... (status: $STATUS)${NC}"
    sleep 15
done

# Deploy to Kubernetes
echo -e "${YELLOW}🚢 Deploying to production...${NC}"
# Use first 40 chars of commit SHA to match what GitHub Actions creates
COMMIT_SHA_SHORT=$(echo "$COMMIT_SHA" | cut -c1-40)
IMAGE="ghcr.io/mucrypt/portfolio-app:$COMMIT_SHA_SHORT"

kubectl set image deployment/portfolio-app -n portfolio-production portfolio="$IMAGE"
echo -e "${GREEN}✅ Image updated in deployment${NC}"

# Wait for rollout
echo -e "${YELLOW}⏳ Waiting for rollout to complete...${NC}"
if kubectl rollout status deployment/portfolio-app -n portfolio-production --timeout=10m; then
    echo -e "${GREEN}✅ Rollout completed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Rollout status check timed out, verifying pods...${NC}"
    # Check if pods are actually running
    READY_PODS=$(kubectl get deployment portfolio-app -n portfolio-production -o jsonpath='{.status.readyReplicas}')
    DESIRED_PODS=$(kubectl get deployment portfolio-app -n portfolio-production -o jsonpath='{.spec.replicas}')
    
    if [ "$READY_PODS" == "$DESIRED_PODS" ]; then
        echo -e "${GREEN}✅ All $READY_PODS/$DESIRED_PODS pods are ready${NC}"
    else
        echo -e "${RED}❌ Only $READY_PODS/$DESIRED_PODS pods are ready${NC}"
        kubectl get pods -n portfolio-production -l app=portfolio
        exit 1
    fi
fi

# Get pod name
POD_NAME=$(kubectl get pods -n portfolio-production -l app=portfolio --sort-by=.metadata.creationTimestamp -o jsonpath='{.items[-1].metadata.name}')

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "=================================="
echo -e "${GREEN}🎉 Deployment Complete${NC}"
echo "=================================="
echo -e "📦 Image: $IMAGE"
echo -e "🏷️  Commit: $COMMIT_SHA"
echo -e "🔗 Website: https://romeomukulah.org"
echo ""
echo -e "${YELLOW}📊 View pod logs:${NC}"
echo "   kubectl logs $POD_NAME -n portfolio-production -f"
echo ""
echo -e "${YELLOW}📈 Check status:${NC}"
echo "   kubectl get pods -n portfolio-production"
