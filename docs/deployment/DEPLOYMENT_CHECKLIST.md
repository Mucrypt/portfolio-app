# 🚀 Portfolio App Deployment Checklist

## Phase 1: Local Docker Testing ✓ IN PROGRESS

### Step 1.1: Build Docker Image ⏳ BUILDING
```bash
docker build -t portfolio-app:latest -f Dockerfile .
```
**Status**: In progress - Installing dependencies...

### Step 1.2: Run Container Locally
```bash
docker run -d \
  --name portfolio-test \
  -p 3000:3000 \
  --env-file .env.local \
  portfolio-app:latest
```

### Step 1.3: Test Application
```bash
# Check if container is running
docker ps

# Check logs
docker logs portfolio-test

# Test health endpoint
curl http://localhost:3000/api/health

# Test in browser
open http://localhost:3000
```

### Step 1.4: Clean Up Test Container
```bash
docker stop portfolio-test
docker rm portfolio-test
```

---

## Phase 2: GitHub Repository Setup

### Step 2.1: Commit All Changes
```bash
git status
git add .
git commit -m "feat: Complete Terraform infrastructure and deployment setup"
git push origin main
```

### Step 2.2: Configure GitHub Secrets
```bash
./scripts/setup-github-secrets.sh
```

**Required Secrets:**
- ✓ AWS_ACCESS_KEY_ID
- ✓ AWS_SECRET_ACCESS_KEY
- ✓ AWS_REGION
- ✓ NEXT_PUBLIC_SUPABASE_URL (from .env.local)
- ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY (from .env.local)
- ✓ EKS_CLUSTER_NAME
- ✓ DOMAIN_NAME (romeomukulah.org)
- ✓ ENVIRONMENT (production)

---

## Phase 3: AWS Infrastructure with Terraform

### Step 3.1: Install Prerequisites
```bash
# Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list
sudo apt update && sudo apt install gh

# Authenticate
gh auth login
```

### Step 3.2: Create Terraform Backend
```bash
# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create S3 bucket
aws s3api create-bucket \
  --bucket portfolio-terraform-state-${ACCOUNT_ID} \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket portfolio-terraform-state-${ACCOUNT_ID} \
  --versioning-configuration Status=Enabled

# Create DynamoDB table
aws dynamodb create-table \
  --table-name portfolio-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Step 3.3: Initialize Terraform
```bash
cd terraform

# Update backend configuration in main.tf with your account ID
# Then initialize
terraform init
```

### Step 3.4: Deploy Infrastructure (2-Phase)
```bash
# Phase 1: Deploy VPC, EKS, IAM (without k8s addons)
# Comment out kubernetes/helm providers and k8s_addons module in main.tf
terraform plan -out=tfplan-phase1
terraform apply tfplan-phase1

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name portfolio-production-cluster

# Verify
kubectl get nodes

# Phase 2: Deploy Kubernetes Add-ons
# Uncomment kubernetes/helm providers and k8s_addons module
terraform plan -out=tfplan-phase2
terraform apply tfplan-phase2

# Verify add-ons
helm list --all-namespaces
kubectl get pods --all-namespaces
```

---

## Phase 4: CI/CD Testing

### Step 4.1: Test GitHub Actions Locally
```bash
# Test CI workflow
./scripts/test-cicd-pipeline.sh ci

# Test Docker build
./scripts/test-cicd-pipeline.sh docker

# Test deployment
./scripts/test-cicd-pipeline.sh deploy
```

### Step 4.2: Trigger CI/CD Pipeline
```bash
# Trigger via push (recommended)
git add .
git commit -m "test: Trigger CI/CD pipeline"
git push origin main

# Or trigger manually
./scripts/test-cicd-pipeline.sh trigger ci.yml

# Monitor
gh run watch
```

---

## Phase 5: Application Deployment to AWS

### Step 5.1: Push Docker Image to ECR (via GitHub Actions)
The CI/CD pipeline will automatically:
1. Build Docker image
2. Push to Amazon ECR
3. Deploy to EKS using Helm

### Step 5.2: Manual Deployment (Alternative)
```bash
# Get ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag portfolio-app:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/portfolio:latest
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/portfolio:latest

