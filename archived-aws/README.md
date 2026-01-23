# AWS Infrastructure Restoration Scripts

Quick-start scripts to restore AWS EKS infrastructure with a single command.

## 📋 Available Scripts

### 1. `restore-check-prerequisites.sh`

**Purpose:** Check if all required tools are installed  
**Cost:** FREE  
**Time:** ~1 minute

```bash
./archived-aws/restore-check-prerequisites.sh
```

Checks for:

- AWS CLI
- kubectl
- eksctl
- Terraform
- Docker
- AWS credentials
- Available disk space

### 2. `restore-eks-quick.sh`

**Purpose:** Create EKS cluster using eksctl (fastest method)  
**Cost:** ~$18/day starts immediately  
**Time:** 20-30 minutes

```bash
./archived-aws/restore-eks-quick.sh
```

Creates:

- EKS cluster with 3 nodes
- VPC and networking
- IAM roles
- Load Balancer Controller
- Metrics server

### 3. `restore-eks-terraform.sh`

**Purpose:** Create EKS cluster using Terraform (Infrastructure as Code)  
**Cost:** ~$18/day starts immediately  
**Time:** 25-35 minutes

```bash
./archived-aws/restore-eks-terraform.sh
```

Benefits:

- Version-controlled infrastructure
- Reproducible deployments
- Easy to modify and track changes

### 4. `restore-app-deploy.sh`

**Purpose:** Deploy portfolio application to EKS cluster  
**Cost:** No additional cost  
**Time:** 10-15 minutes

```bash
./archived-aws/restore-app-deploy.sh
```

Does:

- Builds Docker image
- Pushes to ECR
- Deploys to Kubernetes
- Sets up Redis
- Configures Load Balancer
- Returns application URL

### 5. `restore-cleanup.sh`

**Purpose:** Delete ALL AWS resources and stop charges  
**Cost:** FREE (saves ~$18/day)  
**Time:** 10-15 minutes

```bash
./archived-aws/restore-cleanup.sh
```

Deletes:

- EKS cluster
- EC2 nodes
- Load Balancers
- EBS volumes
- Application deployments
- ECR repository (optional)

---

## 🚀 Quick Start Guide

### Complete Restoration (from scratch)

```bash
# 1. Check prerequisites
cd /home/mukulah/portfolio-app
./archived-aws/restore-check-prerequisites.sh

# 2. Create EKS cluster (choose one method)
./archived-aws/restore-eks-quick.sh        # Fastest
# OR
./archived-aws/restore-eks-terraform.sh    # Infrastructure as Code

# 3. Deploy application
./archived-aws/restore-app-deploy.sh

# 4. Get your application URL
kubectl get service -n portfolio-production
```

### Cleanup (stop charges)

```bash
# Delete everything
./archived-aws/restore-cleanup.sh
```

---

## 💰 Cost Breakdown

| Component              | Daily Cost | Monthly Cost  |
| ---------------------- | ---------- | ------------- |
| **EKS Control Plane**  | $2.40      | $73           |
| **3x t3.medium nodes** | $3-4       | $90-120       |
| **Load Balancer**      | $0.65-1    | $20-30        |
| **NAT Gateway**        | $1.10      | $33           |
| **Other**              | $0.50-1    | $15-30        |
| **TOTAL**              | **~$8-10** | **~$240-295** |

**⚠️ Charges start IMMEDIATELY when cluster is created!**

---

## 📝 Script Details

### restore-check-prerequisites.sh

**What it does:**

- Verifies AWS CLI installed and configured
- Checks kubectl, eksctl, terraform, docker
- Validates AWS credentials
- Checks available disk space
- Shows cost warning

**Usage:**

```bash
./archived-aws/restore-check-prerequisites.sh
```

**No confirmation needed** - just checks, doesn't create anything.

---

### restore-eks-quick.sh

**What it does:**

1. Validates prerequisites
2. Shows cost warning
3. Asks for confirmation
4. Creates EKS cluster using `eksctl`
5. Installs AWS Load Balancer Controller
6. Installs metrics server for HPA
7. Verifies cluster is ready

**Usage:**

```bash
./archived-aws/restore-eks-quick.sh
```

**Prompts:**

- Confirmation to proceed
- Option to delete existing cluster if found

**Output:**

- Cluster name and region
- Node information
- kubectl commands
- Next steps

---

### restore-eks-terraform.sh

**What it does:**

1. Validates prerequisites
2. Initializes Terraform
3. Shows infrastructure plan
4. Asks for confirmation
5. Creates all resources with Terraform
6. Configures kubectl
7. Verifies cluster

**Usage:**

```bash
./archived-aws/restore-eks-terraform.sh
```

**Benefits over eksctl:**

- Infrastructure as Code
- Version control
- Easy to modify
- Reproducible
- Better for teams

**Files modified:**

- `terraform/terraform.tfstate` - State file
- `terraform/*.tf` - Infrastructure definitions

---

### restore-app-deploy.sh

**What it does:**

1. Checks if cluster exists
2. Creates ECR repository
3. Builds Docker image
4. Pushes to ECR
5. Creates Kubernetes namespace
6. Deploys Redis
7. Creates ConfigMap from `.env.local`
8. Deploys application
9. Creates Load Balancer
10. Returns application URL

**Usage:**

```bash
./archived-aws/restore-app-deploy.sh
```

**Requirements:**

- EKS cluster must exist
- Docker must be running
- `.env.local` file (optional)

