# Terraform Deployment Guide

Complete guide for deploying the Portfolio application to AWS EKS using Terraform.

## 🎯 Overview

This guide will walk you through:
1. Setting up Terraform backend (S3 + DynamoDB)
2. Deploying infrastructure with Terraform
3. Configuring GitHub secrets for CI/CD
4. Testing the CI/CD pipelines
5. Deploying the application

## 📋 Prerequisites

✅ **Already Installed:**
- AWS CLI: v2.28.21
- eksctl: v0.221.0
- kubectl: v1.35.0
- Helm: v3.19.4

✅ **Need to Install:**
- Terraform >= 1.5.0
- GitHub CLI (gh)

## 🚀 Step-by-Step Deployment

### Step 1: Install Missing Tools

#### Install Terraform

```bash
# Add HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# Add HashiCorp repository
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# Update and install
sudo apt update && sudo apt install terraform

# Verify installation
terraform --version
```

#### Install GitHub CLI

```bash
# Add GitHub CLI repository
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# Update and install
sudo apt update && sudo apt install gh

# Authenticate
gh auth login
```

### Step 2: Verify AWS Configuration

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check EKS cluster
kubectl get nodes

# Expected output: Your existing EKS cluster nodes
```

### Step 3: Set Up Terraform Backend

Create S3 bucket and DynamoDB table for state management:

```bash
# Get your AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create S3 bucket for Terraform state
aws s3api create-bucket \
  --bucket portfolio-terraform-state-${ACCOUNT_ID} \
  --region us-east-1

# Enable versioning on the bucket
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

### Step 4: Configure Terraform Backend

Update the backend configuration in `terraform/main.tf`:

```bash
cd ~/portfolio-app/terraform

# Get your account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Uncomment and update backend configuration
sed -i 's/# backend "s3"/backend "s3"/' main.tf
sed -i "s/# bucket         = \"portfolio-terraform-state\"/bucket         = \"portfolio-terraform-state-${ACCOUNT_ID}\"/" main.tf
sed -i 's/# key            = "portfolio\/terraform.tfstate"/key            = "portfolio\/terraform.tfstate"/' main.tf
sed -i 's/# region         = "us-east-1"/region         = "us-east-1"/' main.tf
sed -i 's/# dynamodb_table = "portfolio-terraform-locks"/dynamodb_table = "portfolio-terraform-locks"/' main.tf
sed -i 's/# encrypt        = true/encrypt        = true/' main.tf
```

Or manually edit `main.tf` and uncomment the backend block:

```hcl
terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket         = "portfolio-terraform-state-<your-account-id>"
    key            = "portfolio/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "portfolio-terraform-locks"
    encrypt        = true
  }

  # ... rest of configuration
}
```

### Step 5: Initialize Terraform

```bash
cd ~/portfolio-app/terraform

# Initialize Terraform
terraform init

# Expected output:
# Terraform has been successfully initialized!
```

### Step 6: Review Configuration

Review and customize `terraform.tfvars`:

```bash
# Edit if needed
nano terraform.tfvars
```

Key variables to review:
- `project_name`: "portfolio"
- `environment`: "production"
- `aws_region`: "us-east-1"
- `cluster_version`: "1.31"
- `domain_name`: "romeomukulah.org"
- `node_groups`: Node group configuration

### Step 7: Import Existing EKS Cluster (If Applicable)

If you already have an EKS cluster running:

```bash
# Get your cluster name
CLUSTER_NAME=$(kubectl config current-context | sed 's/.*\///')

# Import the cluster
terraform import module.eks.aws_eks_cluster.main $CLUSTER_NAME

# Import node groups (adjust name as needed)
terraform import module.eks.aws_eks_node_group.main[\"general\"] $CLUSTER_NAME:portfolio-production-general
```

**Note**: If you prefer to create a new cluster, skip this step.

### Step 8: Plan Terraform Deployment

```bash
# Validate configuration
terraform validate

# Format files
terraform fmt -recursive

# Generate and review execution plan
terraform plan -out=tfplan

# Review the plan carefully!
# It will show all resources that will be created/modified/destroyed
```

### Step 9: Apply Terraform Configuration

