# Portfolio Application - Complete Deployment Guide

## 📋 Deployment Checklist

### Phase 1: Local Testing ✓
- [ ] Build Docker containers
- [ ] Test locally with Docker Compose
- [ ] Verify application works
- [ ] Test database connections

### Phase 2: AWS Infrastructure Setup
- [ ] Install Terraform
- [ ] Configure AWS credentials
- [ ] Create Terraform backend (S3 + DynamoDB)
- [ ] Deploy infrastructure with Terraform
- [ ] Verify EKS cluster is running

### Phase 3: GitHub Configuration
- [ ] Install GitHub CLI
- [ ] Configure GitHub secrets
- [ ] Verify repository access

### Phase 4: CI/CD Testing
- [ ] Test Docker build
- [ ] Test CI pipeline
- [ ] Verify deployment pipeline

### Phase 5: Production Deployment
- [ ] Deploy to AWS EKS
- [ ] Configure DNS
- [ ] Setup SSL certificates
- [ ] Verify application is live

---

## Phase 1: Local Testing

### Step 1.1: Build Docker Containers

```bash
# Navigate to project root
cd ~/portfolio-app

# Build production Docker image
docker build -t portfolio-app:latest -f docker/Dockerfile .

# Build development Docker image
docker build -t portfolio-app:dev -f docker/Dockerfile.dev .
```

### Step 1.2: Set Up Environment Variables

```bash
# Create .env file for local testing
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
EOF

echo "⚠️  Please update .env.local with your actual credentials"
```

### Step 1.3: Run Locally with Docker Compose

```bash
# Start the application
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Test the application
curl http://localhost:3000

# Stop the application
docker-compose -f docker/docker-compose.yml down
```

### Step 1.4: Test Production Build

```bash
# Start production container
docker run -d \
  --name portfolio-test \
  -p 3000:3000 \
  --env-file .env.local \
  portfolio-app:latest

# Check logs
docker logs -f portfolio-test

# Test
curl http://localhost:3000

# Cleanup
docker stop portfolio-test
docker rm portfolio-test
```

---

## Phase 2: AWS Infrastructure Setup

### Step 2.1: Install Required Tools

```bash
# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verify installation
terraform --version

# Install GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# Authenticate GitHub CLI
gh auth login
```

### Step 2.2: Configure AWS Credentials

```bash
# Verify AWS CLI is configured
aws sts get-caller-identity

# If not configured, run:
aws configure

# Test connection
aws eks list-clusters --region us-east-1
```

### Step 2.3: Create Terraform Backend

```bash
# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create S3 bucket for Terraform state
aws s3api create-bucket \
  --bucket portfolio-terraform-state-${ACCOUNT_ID} \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket portfolio-terraform-state-${ACCOUNT_ID} \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket portfolio-terraform-state-${ACCOUNT_ID} \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket portfolio-terraform-state-${ACCOUNT_ID} \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name portfolio-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

echo "✅ Terraform backend created successfully!"
echo "S3 Bucket: portfolio-terraform-state-${ACCOUNT_ID}"
echo "DynamoDB Table: portfolio-terraform-locks"
```

### Step 2.4: Configure Terraform Backend

```bash
cd ~/portfolio-app/terraform

# Update main.tf with your account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Uncomment and update backend configuration in main.tf
sed -i "s/# backend \"s3\" {/backend \"s3\" {/" main.tf
sed -i "s/#   bucket/  bucket/" main.tf
sed -i "s/#   key/  key/" main.tf
sed -i "s/#   region/  region/" main.tf
sed -i "s/#   encrypt/  encrypt/" main.tf
sed -i "s/#   dynamodb_table/  dynamodb_table/" main.tf
sed -i "s/# }/}/" main.tf
sed -i "s/portfolio-terraform-state/portfolio-terraform-state-${ACCOUNT_ID}/" main.tf
```

### Step 2.5: Initialize Terraform

```bash
cd ~/portfolio-app/terraform

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Format files
terraform fmt -recursive
```

### Step 2.6: Review Terraform Plan

```bash
# Create execution plan
terraform plan -out=tfplan

# Review what will be created:
# - VPC with 3 AZs
# - EKS cluster
# - IAM roles
# - Node groups
# - Kubernetes add-ons
```

### Step 2.7: Deploy Infrastructure (Phase 1 - Base Infrastructure)

```bash
# First, comment out the k8s_addons module and providers
# This is already done in main.tf with comments

# Apply Terraform (this takes 15-20 minutes)
terraform apply tfplan

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name $(terraform output -raw cluster_name)

# Verify cluster
kubectl cluster-info
kubectl get nodes
```

### Step 2.8: Deploy Kubernetes Add-ons (Phase 2)