# Deploy with Helm
helm upgrade --install portfolio ./helm/portfolio \
  --namespace default \
  --values helm/portfolio/values-production.yaml \
  --set image.repository=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/portfolio \
  --set image.tag=latest
```

### Step 5.3: Verify Deployment
```bash
# Check pods
kubectl get pods -n default

# Check services
kubectl get svc -n default

# Check ingress
kubectl get ingress -n default

# Get load balancer DNS
kubectl get ingress -n default -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'
```

---

## Phase 6: DNS Configuration

### Step 6.1: Get Load Balancer DNS
```bash
LB_DNS=$(kubectl get ingress -n default -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}')
echo "Load Balancer DNS: $LB_DNS"
```

### Step 6.2: Create DNS Record
In your DNS provider (where romeomukulah.org is registered):
- **Type**: CNAME
- **Name**: @ or romeomukulah.org
- **Value**: <load-balancer-dns>
- **TTL**: 300

### Step 6.3: Wait for DNS Propagation
```bash
# Check DNS
nslookup romeomukulah.org

# Test SSL (after propagation)
curl -I https://romeomukulah.org
```

---

## Phase 7: Final Verification

### Step 7.1: Health Checks
```bash
# API health
curl https://romeomukulah.org/api/health

# Application
open https://romeomukulah.org
```

### Step 7.2: Monitor Logs
```bash
# Application logs
kubectl logs -f -l app=portfolio -n default

# Ingress controller logs
kubectl logs -f -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# CloudWatch logs
aws logs tail /aws/eks/portfolio-production-cluster/cluster --follow
```

### Step 7.3: Performance Testing
```bash
# Load test
ab -n 1000 -c 10 https://romeomukulah.org/

# Or use artillery
artillery quick --count 10 --num 100 https://romeomukulah.org/
```

---

## 📝 Current Status

- [ ] Phase 1: Local Docker Testing
  - [x] Build Docker Image (in progress)
  - [ ] Run Container Locally
  - [ ] Test Application
  - [ ] Clean Up
  
- [ ] Phase 2: GitHub Setup
  - [ ] Commit Changes
  - [ ] Configure Secrets
  
- [ ] Phase 3: AWS Infrastructure
  - [ ] Install Prerequisites
  - [ ] Create Backend
  - [ ] Deploy with Terraform
  
- [ ] Phase 4: CI/CD Testing
  - [ ] Test Locally
  - [ ] Trigger Pipeline
  
- [ ] Phase 5: Application Deployment
  - [ ] Deploy to EKS
  - [ ] Verify Deployment
  
- [ ] Phase 6: DNS Configuration
  - [ ] Get Load Balancer DNS
  - [ ] Create DNS Record
  - [ ] Verify SSL
  
- [ ] Phase 7: Final Verification
  - [ ] Health Checks
  - [ ] Monitor Logs
  - [ ] Performance Testing

---

## 🎯 Quick Commands Reference

```bash
# Check Docker build status
docker images | grep portfolio

# Check running containers
docker ps -a

# Check AWS EKS cluster
kubectl get nodes

# Check deployments
kubectl get deployments,services,ingress -n default

# View application logs
kubectl logs -f -l app=portfolio

# Restart deployment
kubectl rollout restart deployment/portfolio

# Scale deployment
kubectl scale deployment/portfolio --replicas=5

# Check Terraform state
cd terraform && terraform show
```

---

## ⚠️ Important Notes

1. **Cost Awareness**: AWS EKS costs ~$300-400/month
2. **Backup**: Always backup before major changes
3. **Testing**: Test in staging before production
4. **Monitoring**: Set up CloudWatch alarms
5. **Security**: Rotate credentials regularly

---

## 🆘 Troubleshooting

### Docker Build Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t portfolio-app:latest .
```

### Terraform Issues
```bash
# Refresh state
terraform refresh

# Force unlock
terraform force-unlock <lock-id>

# Re-initialize
rm -rf .terraform .terraform.lock.hcl
terraform init
```

### Kubernetes Issues
```bash
# Check pod status
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Restart failed pods
kubectl delete pod <pod-name>
```

---

**Next Step**: Wait for Docker build to complete, then proceed with Phase 1.2