```bash
# Apply the plan
terraform apply tfplan

# This will take approximately 15-20 minutes
# Terraform will create:
# - VPC with subnets, NAT gateways, route tables
# - EKS cluster and node groups
# - IAM roles and policies
# - Kubernetes add-ons (Nginx, Cert Manager, etc.)
```

### Step 10: Configure kubectl

```bash
# Get the kubectl config command from Terraform output
aws eks update-kubeconfig --region us-east-1 --name $(terraform output -raw cluster_name)

# Verify connection
kubectl cluster-info
kubectl get nodes

# Check add-ons
helm list --all-namespaces
kubectl get pods --all-namespaces
```

### Step 11: Set Up GitHub Secrets

Run the GitHub secrets setup script:

```bash
cd ~/portfolio-app

# Make sure GitHub CLI is authenticated
gh auth status

# Run the setup script
./scripts/setup-github-secrets.sh
```

The script will prompt you for:
1. AWS credentials (Access Key ID, Secret Access Key, Region)
2. Supabase credentials (URL, Anon Key, Service Role Key)
3. Database URL (optional)
4. Docker Hub credentials (optional)
5. EKS cluster name (auto-detected)
6. Application secrets (NextAuth Secret, NextAuth URL)
7. Email configuration (optional)

**Required secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EKS_CLUSTER_NAME`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DOMAIN_NAME`
- `ENVIRONMENT`

### Step 12: Test CI/CD Pipelines

Run the CI/CD testing script:

```bash
# Run all tests
./scripts/test-cicd-pipeline.sh

# Or run specific tests:
./scripts/test-cicd-pipeline.sh docker    # Test Docker build
./scripts/test-cicd-pipeline.sh deploy    # Test deployment
./scripts/test-cicd-pipeline.sh smoke     # Run smoke tests
./scripts/test-cicd-pipeline.sh list      # List workflows
./scripts/test-cicd-pipeline.sh trigger ci.yml  # Trigger CI workflow
```

### Step 13: Deploy Application

You can deploy using either:

#### Option A: GitHub Actions (Recommended)

```bash
# Trigger deployment via GitHub Actions
git add .
git commit -m "feat: Deploy to Terraform-managed EKS cluster"
git push origin main

# Monitor the deployment
gh run list
gh run watch
```

#### Option B: Manual Helm Deployment

```bash
cd ~/portfolio-app

# Build and push Docker image
docker build -t <your-registry>/portfolio:latest -f docker/Dockerfile .
docker push <your-registry>/portfolio:latest

# Deploy with Helm
helm upgrade --install portfolio ./helm/portfolio \
  --namespace default \
  --create-namespace \
  --set image.repository=<your-registry>/portfolio \
  --set image.tag=latest \
  --set ingress.enabled=true \
  --set ingress.host=romeomukulah.org \
  --values helm/portfolio/values-production.yaml

# Check deployment
kubectl get pods
kubectl get services
kubectl get ingress
```

### Step 14: Verify Deployment

```bash
# Check pods
kubectl get pods -n default

# Check services
kubectl get services -n default

# Check ingress
kubectl get ingress -n default

# Get load balancer DNS
kubectl get ingress -n default -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'

# Test application
curl -I https://romeomukulah.org
```

### Step 15: Configure DNS

Update your domain DNS records:

1. Get the load balancer DNS:
   ```bash
   kubectl get ingress -n default -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'
   ```

2. Create a CNAME record:
   - **Type**: CNAME
   - **Name**: @ (or romeomukulah.org)
   - **Value**: <load-balancer-dns>
   - **TTL**: 300

3. Wait for DNS propagation (5-30 minutes)

4. Verify:
   ```bash
   nslookup romeomukulah.org
   curl -I https://romeomukulah.org
   ```

## 📊 Terraform Outputs

View all Terraform outputs:

```bash
cd ~/portfolio-app/terraform

# View all outputs
terraform output

# View specific output
terraform output cluster_name
terraform output cluster_endpoint
terraform output vpc_id
terraform output load_balancer_dns
```

## 🔍 Monitoring and Logs

### CloudWatch Logs

```bash
# View EKS control plane logs
aws logs tail /aws/eks/portfolio-production-cluster/cluster --follow

# View VPC flow logs
aws logs tail /aws/vpc/portfolio-production --follow
```