```bash
# Uncomment the Kubernetes and Helm providers in main.tf
# Uncomment the k8s_addons module in main.tf

# Re-initialize Terraform
terraform init

# Plan again
terraform plan -out=tfplan

# Apply add-ons
terraform apply tfplan

# Verify add-ons
helm list --all-namespaces
kubectl get pods --all-namespaces
```

---

## Phase 3: GitHub Configuration

### Step 3.1: Configure GitHub Secrets

```bash
cd ~/portfolio-app

# Run the GitHub secrets setup script
./scripts/setup-github-secrets.sh

# You'll be prompted for:
# - AWS credentials
# - Supabase credentials
# - Database URL (optional)
# - Docker Hub credentials (optional)
# - EKS cluster name (auto-detected)
# - Application secrets (NextAuth)
# - Email configuration (optional)
```

### Step 3.2: Verify GitHub Secrets

```bash
# List all secrets
gh secret list --repo Mucrypt/portfolio-app

# Expected secrets:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_REGION
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - EKS_CLUSTER_NAME
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - DOMAIN_NAME
# - ENVIRONMENT
```

---

## Phase 4: CI/CD Testing

### Step 4.1: Test Docker Build

```bash
# Option A (recommended): run the helper
./scripts/test-cicd-pipeline.sh docker

# Option B: manual build (no push)
docker build -t portfolio-app:latest -f docker/Dockerfile .
docker build -t portfolio-app:dev -f docker/Dockerfile.dev .
```

**If Docker fails with** `Cannot connect to the Docker daemon` **or** `System has not been booted with systemd`:

**WSL2 (recommended): Docker Desktop integration**
- Install Docker Desktop on Windows
- In Docker Desktop: Settings → Resources → WSL Integration → enable your Ubuntu distro
- Back in WSL: `docker info` should show a Server section

**WSL2 (alternative): enable systemd in WSL**
```bash
# Enable systemd in WSL
sudo tee /etc/wsl.conf > /dev/null << 'EOF'
[boot]
systemd=true
EOF

# Restart WSL from Windows (PowerShell)
wsl --shutdown

# After reopening WSL, install Docker Engine and start it
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo systemctl enable --now docker

# Verify
docker info
```

### Step 4.2: Test CI Pipeline

```bash
# Trigger CI workflow manually
gh workflow run ci.yml --ref main

# Watch the latest run
gh run list --limit 5
gh run watch
```

### Step 4.3: Verify Deployment Pipeline (Staging)

```bash
# Staging deploy triggers on pushes to develop
git checkout develop
git pull
git commit --allow-empty -m "test: trigger staging deploy"
git push origin develop

# Or trigger manually
gh workflow run cd-staging.yml --ref develop

# Verify rollout (requires AWS + kubectl access to the cluster)
kubectl get pods -n portfolio-staging
kubectl rollout status deployment/portfolio-staging -n portfolio-staging
```

### Step 4.4: Manual Pipeline Trigger

```bash
# Trigger CI workflow manually
gh workflow run ci.yml

# Production deploy triggers on tags like v1.2.3
git tag -a v0.0.1 -m "test: production deploy"
git push origin v0.0.1

# Or trigger via workflow_dispatch
gh workflow run cd-production.yml -f tag=latest -f reason="Manual deploy"
```

---

## Phase 5: Production Deployment

### Step 5.1: Deploy with Helm

```bash
cd ~/portfolio-app

# Update Helm values with your image
# Edit helm/portfolio/values-production.yaml

# Deploy to production
helm upgrade --install portfolio ./helm/portfolio \
  --namespace default \
  --create-namespace \
  --values helm/portfolio/values-production.yaml \
  --set image.repository=<your-registry>/portfolio \
  --set image.tag=latest

# Verify deployment
kubectl get pods -n default
kubectl get services -n default
kubectl get ingress -n default
```

### Step 5.2: Get Load Balancer DNS

```bash
# Get the load balancer DNS
kubectl get ingress -n default -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'

# Or for service
kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

### Step 5.3: Configure DNS

```bash
# Get load balancer DNS
LB_DNS=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "Load Balancer DNS: $LB_DNS"
echo ""
echo "Configure your DNS:"
echo "Type: CNAME"
echo "Name: @ (or romeomukulah.org)"
echo "Value: $LB_DNS"
echo "TTL: 300"
```

### Step 5.4: Verify SSL Certificate

```bash
# Check cert-manager
kubectl get certificate -n default

# Check certificate status
kubectl describe certificate portfolio-tls -n default

# Wait for certificate to be ready (may take 2-5 minutes)
kubectl wait --for=condition=Ready certificate/portfolio-tls -n default --timeout=300s
```

### Step 5.5: Test the Application

```bash
# Test HTTP redirect
curl -I http://romeomukulah.org

# Test HTTPS
curl -I https://romeomukulah.org

# Full test
curl https://romeomukulah.org

