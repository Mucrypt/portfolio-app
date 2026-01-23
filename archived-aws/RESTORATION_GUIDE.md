# AWS EKS Infrastructure Restoration Guide

**⚠️ COST WARNING: Following this guide will incur AWS charges of ~$548/month**

This guide explains how to restore the AWS EKS infrastructure if needed in the future.

---

## 📋 Table of Contents

1. [Cost Warning](#-cost-warning)
2. [Prerequisites](#-prerequisites)
3. [Quick Restore](#-quick-restore)
4. [Manual Step-by-Step Setup](#-manual-step-by-step-setup)
5. [Deployment](#-deployment)
6. [Cheaper AWS Alternatives](#-cheaper-aws-alternatives)
7. [Migration Path](#-migration-path)

---

## 💰 Cost Warning

### Monthly Costs Breakdown

| Component                     | Cost/Month    | Annual Cost       |
| ----------------------------- | ------------- | ----------------- |
| **EKS Control Plane**         | $73.00        | $876.00           |
| **3x t3.medium nodes**        | $90-120       | $1,080-1,440      |
| **Application Load Balancer** | $20-30        | $240-360          |
| **EBS Volumes (90GB)**        | $9            | $108              |
| **Data Transfer**             | $10-20        | $120-240          |
| **NAT Gateway**               | $33           | $396              |
| **CloudWatch Logs**           | $5-10         | $60-120           |
| **Total**                     | **~$240-295** | **~$2,880-3,540** |

**Note:** Original estimate of $548/month was likely higher due to:

- Larger node types or more nodes
- Higher data transfer
- Additional services (RDS, ElastiCache, etc.)

### Free Tier Notes

- ❌ EKS is **NOT** included in AWS free tier
- ❌ EC2 t3.medium is **NOT** free tier eligible
- ✅ Free tier only covers: t2.micro (750 hours/month), limited storage, data transfer

---

## 🔧 Prerequisites

### Required Tools

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Install Terraform (for infrastructure as code)
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### AWS Account Setup

```bash
# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Region: eu-north-1 (or your preferred region)
# - Output format: json

# Verify credentials
aws sts get-caller-identity
```

---

## ⚡ Quick Restore

### Option 1: Using eksctl (Fastest)

```bash
# 1. Navigate to project
cd /home/mukulah/portfolio-app

# 2. Copy cluster configuration
cp archived-aws/cluster-config.yaml .

# 3. Create EKS cluster (takes 15-20 minutes)
eksctl create cluster -f cluster-config.yaml

# 4. Verify cluster
kubectl get nodes

# 5. Deploy application
kubectl apply -f archived-aws/k8s/base/namespace.yaml
kubectl apply -f archived-aws/k8s/production/

# 6. Wait for load balancer
kubectl get service -n portfolio-production --watch

# 7. Get your application URL
kubectl get ingress -n portfolio-production
```

**Total Time:** ~30 minutes  
**Cost Starts:** Immediately (~$18/day)

### Option 2: Using Terraform (Infrastructure as Code)

```bash
# 1. Navigate to terraform directory
cd /home/mukulah/portfolio-app/archived-aws/terraform

# 2. Initialize Terraform
terraform init

# 3. Review what will be created
terraform plan

# 4. Create infrastructure
terraform apply

# 5. Configure kubectl
aws eks update-kubeconfig --name nexusai-cluster --region eu-north-1

# 6. Deploy application
cd ../k8s
kubectl apply -f base/
kubectl apply -f production/
```

**Total Time:** ~25 minutes  
**Cost Starts:** Immediately (~$18/day)

---

## 📝 Manual Step-by-Step Setup

### Step 1: Create VPC

```bash
# Create VPC with public and private subnets
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=portfolio-vpc}]'

# Create subnets (you need at least 2 in different AZs)
# Public subnet 1
aws ec2 create-subnet --vpc-id <VPC_ID> --cidr-block 10.0.1.0/24 --availability-zone eu-north-1a

# Public subnet 2
aws ec2 create-subnet --vpc-id <VPC_ID> --cidr-block 10.0.2.0/24 --availability-zone eu-north-1b

# Private subnet 1
aws ec2 create-subnet --vpc-id <VPC_ID> --cidr-block 10.0.10.0/24 --availability-zone eu-north-1a

# Private subnet 2
aws ec2 create-subnet --vpc-id <VPC_ID> --cidr-block 10.0.11.0/24 --availability-zone eu-north-1b
```

### Step 2: Create EKS Cluster

```bash
# Create IAM role for EKS
aws iam create-role --role-name portfolio-eks-role \
  --assume-role-policy-document file://archived-aws/iam-policies/eks-cluster-role-trust-policy.json

# Attach required policies
aws iam attach-role-policy --role-name portfolio-eks-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

# Create EKS cluster
eksctl create cluster \
  --name nexusai-cluster \
  --region eu-north-1 \
  --nodegroup-name nexusai-nodes \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 10 \
  --managed

# Wait 15-20 minutes for cluster creation
```

### Step 3: Install Add-ons

```bash
# Install AWS Load Balancer Controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=nexusai-cluster \
  --set serviceAccount.create=true \
  --set serviceAccount.name=aws-load-balancer-controller

# Install metrics server for HPA
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### Step 4: Deploy Redis (Optional)

```bash
# Deploy Redis
kubectl apply -f archived-aws/k8s/production/redis.yaml

# Verify Redis is running
kubectl get pods -n portfolio-production | grep redis
```

### Step 5: Deploy Application

```bash
# 1. Build and push Docker image to ECR
cd /home/mukulah/portfolio-app

# Create ECR repository
aws ecr create-repository --repository-name portfolio-app --region eu-north-1

# Get ECR login
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com

# Build Docker image
docker build -t portfolio-app:latest -f archived-aws/docker/Dockerfile .

# Tag and push
docker tag portfolio-app:latest <ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com/portfolio-app:latest
docker push <ACCOUNT_ID>.dkr.ecr.eu-north-1.amazonaws.com/portfolio-app:latest

# 2. Update Kubernetes manifests with ECR image
# Edit archived-aws/k8s/production/deployment.yaml
# Change image: to your ECR URL

# 3. Create namespace
kubectl apply -f archived-aws/k8s/base/namespace.yaml

# 4. Create ConfigMap with environment variables
kubectl apply -f archived-aws/k8s/base/configmap.yaml

# 5. Deploy application
kubectl apply -f archived-aws/k8s/production/deployment.yaml
kubectl apply -f archived-aws/k8s/production/service.yaml
kubectl apply -f archived-aws/k8s/production/ingress.yaml
kubectl apply -f archived-aws/k8s/production/hpa.yaml

# 6. Wait for pods to be ready
kubectl get pods -n portfolio-production --watch

# 7. Get Load Balancer URL
kubectl get service -n portfolio-production
kubectl get ingress -n portfolio-production
```

### Step 6: Configure Domain

```bash
# Get Load Balancer DNS name
LB_DNS=$(kubectl get ingress -n portfolio-production -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}')

echo "Update your DNS:"
echo "Type: CNAME"
echo "Name: romeomukulah.org (or @)"
echo "Value: $LB_DNS"
```

---

## 💵 Cheaper AWS Alternatives

### Option 1: AWS Lightsail (Recommended)

**Cost:** $10-20/month

```bash
# Create Lightsail container service
aws lightsail create-container-service \
  --service-name portfolio-app \
  --power small \
  --scale 1

# Deploy container
aws lightsail push-container-image \
  --service-name portfolio-app \
  --label portfolio-app \
  --image portfolio-app:latest

# Much cheaper than EKS!
```

### Option 2: AWS App Runner

**Cost:** ~$25/month (pay per use)

```bash
# Create App Runner service (auto-builds from GitHub)
aws apprunner create-service \
  --service-name portfolio-app \
  --source-configuration '{
    "AuthenticationConfiguration": {
      "ConnectionArn": "arn:aws:apprunner:...:connection/..."
    },
    "AutoDeploymentsEnabled": true,
    "CodeRepository": {
      "RepositoryUrl": "https://github.com/Mucrypt/portfolio-app",
      "SourceCodeVersion": {
        "Type": "BRANCH",
        "Value": "main"
      }
    }
  }'

# Automatic scaling, no servers to manage
```

### Option 3: Single EC2 Instance with Docker

**Cost:** $8-15/month (t3.small or t3.medium)

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx

# SSH into instance
ssh -i your-key.pem ec2-user@<PUBLIC_IP>

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker

# Run your app
sudo docker run -d -p 80:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=xxx \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx \
  portfolio-app:latest

# Much simpler and cheaper!
```

### Option 4: AWS Fargate (Serverless Containers)

**Cost:** ~$30-50/month

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name portfolio-cluster

# Create task definition (container specs)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create Fargate service
aws ecs create-service \
  --cluster portfolio-cluster \
  --service-name portfolio-service \
  --task-definition portfolio-app:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"

# No servers to manage, pay only for what you use
```

---

## 🔄 Migration Path

### From Vercel Back to AWS

If you need to migrate back from Vercel to AWS:

```bash
# 1. Ensure your code works locally
cd /home/mukulah/portfolio-app
npm run build
npm start

# 2. Choose deployment method:
#    - EKS (expensive but scalable)
#    - Lightsail (cheap and simple)
#    - App Runner (serverless, auto-scaling)
#    - Single EC2 (cheapest, manual)

# 3. Deploy using one of the methods above

# 4. Update DNS to point to AWS
#    Change CNAME from Vercel to AWS Load Balancer

# 5. Wait for DNS propagation (5-30 minutes)

# 6. Verify deployment
curl https://romeomukulah.org/api/health
```

### Hybrid Approach (Best of Both Worlds)

Keep Vercel for production, use AWS for:

- Development/staging environments
- Learning Kubernetes/DevOps
- Specific features requiring AWS services
- Resume/portfolio demonstration

---

## 🚨 Important Notes

### Cost Management

1. **Set up billing alerts:**

```bash
aws budgets create-budget \
  --account-id <YOUR_ACCOUNT_ID> \
  --budget file://budget-config.json
```

2. **Check costs daily:**

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity DAILY \
  --metrics BlendedCost
```

3. **Stop cluster when not in use:**

```bash
# Scale down to 0 nodes (saves EC2 costs but keeps cluster)
eksctl scale nodegroup --cluster=nexusai-cluster --name=nexusai-nodes --nodes=0

# Delete cluster completely
eksctl delete cluster --name nexusai-cluster --region eu-north-1
```

### Security

- ✅ Always use IAM roles with minimal permissions
- ✅ Enable MFA on your AWS account
- ✅ Never commit AWS credentials to git
- ✅ Rotate access keys every 90 days
- ✅ Use AWS Secrets Manager for sensitive data
- ✅ Enable CloudTrail for audit logging

### Monitoring

```bash
# View cluster health
kubectl get nodes
kubectl top nodes
kubectl get pods --all-namespaces

# Check application logs
kubectl logs -n portfolio-production -l app=portfolio --tail=100 -f

# View resource usage
kubectl top pods -n portfolio-production
```

---

## 📚 Additional Resources

- **Original Terraform files:** `archived-aws/terraform/`
- **Kubernetes manifests:** `archived-aws/k8s/`
- **Docker configs:** `archived-aws/docker/`
- **Deployment scripts:** `archived-aws/*.sh`
- **Helm charts:** `archived-aws/helm/`

### Documentation

- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [eksctl Documentation](https://eksctl.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS Pricing Calculator](https://calculator.aws/)

### Cost Comparison Tools

- [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/)
- [AWS Pricing Calculator](https://calculator.aws/)
- [Infracost](https://www.infracost.io/) - Terraform cost estimation

---

## 🆘 Troubleshooting

### Cluster Creation Fails

```bash
# Check AWS service limits
aws service-quotas list-service-quotas --service-code eks

# Verify IAM permissions
aws iam get-role --role-name portfolio-eks-role

# Check CloudFormation stack events
aws cloudformation describe-stack-events --stack-name eksctl-nexusai-cluster-cluster
```

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <POD_NAME> -n portfolio-production

# Check logs
kubectl logs <POD_NAME> -n portfolio-production

# Check events
kubectl get events -n portfolio-production --sort-by='.lastTimestamp'
```

### High Costs

```bash
# Check what's costing money
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity DAILY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Consider cheaper alternatives above
```

---

## ⚖️ Decision Matrix

| Factor               | Vercel (Current) | AWS EKS    | AWS Lightsail | AWS App Runner |
| -------------------- | ---------------- | ---------- | ------------- | -------------- |
| **Cost/Month**       | $0               | $240-550   | $10-20        | $25-50         |
| **Setup Time**       | 5 min            | 30-60 min  | 10 min        | 15 min         |
| **Maintenance**      | Zero             | High       | Low           | Low            |
| **Scalability**      | Auto             | Manual/HPA | Limited       | Auto           |
| **Learning Value**   | Low              | High       | Medium        | Medium         |
| **Resume Value**     | Medium           | High       | Low           | Medium         |
| **Production Ready** | ✅ Yes           | ✅ Yes     | ✅ Yes        | ✅ Yes         |

**Recommendation:**

- **Production:** Stick with Vercel (free, zero maintenance)
- **Learning:** Use AWS Lightsail or single EC2 ($10-15/month)
- **Resume:** Set up EKS temporarily, document it, then delete

---

**Last Updated:** January 23, 2026  
**Original Deletion Date:** January 23, 2026  
**Restoration Instructions Valid:** Until AWS significantly changes EKS/Kubernetes APIs