**Prompts:**

- Confirmation before building Docker image

---

### restore-cleanup.sh

**What it does:**

1. Shows warning
2. Requires typing "DELETE-EVERYTHING"
3. Deletes Load Balancers
4. Deletes application
5. Deletes EKS cluster
6. Verifies deletion
7. Optional: Deletes ECR repository
8. Cleans up IAM roles (optional)
9. Shows cost savings

**Usage:**

```bash
./archived-aws/restore-cleanup.sh
```

**Safety features:**

- Double confirmation required
- 5-second countdown
- Verifies deletion
- Shows what was deleted

**⚠️ DANGEROUS:** Cannot be undone!

---

## 🎯 Common Scenarios

### Scenario 1: First-time restoration

```bash
# Check everything is ready
./archived-aws/restore-check-prerequisites.sh

# Create cluster (fastest method)
./archived-aws/restore-eks-quick.sh

# Deploy app
./archived-aws/restore-app-deploy.sh
```

**Time:** ~35 minutes  
**Cost:** ~$18/day starts immediately

---

### Scenario 2: Infrastructure as Code

```bash
# Use Terraform instead
./archived-aws/restore-check-prerequisites.sh
./archived-aws/restore-eks-terraform.sh
./archived-aws/restore-app-deploy.sh
```

**Time:** ~40 minutes  
**Cost:** ~$18/day starts immediately

---

### Scenario 3: Testing and cleanup

```bash
# Create cluster
./archived-aws/restore-eks-quick.sh

# Test for a few hours
# ... your testing ...

# Delete everything to stop charges
./archived-aws/restore-cleanup.sh
```

**Cost:** Partial day charged (e.g., 6 hours = ~$4.50)

---

### Scenario 4: Quick deployment for demo

```bash
# Create and deploy everything
./archived-aws/restore-eks-quick.sh && \
./archived-aws/restore-app-deploy.sh

# Give demo (get URL from script output)
# Show to interviewer/client

# Cleanup immediately
./archived-aws/restore-cleanup.sh
```

**Cost:** ~$1-2 for 1-2 hours

---

## 🔧 Troubleshooting

### Script fails: "Prerequisites not met"

```bash
# Run prerequisites check for details
./archived-aws/restore-check-prerequisites.sh

# Install missing tools as instructed
```

### Script fails: "AWS credentials not configured"

```bash
# Configure AWS CLI
aws configure

# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Region: eu-north-1
# - Output format: json
```

### Script fails: "Cluster already exists"

```bash
# Option 1: Use existing cluster
kubectl get nodes

# Option 2: Delete and recreate
./archived-aws/restore-cleanup.sh
./archived-aws/restore-eks-quick.sh
```

### Application won't deploy: "Cannot connect to cluster"

```bash
# Update kubectl config
aws eks update-kubeconfig --name nexusai-cluster --region eu-north-1

# Verify connection
kubectl get nodes
```

### Load Balancer URL not appearing

```bash
# Wait longer (can take 5-10 minutes)
kubectl get service -n portfolio-production --watch

# Check ingress
kubectl get ingress -n portfolio-production

# Check Load Balancer in AWS Console
```

---

## ⚡ Pro Tips

### 1. Run in background

```bash
# Create cluster in background
nohup ./archived-aws/restore-eks-quick.sh > cluster-creation.log 2>&1 &

# Monitor progress
tail -f cluster-creation.log
```

### 2. Save costs

```bash
# Scale down nodes when not in use
kubectl scale deployment portfolio -n portfolio-production --replicas=1

# Or delete cluster completely
./archived-aws/restore-cleanup.sh
```

### 3. Quick testing

```bash
# Create cluster, test for 1 hour, delete
./archived-aws/restore-eks-quick.sh && \
./archived-aws/restore-app-deploy.sh && \
sleep 3600 && \
./archived-aws/restore-cleanup.sh
```

### 4. Verify costs

```bash
# Check AWS billing
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity DAILY \
  --metrics BlendedCost
```

---

## 📚 Additional Resources

- **Full documentation:** [`RESTORATION_GUIDE.md`](RESTORATION_GUIDE.md)
- **Cluster configuration:** [`cluster-config.yaml`](cluster-config.yaml)
- **Kubernetes manifests:** [`k8s/production/`](k8s/production/)
- **Terraform files:** [`terraform/`](terraform/)

---

## ⚠️ Important Notes

1. **Costs start immediately** when you run create scripts
2. **Always run cleanup** when done to stop charges
3. **Monitor AWS billing** daily during testing
4. **Set billing alerts** to avoid surprises
5. **These scripts are for learning/testing** - Vercel is free for production

---

## 🆘 Emergency Cleanup

If something goes wrong and you need to stop charges IMMEDIATELY:

```bash
# Method 1: Use cleanup script
./archived-aws/restore-cleanup.sh

# Method 2: Manual eksctl
eksctl delete cluster --name nexusai-cluster --region eu-north-1 --wait

# Method 3: AWS Console
# Go to: https://console.aws.amazon.com/eks/
# Select cluster → Delete

# Method 4: Nuclear option (deletes EVERYTHING)
aws eks delete-cluster --name nexusai-cluster --region eu-north-1
```

---

**Questions?** Check [`RESTORATION_GUIDE.md`](RESTORATION_GUIDE.md) for detailed documentation.

**Ready to restore?** Start with:

```bash
./archived-aws/restore-check-prerequisites.sh
```