# Open in browser
xdg-open https://romeomukulah.org
```

---

## Monitoring and Logs

### View Application Logs

```bash
# Get pod name
POD_NAME=$(kubectl get pods -n default -l app=portfolio -o jsonpath='{.items[0].metadata.name}')

# View logs
kubectl logs -f $POD_NAME -n default

# View logs for all pods
kubectl logs -f -l app=portfolio -n default
```

### View Ingress Logs

```bash
# Get ingress controller logs
kubectl logs -f -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### View Cluster Autoscaler Logs

```bash
kubectl logs -f -n kube-system -l app.kubernetes.io/name=cluster-autoscaler
```

### View CloudWatch Logs

```bash
# View EKS control plane logs
aws logs tail /aws/eks/portfolio-production-cluster/cluster --follow

# View VPC flow logs
aws logs tail /aws/vpc/portfolio-production --follow
```

---

## Troubleshooting

### Issue: Pods not starting

```bash
# Check pod status
kubectl get pods -n default

# Describe pod
kubectl describe pod <pod-name> -n default

# Check events
kubectl get events -n default --sort-by='.lastTimestamp'
```

### Issue: Ingress not working

```bash
# Check ingress
kubectl describe ingress -n default

# Check ingress controller
kubectl get pods -n ingress-nginx

# Check external DNS logs
kubectl logs -n kube-system -l app.kubernetes.io/name=external-dns
```

### Issue: Certificate not issuing

```bash
# Check certificate status
kubectl describe certificate -n default

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Check certificate request
kubectl describe certificaterequest -n default
```

### Issue: DNS not resolving

```bash
# Check DNS records
nslookup romeomukulah.org

# Check external DNS
kubectl logs -n kube-system -l app.kubernetes.io/name=external-dns

# Manually create DNS record if needed
```

---

## Rollback Procedures

### Rollback Helm Deployment

```bash
# List releases
helm list -n default

# View history
helm history portfolio -n default

# Rollback to previous version
helm rollback portfolio -n default

# Rollback to specific revision
helm rollback portfolio 1 -n default
```

### Rollback with kubectl

```bash
# Rollback deployment
kubectl rollout undo deployment/portfolio -n default

# Check rollout status
kubectl rollout status deployment/portfolio -n default
```

---

## Scaling

### Manual Scaling

```bash
# Scale deployment
kubectl scale deployment/portfolio -n default --replicas=5

# Verify
kubectl get pods -n default
```

### Horizontal Pod Autoscaler

```bash
# Check HPA status
kubectl get hpa -n default

# Describe HPA
kubectl describe hpa portfolio -n default
```

### Cluster Autoscaler

```bash
# Check cluster autoscaler logs
kubectl logs -n kube-system -l app.kubernetes.io/name=cluster-autoscaler

# Check node status
kubectl get nodes
```

---

## Cost Monitoring

```bash
# Check AWS costs
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=TAG,Key=Project

# Estimated monthly cost: $300-400
# - EKS Control Plane: ~$73/month
# - 3x t3.medium nodes: ~$90/month
# - NAT Gateways (3): ~$98/month
# - EBS volumes: ~$15/month
# - Load Balancers: ~$20/month
```

---

## Success Checklist

✅ **Infrastructure**
- [ ] VPC created with 3 AZs
- [ ] EKS cluster running
- [ ] Node groups healthy
- [ ] All add-ons deployed

✅ **Application**
- [ ] Docker images built
- [ ] Application deployed
- [ ] Pods running
- [ ] Service accessible

✅ **Networking**
- [ ] Ingress controller running
- [ ] Load balancer created
- [ ] DNS configured
- [ ] SSL certificate issued

✅ **CI/CD**
- [ ] GitHub secrets configured
- [ ] CI pipeline passing
- [ ] CD pipeline working
- [ ] Automated deployments functional

✅ **Monitoring**
- [ ] CloudWatch logs enabled
- [ ] Application logs accessible
- [ ] Metrics available
- [ ] Alerts configured (optional)

---

## Next Steps

1. **Set up monitoring**: Configure CloudWatch alarms and dashboards
2. **Implement backups**: Set up automated backups for data
3. **Add custom domain**: Configure additional domains if needed
4. **Optimize costs**: Review and optimize resource usage
5. **Security hardening**: Implement network policies and pod security policies
6. **Performance tuning**: Optimize application and infrastructure
7. **Documentation**: Document custom procedures and runbooks

---

## Support Resources

- **AWS EKS Documentation**: https://docs.aws.amazon.com/eks/
- **Terraform Documentation**: https://www.terraform.io/docs
- **Helm Documentation**: https://helm.sh/docs/
- **Kubernetes Documentation**: https://kubernetes.io/docs/

---

**Status**: Ready for deployment! 🚀