### Kubernetes Logs

```bash
# View pod logs
kubectl logs -f <pod-name> -n default

# View all pods in namespace
kubectl get pods -n default

# Describe pod
kubectl describe pod <pod-name> -n default

# View events
kubectl get events -n default --sort-by='.lastTimestamp'
```

### Metrics

```bash
# View node metrics
kubectl top nodes

# View pod metrics
kubectl top pods -n default

# View cluster info
kubectl cluster-info dump
```

## 🔧 Maintenance

### Update Infrastructure

```bash
cd ~/portfolio-app/terraform

# Make changes to .tf files or terraform.tfvars

# Plan changes
terraform plan -out=tfplan

# Review and apply
terraform apply tfplan
```

### Update EKS Version

```bash
# Update cluster_version in terraform.tfvars
nano terraform.tfvars

# Plan and apply
terraform plan -out=tfplan
terraform apply tfplan

# Update node groups (done automatically by Terraform)
```

### Update Add-ons

```bash
# Update Helm chart versions in modules/k8s-addons/main.tf
nano modules/k8s-addons/main.tf

# Apply changes
terraform apply
```

### Scale Node Groups

```bash
# Update node group configuration in terraform.tfvars
nano terraform.tfvars

# Example: Change desired_size from 3 to 5
node_groups = {
  general = {
    desired_size   = 5  # Changed from 3
    min_size       = 2
    max_size       = 10
    # ...
  }
}

# Apply changes
terraform apply
```

## 🔒 Security Best Practices

1. **Rotate AWS credentials regularly**
2. **Use IAM roles with least privilege**
3. **Enable MFA for AWS accounts**
4. **Regularly update EKS and add-on versions**
5. **Monitor CloudWatch logs and set up alarms**
6. **Use AWS Secrets Manager for sensitive data**
7. **Enable VPC flow logs (already enabled)**
8. **Use private subnets for workloads (already configured)**
9. **Regularly scan containers for vulnerabilities**
10. **Implement network policies in Kubernetes**

## 🚨 Troubleshooting

### Terraform Issues

```bash
# Terraform state issues
terraform state list
terraform state show <resource>

# Force unlock (if state is locked)
terraform force-unlock <lock-id>

# Refresh state
terraform refresh
```

### EKS Issues

```bash
# Can't connect to cluster
aws eks update-kubeconfig --region us-east-1 --name portfolio-production-cluster

# Node issues
kubectl get nodes
kubectl describe node <node-name>

# Pod issues
kubectl get pods --all-namespaces
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### DNS Issues

```bash
# Check external DNS logs
kubectl logs -n kube-system -l app.kubernetes.io/name=external-dns

# Check ingress
kubectl describe ingress -n default

# Check load balancer
kubectl get svc -n ingress-nginx
```

## 📚 Additional Resources

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)

## ✅ Checklist

- [ ] Terraform installed
- [ ] GitHub CLI installed and authenticated
- [ ] AWS credentials configured
- [ ] Terraform backend created (S3 + DynamoDB)
- [ ] Terraform initialized
- [ ] Configuration reviewed and customized
- [ ] Terraform plan reviewed
- [ ] Infrastructure deployed
- [ ] kubectl configured
- [ ] GitHub secrets configured
- [ ] CI/CD pipelines tested
- [ ] Application deployed
- [ ] DNS configured
- [ ] Application accessible at https://romeomukulah.org

## 🎉 Success!

Your Portfolio application is now running on AWS EKS with:
- ✅ Infrastructure as Code (Terraform)
- ✅ Managed Kubernetes (EKS)
- ✅ High Availability (Multi-AZ)
- ✅ Auto-scaling (Cluster Autoscaler)
- ✅ SSL/TLS (Cert Manager + Let's Encrypt)
- ✅ Load Balancing (AWS Load Balancer Controller)
- ✅ DNS Management (External DNS)
- ✅ CI/CD Automation (GitHub Actions)
- ✅ Monitoring (CloudWatch + Metrics Server)
- ✅ Security (IAM Roles, KMS Encryption, VPC Flow Logs)

---

**Note**: Keep your AWS credentials, Terraform state, and GitHub secrets secure!
