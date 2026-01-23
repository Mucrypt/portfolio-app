# AWS Infrastructure (Archived)

**⚠️ This infrastructure has been deprecated and is kept for reference only.**

**Migration Date:** January 23, 2026  
**Reason:** Cost optimization - migrated to Vercel  
**Cost Savings:** $548.88/month → $0/month

---

## What Was Removed

### EKS Cluster

- Cluster name: `nexusai-cluster`
- Region: `eu-north-1`
- Cost: ~$73/month (control plane) + $60-120/month (nodes)
- Status: ✅ **DELETED on January 23, 2026**

### Infrastructure Components

- ❌ 3x EC2 worker nodes (t3.medium)
- ❌ Application Load Balancer
- ❌ EBS volumes
- ❌ VPC and networking
- ❌ IAM roles and policies
- ❌ CloudFormation stacks

### Archived Files

- `terraform/` - Terraform infrastructure as code
- `k8s/` - Kubernetes manifests
- `helm/` - Helm charts
- `docker/` - Docker configurations
- `nginx/` - Nginx configurations
- `.github/workflows/cd-*.yml` - AWS CI/CD pipelines
- `scripts/deploy.sh`, `k8s-deploy.sh`, `setup-eks.sh`

---

## Migration to Vercel

All AWS infrastructure has been replaced with **Vercel** serverless platform.

### New Setup

- ✅ Vercel free tier (zero cost)
- ✅ Global CDN
- ✅ Automatic deployments from GitHub
- ✅ Preview deployments for PRs
- ✅ Automatic SSL/HTTPS
- ✅ Zero maintenance

### Documentation

See [VERCEL.md](./VERCEL.md) for the new Vercel infrastructure.

---

## Cost Comparison

| Item             | AWS EKS    | Vercel    |
| ---------------- | ---------- | --------- |
| **Monthly Cost** | $548.88    | $0        |
| **Setup Time**   | Hours      | Minutes   |
| **Maintenance**  | High       | Zero      |
| **Scaling**      | Manual     | Automatic |
| **CDN**          | Extra cost | Included  |
| **SSL**          | Manual     | Automatic |
| **Deployments**  | Complex    | git push  |

**Annual Savings:** $6,586.56 💰

---

## AWS Cleanup Completed

### Deleted Resources

✅ EKS cluster `nexusai-cluster` (January 23, 2026)  
✅ EC2 instances (3x worker nodes)  
✅ Load balancers  
✅ EBS volumes  
✅ CloudFormation stacks

### Remaining (Free/Harmless)

- IAM roles (no cost)
- S3 bucket (terraform state) - minimal cost
- VPC resources - auto-deleted with EKS

### Verify Deletion

```bash
# Check for running EC2 instances
aws ec2 describe-instances --region eu-north-1 --filters "Name=instance-state-name,Values=running"

# Check for active EKS clusters
aws eks list-clusters --region eu-north-1

# Check AWS bill
# Go to AWS Console → Billing Dashboard
```

---

## If You Need to Reference Old Setup

### Terraform Files

Located in `terraform/` directory:

- `main.tf` - Main infrastructure
- `variables.tf` - Configuration variables
- `modules/` - Reusable modules (EKS, VPC, IAM)

### Kubernetes Manifests

Located in `k8s/production/`:

- `deployment.yaml` - Application deployment
- `service.yaml` - Load balancer service
- `redis.yaml` - Redis cache
- `hpa.yaml` - Auto-scaling

### Scripts

Located in `scripts/`:

- `deploy.sh` - AWS deployment script
- `k8s-deploy.sh` - Kubernetes deployment
- `setup-eks.sh` - EKS cluster creation
- `optimize-costs.sh` - Cost optimization

---

## Why We Migrated

1. **Cost:** AWS EKS was costing $548.88/month for a portfolio site
2. **Complexity:** Kubernetes infrastructure was overkill
3. **Maintenance:** Required constant monitoring and updates
4. **Free Tier Misconception:** User thought they were on free tier
5. **Better Alternative:** Vercel provides same features at zero cost

---

## Lessons Learned

1. ✅ EKS is NOT included in AWS free tier
2. ✅ Control plane costs $73/month + node costs
3. ✅ Free tier promotional credits can mask real costs
4. ✅ Check AWS billing dashboard frequently
5. ✅ Use AWS Cost Explorer to track spending
6. ✅ For static/Next.js sites, use serverless platforms
7. ✅ Kubernetes is overkill for small applications

---

## Emergency Contact

If you accidentally get charged by AWS:

1. **Immediate:** Delete all resources
2. **Check:** AWS Console → EC2 → Running Instances
3. **Verify:** AWS Console → EKS → Clusters
4. **Monitor:** Billing Dashboard for 24-48 hours
5. **Support:** Contact AWS support if charges persist

---

**Questions about the old infrastructure?**  
Files are preserved in git history:

```bash
git log --all -- terraform/ k8s/ docker/
```
