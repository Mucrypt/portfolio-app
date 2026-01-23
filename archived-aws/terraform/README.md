# Terraform Infrastructure as Code

This directory contains Terraform configurations for deploying and managing the AWS infrastructure for the Portfolio application.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Modules](#modules)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Outputs](#outputs)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Terraform infrastructure provisions:

- **VPC**: Multi-AZ VPC with public, private, and database subnets
- **EKS**: Managed Kubernetes cluster with node groups
- **IAM**: Roles and policies for EKS and add-ons (IRSA)
- **K8s Add-ons**: Nginx Ingress, Cert Manager, Metrics Server, Cluster Autoscaler, AWS Load Balancer Controller, External DNS, EBS CSI Driver
- **Security**: KMS encryption, VPC flow logs, security groups
- **Monitoring**: CloudWatch logs, metrics

## 📦 Prerequisites

### Required Tools

1. **Terraform** (>= 1.5.0)
   ```bash
   # Install Terraform
   wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
   sudo apt update && sudo apt install terraform
   ```

2. **AWS CLI** (>= 2.0)
   ```bash
   # Already installed: v2.28.21
   aws --version
   ```

3. **kubectl** (>= 1.27)
   ```bash
   # Already installed: v1.35.0
   kubectl version --client
   ```

4. **Helm** (>= 3.0)
   ```bash
   # Already installed: v3.19.4
   helm version
   ```

### AWS Configuration

1. **Configure AWS credentials**:
   ```bash
   aws configure
   # Or use environment variables:
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_REGION="us-east-1"
   ```

2. **Verify AWS access**:
   ```bash
   aws sts get-caller-identity
   ```

## 🏗️ Architecture

### Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VPC (10.0.0.0/16)                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │          Availability Zone 1 (us-east-1a)       │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐  │   │
│  │  │  Public    │ │  Private   │ │  Database  │  │   │
│  │  │  Subnet    │ │  Subnet    │ │  Subnet    │  │   │
│  │  │ .0.0/20    │ │ .48.0/20   │ │ .96.0/20   │  │   │
│  │  └─────┬──────┘ └──────┬─────┘ └────────────┘  │   │
│  │        │               │                        │   │
│  │    [NAT GW]      [EKS Nodes]                   │   │
│  └────────┼───────────────┼────────────────────────┘   │
│           │               │                            │
│  ┌────────┼───────────────┼────────────────────────┐   │
│  │        │               │        AZ 2             │   │
│  │  [Similar structure for AZ 2 and AZ 3]          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│           ▼                                             │
│    [Internet Gateway]                                   │
└─────────────────────────────────────────────────────────┘
```

### EKS Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     EKS Cluster                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Control Plane (Managed)            │   │
│  │  - API Server  - Controller Manager             │   │
│  │  - Scheduler   - etcd                            │   │
│  └───────────────────┬─────────────────────────────┘   │
│                      │                                  │
│  ┌───────────────────┴─────────────────────────────┐   │
│  │              Worker Nodes (Managed)             │   │
│  │                                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │  Node 1  │  │  Node 2  │  │  Node 3  │      │   │
│  │  │ t3.medium│  │ t3.medium│  │ t3.medium│      │   │
│  │  │          │  │          │  │          │      │   │
│  │  │  [Pods]  │  │  [Pods]  │  │  [Pods]  │      │   │
│  │  └──────────┘  └──────────┘  └──────────┘      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Kubernetes Add-ons                 │   │
│  │  - Nginx Ingress Controller                     │   │
│  │  - Cert Manager (Let's Encrypt)                 │   │
│  │  - Cluster Autoscaler                           │   │
│  │  - AWS Load Balancer Controller                 │   │
│  │  - External DNS                                  │   │
│  │  - Metrics Server                                │   │
│  │  - EBS CSI Driver                                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📚 Modules

### 1. VPC Module (`modules/vpc/`)

Creates a multi-AZ VPC with:
- Public subnets (for load balancers)
- Private subnets (for EKS nodes)
- Database subnets (for RDS if needed)
- NAT gateways (one per AZ)
- VPC flow logs

**Resources**: 30+ AWS resources

### 2. EKS Module (`modules/eks/`)

Creates an EKS cluster with:
- EKS control plane
- Managed node groups
- OIDC provider for IRSA
- KMS encryption for secrets
- CloudWatch logging

**Resources**: 20+ AWS resources

### 3. IAM Module (`modules/iam/`)

Creates IAM roles for:
- AWS Load Balancer Controller
- Cluster Autoscaler
- EBS CSI Driver
- External DNS
- Cert Manager

All roles use IRSA (IAM Roles for Service Accounts) for secure pod-level permissions.

**Resources**: 15+ IAM resources

### 4. K8s Add-ons Module (`modules/k8s-addons/`)

Deploys Kubernetes add-ons via Helm:
- **Nginx Ingress Controller**: HTTP/HTTPS routing
- **Cert Manager**: SSL certificate management
- **Cluster Autoscaler**: Automatic node scaling
- **AWS Load Balancer Controller**: ALB/NLB integration
- **External DNS**: Automatic DNS record management
- **Metrics Server**: Resource metrics
- **EBS CSI Driver**: Persistent volume support

**Resources**: 7 Helm releases

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
cd ~/portfolio-app/terraform
```

### Step 2: Set Up Terraform Backend (Optional but Recommended)

Create S3 bucket and DynamoDB table for state management:

```bash
# Create S3 bucket
aws s3api create-bucket \
  --bucket portfolio-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket portfolio-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for locking
aws dynamodb create-table \
  --table-name portfolio-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

Update `main.tf` backend configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "portfolio-terraform-state-<your-account-id>"
    key            = "portfolio/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "portfolio-terraform-locks"
    encrypt        = true
  }
}
```

### Step 3: Review and Customize Variables

Edit `terraform.tfvars`:

```hcl
project_name    = "portfolio"
environment     = "production"
aws_region      = "us-east-1"
cluster_version = "1.31"
domain_name     = "romeomukulah.org"

# Adjust node group configuration if needed
node_groups = {
  general = {
    desired_size   = 3
    min_size       = 2
    max_size       = 10
    instance_types = ["t3.medium"]
    capacity_type  = "ON_DEMAND"
    disk_size      = 50
    labels = {
      role        = "general"
      environment = "production"
    }
  }
}
```

### Step 4: Initialize Terraform

```bash
terraform init
```

### Step 5: Plan the Deployment

```bash
terraform plan -out=tfplan
```

Review the plan carefully. Terraform will show you all resources that will be created.

### Step 6: Apply the Configuration

```bash
terraform apply tfplan
```

This will take approximately 15-20 minutes to complete.

### Step 7: Configure kubectl

```bash
# Get the kubectl config command from Terraform output
aws eks update-kubeconfig --region us-east-1 --name portfolio-production-cluster

# Verify connection
kubectl cluster-info
kubectl get nodes
```

## ⚙️ Configuration

### Environment Variables

```bash
# AWS Configuration
export AWS_REGION="us-east-1"
export AWS_PROFILE="default"

# Terraform Configuration
export TF_LOG="INFO"  # DEBUG, INFO, WARN, ERROR
export TF_LOG_PATH="terraform.log"
```

### Variable Files

Create environment-specific `.tfvars` files:

```bash
# Production
terraform.tfvars

# Staging
terraform-staging.tfvars

# Development
terraform-dev.tfvars
```

Use with:
```bash
terraform apply -var-file="terraform-staging.tfvars"
```

## 🎮 Usage

### Common Commands

```bash
# Initialize Terraform
terraform init

# Format Terraform files
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure (use with caution!)
terraform destroy

# Show current state
terraform show

# List resources
terraform state list

# Show specific resource
terraform state show module.vpc.aws_vpc.main

# Import existing resource
terraform import module.eks.aws_eks_cluster.main portfolio-production-cluster
```

### Managing State

```bash
# Pull remote state
terraform state pull > terraform.tfstate.backup

# Push local state (use with caution!)
terraform state push terraform.tfstate

# Remove resource from state (doesn't destroy)
terraform state rm module.rds.aws_db_instance.main
```

### Upgrading Infrastructure

```bash
# Update provider versions
terraform init -upgrade

# Apply with auto-approve (use carefully)
terraform apply -auto-approve

# Target specific resource
terraform apply -target=module.k8s-addons
```

## 📤 Outputs

After applying, Terraform provides these outputs:

```bash
# View all outputs
terraform output

# View specific output
terraform output cluster_endpoint

# Get kubectl config command
terraform output kubectl_config_command

# Get load balancer DNS
terraform output load_balancer_dns
```

### Available Outputs

- `cluster_name`: EKS cluster name
- `cluster_endpoint`: EKS API endpoint
- `cluster_security_group_id`: EKS cluster security group
- `vpc_id`: VPC ID
- `kubectl_config_command`: Command to configure kubectl
- `load_balancer_dns`: Load balancer DNS name

## 🎯 Best Practices

### 1. State Management

- **Always** use remote state (S3 + DynamoDB)
- **Never** commit `terraform.tfstate` to Git
- Use state locking to prevent concurrent modifications
- Regularly backup your state file

### 2. Security

- Use IAM roles with least privilege
- Enable encryption at rest (KMS)
- Enable VPC flow logs
- Use private subnets for workloads
- Rotate credentials regularly
- Use AWS Secrets Manager for sensitive data

### 3. Cost Optimization

- Use spot instances for non-critical workloads
- Enable cluster autoscaler
- Right-size node groups
- Use reserved instances for production
- Monitor costs with AWS Cost Explorer
- Tag all resources for cost allocation

### 4. High Availability

- Deploy across multiple availability zones
- Use managed node groups
- Configure pod disruption budgets
- Implement health checks
- Use rolling updates

### 5. Monitoring

- Enable CloudWatch logs
- Set up CloudWatch alarms
- Use Container Insights
- Monitor resource utilization
- Track application metrics

### 6. Version Control

- Pin provider versions
- Use Terraform workspaces for environments
- Review plans before applying
- Use pre-commit hooks
- Document changes in commit messages

## 🔧 Troubleshooting

### Common Issues

#### 1. Terraform Init Fails

```bash
# Clear Terraform cache
rm -rf .terraform .terraform.lock.hcl

# Re-initialize
terraform init
```

#### 2. State Lock Issues

```bash
# View lock info
aws dynamodb get-item \
  --table-name portfolio-terraform-locks \
  --key '{"LockID":{"S":"portfolio/terraform.tfstate"}}'

# Force unlock (use with caution!)
terraform force-unlock <lock-id>
```

#### 3. EKS Cluster Not Accessible

```bash
# Update kubeconfig
aws eks update-kubeconfig \
  --region us-east-1 \
  --name portfolio-production-cluster

# Check AWS credentials
aws sts get-caller-identity

# Check cluster status
aws eks describe-cluster --name portfolio-production-cluster
```

#### 4. Node Group Issues

```bash
# Check node group status
aws eks describe-nodegroup \
  --cluster-name portfolio-production-cluster \
  --nodegroup-name portfolio-production-general

# View nodes
kubectl get nodes

# Check node logs
kubectl describe node <node-name>
```

#### 5. Add-on Deployment Failures

```bash
# Check Helm releases
helm list --all-namespaces

# Check pod status
kubectl get pods --all-namespaces

# View pod logs
kubectl logs -n <namespace> <pod-name>

# Re-deploy add-on
terraform taint module.k8s-addons.helm_release.nginx_ingress[0]
terraform apply
```

### Debug Mode

Enable debug logging:

```bash
export TF_LOG=DEBUG
export TF_LOG_PATH=terraform-debug.log
terraform apply
```

### Getting Help

```bash
# View Terraform documentation
terraform -help
terraform -help plan

# View AWS CLI help
aws eks help
aws eks describe-cluster help
```

## 📚 Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)

## 🔄 Maintenance

### Regular Tasks

1. **Update EKS version** (quarterly)
   ```bash
   # Update cluster_version in terraform.tfvars
   # Apply changes
   terraform apply
   ```

2. **Update add-ons** (monthly)
   ```bash
   # Update Helm chart versions in modules/k8s-addons/main.tf
   terraform apply
   ```

3. **Review and update IAM policies** (monthly)

4. **Check for security updates** (weekly)

5. **Review CloudWatch logs and metrics** (weekly)

6. **Optimize costs** (monthly)
   ```bash
   # Review AWS Cost Explorer
   aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 --granularity MONTHLY --metrics BlendedCost
   ```

## 📝 License

This Terraform configuration is part of the Portfolio application.

---

**Note**: Always test changes in a non-production environment first!
