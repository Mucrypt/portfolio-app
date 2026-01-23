# Terraform Quick Reference

Quick reference guide for common Terraform operations.

## 🚀 Quick Start

```bash
# Navigate to Terraform directory
cd ~/portfolio-app/terraform

# Initialize (first time)
terraform init

# Plan
terraform plan

# Apply
terraform apply

# Destroy (careful!)
terraform destroy
```

## 📋 Common Commands

### Initialization

```bash
# Initialize Terraform
terraform init

# Initialize with upgrade
terraform init -upgrade

# Reconfigure backend
terraform init -reconfigure
```

### Planning

```bash
# Create execution plan
terraform plan

# Save plan to file
terraform plan -out=tfplan

# Plan specific target
terraform plan -target=module.eks

# Plan with different var file
terraform plan -var-file="terraform-staging.tfvars"
```

### Applying

```bash
# Apply saved plan
terraform apply tfplan

# Apply with auto-approve (careful!)
terraform apply -auto-approve

# Apply specific target
terraform apply -target=module.k8s-addons

# Apply with different var file
terraform apply -var-file="terraform-staging.tfvars"
```

### State Management

```bash
# List resources in state
terraform state list

# Show specific resource
terraform state show module.vpc.aws_vpc.main

# Pull remote state
terraform state pull > terraform.tfstate.backup

# Remove resource from state
terraform state rm module.rds.aws_db_instance.main

# Move resource in state
terraform state mv module.old_name module.new_name

# Import existing resource
terraform import module.eks.aws_eks_cluster.main portfolio-production-cluster
```

### Outputs

```bash
# Show all outputs
terraform output

# Show specific output
terraform output cluster_name

# Get raw output (no quotes)
terraform output -raw cluster_endpoint

# Output as JSON
terraform output -json
```

### Validation & Formatting

```bash
# Validate configuration
terraform validate

# Format files
terraform fmt

# Format recursively
terraform fmt -recursive

# Check formatting
terraform fmt -check
```

### Workspace Management

```bash
# List workspaces
terraform workspace list

# Create workspace
terraform workspace new staging

# Select workspace
terraform workspace select production

# Delete workspace
terraform workspace delete staging
```

### Troubleshooting

```bash
# Show current state
terraform show

# Refresh state
terraform refresh

# Force unlock state
terraform force-unlock <lock-id>

# Enable debug logging
export TF_LOG=DEBUG
export TF_LOG_PATH=terraform-debug.log
terraform apply
```

## 🔧 Module-Specific Operations

### VPC Module

```bash
# Plan only VPC
terraform plan -target=module.vpc

# Apply only VPC
terraform apply -target=module.vpc

# Show VPC resources
terraform state list | grep vpc

# Show VPC output
terraform output -module=vpc
```

### EKS Module

```bash
# Plan only EKS
terraform plan -target=module.eks

# Apply only EKS
terraform apply -target=module.eks

# Import existing cluster
terraform import module.eks.aws_eks_cluster.main <cluster-name>

# Show EKS outputs
terraform output cluster_name
terraform output cluster_endpoint
```

### IAM Module

```bash
# Plan only IAM
terraform plan -target=module.iam

# Apply only IAM
terraform apply -target=module.iam

# List IAM roles
terraform state list | grep iam_role
```

### K8s Add-ons Module

```bash
# Plan only add-ons
terraform plan -target=module.k8s_addons

# Apply only add-ons
terraform apply -target=module.k8s_addons

# Recreate specific add-on
terraform taint module.k8s_addons.helm_release.nginx_ingress[0]
terraform apply
```

## 📊 Useful AWS CLI Commands

### EKS

```bash
# List clusters
aws eks list-clusters

# Describe cluster
aws eks describe-cluster --name portfolio-production-cluster

# Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name portfolio-production-cluster

# List node groups
aws eks list-nodegroups --cluster-name portfolio-production-cluster

# Describe node group
aws eks describe-nodegroup --cluster-name portfolio-production-cluster --nodegroup-name portfolio-production-general
```

### VPC

```bash
# List VPCs
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=portfolio-production-vpc"

# List subnets
aws ec2 describe-subnets --filters "Name=vpc-id,Values=<vpc-id>"

# List NAT gateways
aws ec2 describe-nat-gateways --filter "Name=vpc-id,Values=<vpc-id>"
```

### IAM

```bash
# List roles
aws iam list-roles | grep portfolio

# Get role
aws iam get-role --role-name portfolio-production-eks-cluster-role

# List policies
aws iam list-policies --scope Local | grep portfolio
```

### S3 (Terraform State)

```bash
# List state files
aws s3 ls s3://portfolio-terraform-state-<account-id>/

# Download state file
aws s3 cp s3://portfolio-terraform-state-<account-id>/portfolio/terraform.tfstate ./terraform.tfstate.backup

# Check versioning
aws s3api get-bucket-versioning --bucket portfolio-terraform-state-<account-id>
```

### DynamoDB (State Lock)

```bash
# Check lock table
aws dynamodb describe-table --table-name portfolio-terraform-locks

# Get lock info
aws dynamodb get-item \
  --table-name portfolio-terraform-locks \
  --key '{"LockID":{"S":"portfolio/terraform.tfstate"}}'
```

## 🔍 kubectl Commands

### Cluster Info

```bash
# Cluster info
kubectl cluster-info

# Get nodes
kubectl get nodes

# Get all resources
kubectl get all --all-namespaces
```

### Add-ons

```bash
# Get Helm releases
helm list --all-namespaces

# Get ingress controller
kubectl get pods -n ingress-nginx

# Get cert-manager
kubectl get pods -n cert-manager

# Get cluster autoscaler
kubectl get pods -n kube-system -l app.kubernetes.io/name=cluster-autoscaler
```

### Application

```bash
# Get deployments
kubectl get deployments -n default

# Get services
kubectl get services -n default

# Get ingress
kubectl get ingress -n default

# Get pods
kubectl get pods -n default

# View logs
kubectl logs -f <pod-name> -n default
```

## 📝 Configuration Files

### terraform.tfvars

```hcl
project_name    = "portfolio"
environment     = "production"
aws_region      = "us-east-1"
cluster_version = "1.31"
domain_name     = "romeomukulah.org"

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

### Backend Configuration

```hcl
terraform {
  backend "s3" {
    bucket         = "portfolio-terraform-state-<account-id>"
    key            = "portfolio/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "portfolio-terraform-locks"
    encrypt        = true
  }
}
```

## 🚨 Emergency Procedures

### State Issues

```bash
# Backup current state
terraform state pull > emergency-backup-$(date +%Y%m%d-%H%M%S).tfstate

# Force unlock
terraform force-unlock <lock-id>

# Restore from backup
aws s3 cp s3://portfolio-terraform-state-<account-id>/portfolio/terraform.tfstate ./
terraform state push terraform.tfstate
```

### Rollback

```bash
# Restore previous state version
aws s3api list-object-versions \
  --bucket portfolio-terraform-state-<account-id> \
  --prefix portfolio/terraform.tfstate

# Download specific version
aws s3api get-object \
  --bucket portfolio-terraform-state-<account-id> \
  --key portfolio/terraform.tfstate \
  --version-id <version-id> \
  terraform.tfstate.previous

# Push to current
terraform state push terraform.tfstate.previous
```

### Disaster Recovery

```bash
# Export all outputs
terraform output -json > outputs-backup.json

# Export state
terraform state pull > state-backup.tfstate

# List all resources
terraform state list > resources-list.txt

# Create disaster recovery script
cat > disaster-recovery.sh << 'EOF'
#!/bin/bash
# Restore from backups
terraform init
terraform state push state-backup.tfstate
terraform plan
terraform apply
EOF
```

## 🔐 Security Checklist

- [ ] AWS credentials rotated regularly
- [ ] MFA enabled on AWS account
- [ ] Terraform state encrypted (S3 + KMS)
- [ ] State lock enabled (DynamoDB)
- [ ] VPC flow logs enabled
- [ ] EKS secrets encrypted (KMS)
- [ ] IAM roles follow least privilege
- [ ] Security groups properly configured
- [ ] Regular security audits performed
- [ ] CloudWatch alarms configured

## 📚 Resources

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform CLI Documentation](https://www.terraform.io/cli)
- [AWS EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

---

**Tip**: Save this file as a bookmark for quick reference!
