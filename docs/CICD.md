# 🚀 CI/CD & Kubernetes Deployment Guide

Complete guide for deploying the Portfolio Application to AWS EKS with GitHub Actions CI/CD pipelines.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub Actions Setup](#github-actions-setup)
4. [AWS EKS Setup](#aws-eks-setup)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Helm Charts](#helm-charts)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Actions                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   CI     │  │ Security │  │ Staging  │  │   Prod   │   │
│  │  Build   │  │  Scan    │  │  Deploy  │  │  Deploy  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
└───────┼─────────────┼──────────────┼─────────────┼──────────┘
        │             │              │             │
        ▼             ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Container Registry (GHCR)                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                       AWS EKS Cluster                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Ingress Controller                 │  │
│  │              (Nginx + cert-manager)                   │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────┼─────────────────────────────────┐  │
│  │                    ▼                                  │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │        Production Namespace                  │    │  │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │  │
│  │  │  │  Pod 1  │ │  Pod 2  │ │  Pod 3  │       │    │  │
│  │  │  └─────────┘ └─────────┘ └─────────┘       │    │  │
│  │  │  HPA: 3-10 replicas based on load          │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │        Staging Namespace                     │    │  │
│  │  │  ┌─────────┐ ┌─────────┐                    │    │  │
│  │  │  │  Pod 1  │ │  Pod 2  │                    │    │  │
│  │  │  └─────────┘ └─────────┘                    │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase (External)                         │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Flow

1. **Push to Branch** → Triggers CI pipeline
2. **CI Pipeline** → Lint, test, build, scan security
3. **Build Docker Image** → Push to GHCR
4. **Staging Deploy** → Auto-deploy to staging (develop branch)
5. **Production Deploy** → Manual approval, deploy to prod (tags)

---

## 🔧 Prerequisites

### Local Tools
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify installations
aws --version
eksctl version
kubectl version --client
helm version
```

### AWS Requirements
- AWS Account with appropriate permissions
- IAM user with EKS, EC2, VPC permissions
- AWS Access Key ID and Secret Access Key
- Hosted Zone in Route 53 (optional, for automatic DNS)

### Domain Setup
- Domain: **romeomukulah.org** (configured in Hostinger)
- DNS records will point to AWS Load Balancer

---

## 🔐 GitHub Actions Setup

### 1. Configure GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

#### Required Secrets:

**AWS Credentials:**
```
AWS_ACCESS_KEY_ID         # Your AWS access key
AWS_SECRET_ACCESS_KEY     # Your AWS secret key
AWS_REGION                # e.g., us-east-1
EKS_CLUSTER_NAME          # e.g., portfolio-cluster
```

**Supabase - Staging:**
```
STAGING_SUPABASE_URL      # Staging Supabase project URL
STAGING_SUPABASE_ANON_KEY # Staging Supabase anon key
```

**Supabase - Production:**
```
PROD_SUPABASE_URL         # Production Supabase project URL
PROD_SUPABASE_ANON_KEY    # Production Supabase anon key
```

**Security Scanning (Optional but Recommended):**
```
SNYK_TOKEN                # Snyk API token for vulnerability scanning
SONAR_TOKEN               # SonarCloud token for code quality
```

**Notifications (Optional):**
```
SLACK_WEBHOOK             # Slack webhook for deployment notifications
```

### 2. Workflow Files

The following workflows are configured:

#### **.github/workflows/ci.yml**
- Triggers: Push to any branch, Pull requests
- Jobs:
  - Lint code
  - Security scanning
  - Build application
  - Build & push Docker image
  - Vulnerability scanning

#### **.github/workflows/cd-staging.yml**
- Triggers: Push to `develop` branch
- Jobs:
  - Deploy to staging environment
  - Run smoke tests
  - Post deployment summary

#### **.github/workflows/cd-production.yml**
- Triggers: Push tags matching `v*.*.*`
- Jobs:
  - Pre-deployment validation
  - Deploy to production with approval
  - Comprehensive smoke tests
  - Post-deployment monitoring

#### **.github/workflows/security.yml**
- Triggers: Daily at 2 AM UTC, push to main
- Jobs:
  - Dependency scanning
  - Container image scanning
  - Code quality analysis
  - Secret scanning

### 3. Creating a Release

To deploy to production:

```bash
# Tag your release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# This triggers the production deployment workflow
# Approve the deployment in GitHub Actions UI
```

---

## ☸️ AWS EKS Setup

### Automated Setup

Use the automated setup script:

```bash
# Make script executable
chmod +x scripts/setup-eks.sh

# Run setup (will take 15-20 minutes)
./scripts/setup-eks.sh
```

This script will:
- ✅ Create EKS cluster with managed node group
- ✅ Install AWS Load Balancer Controller
- ✅ Install Nginx Ingress Controller
- ✅ Install cert-manager for SSL certificates
- ✅ Create namespaces for staging and production
- ✅ Install metrics server for HPA

### Manual Setup

If you prefer manual setup:

#### 1. Create EKS Cluster

```bash
eksctl create cluster \
  --name portfolio-cluster \
  --region us-east-1 \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 10 \
  --managed \
  --with-oidc
```

#### 2. Update kubeconfig

```bash
aws eks update-kubeconfig --region us-east-1 --name portfolio-cluster
```

#### 3. Install Nginx Ingress Controller

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

#### 4. Install cert-manager

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

#### 5. Create Namespaces

```bash
kubectl apply -f k8s/base/namespace.yaml
```

#### 6. Get Load Balancer URL

```bash
kubectl get svc ingress-nginx-controller -n ingress-nginx
```

Copy the EXTERNAL-IP (Load Balancer DNS name).

---

## 🌐 DNS Configuration

### Configure Domain in Hostinger

1. Log in to Hostinger
2. Go to Domain → DNS Zone Editor for **romeomukulah.org**
3. Add/Update these records:

```
Type    Name                        Value                           TTL
A       @                          <Load-Balancer-IP>              3600
A       www                        <Load-Balancer-IP>              3600
A       staging                    <Load-Balancer-IP>              3600
CNAME   @                          <Load-Balancer-DNS>             3600
```

**Note:** If using CNAME, get the Load Balancer DNS name from:
```bash
kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

Wait 5-10 minutes for DNS propagation.

### Verify DNS

```bash
# Check DNS resolution
nslookup romeomukulah.org
nslookup www.romeomukulah.org
nslookup staging.romeomukulah.org
```

---

## 📦 Kubernetes Deployment

### Using Helm (Recommended)

#### Deploy to Staging

```bash
# Run deployment script
chmod +x scripts/k8s-deploy.sh
./scripts/k8s-deploy.sh
# Select: 1 (Staging)

# Or manually
helm install portfolio-staging ./helm/portfolio \
  --namespace portfolio-staging \
  --values helm/portfolio/values-staging.yaml \
  --set image.tag=develop
```

#### Deploy to Production

```bash
# Run deployment script
./scripts/k8s-deploy.sh
# Select: 2 (Production)

# Or manually
helm install portfolio-production ./helm/portfolio \
  --namespace portfolio-production \
  --values helm/portfolio/values-production.yaml \
  --set image.tag=latest
```

### Using kubectl (Alternative)

#### Deploy to Production

```bash
# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=NEXT_PUBLIC_SUPABASE_URL="your-url" \
  --from-literal=NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key" \
  --namespace=portfolio-production

# Create Docker registry secret
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=your-github-username \
  --docker-password=your-github-token \
  --namespace=portfolio-production

# Apply manifests
kubectl apply -f k8s/production/
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n portfolio-production

# Check services
kubectl get svc -n portfolio-production

# Check ingress
kubectl get ingress -n portfolio-production

# Check SSL certificates
kubectl get certificate -n portfolio-production

# View logs
kubectl logs -f -l app.kubernetes.io/name=portfolio -n portfolio-production
```

---

## 📊 Helm Charts

### Chart Structure

```
helm/portfolio/
├── Chart.yaml                  # Chart metadata
├── values.yaml                 # Default values
├── values-staging.yaml         # Staging overrides
├── values-production.yaml      # Production overrides
└── templates/
    ├── _helpers.tpl           # Template helpers
    ├── deployment.yaml        # Deployment manifest
    ├── service.yaml           # Service manifest
    ├── ingress.yaml           # Ingress manifest
    ├── hpa.yaml               # Horizontal Pod Autoscaler
    ├── pdb.yaml               # Pod Disruption Budget
    ├── configmap.yaml         # ConfigMap
    ├── serviceaccount.yaml    # Service Account
    └── networkpolicy.yaml     # Network Policy
```

### Customizing Deployment

Edit `helm/portfolio/values-production.yaml`:

```yaml
# Change replica count
replicaCount: 5

# Change resource limits
resources:
  limits:
    cpu: 2000m
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 1Gi

# Adjust autoscaling
autoscaling:
  minReplicas: 5
  maxReplicas: 20
  targetCPUUtilizationPercentage: 60
```

### Helm Commands

```bash
# Install
helm install portfolio-production ./helm/portfolio \
  --namespace portfolio-production \
  -f helm/portfolio/values-production.yaml

# Upgrade
helm upgrade portfolio-production ./helm/portfolio \
  --namespace portfolio-production \
  -f helm/portfolio/values-production.yaml

# Rollback
helm rollback portfolio-production \
  --namespace portfolio-production

# Uninstall
helm uninstall portfolio-production \
  --namespace portfolio-production

# List releases
helm list --all-namespaces

# Get values
helm get values portfolio-production -n portfolio-production

# View manifest
helm get manifest portfolio-production -n portfolio-production
```

---

## 📈 Monitoring & Maintenance

### View Application Logs

```bash
# All pods
kubectl logs -f -l app.kubernetes.io/name=portfolio -n portfolio-production

# Specific pod
kubectl logs -f <pod-name> -n portfolio-production

# Previous pod logs
kubectl logs --previous <pod-name> -n portfolio-production
```

### Check Resource Usage

```bash
# Node resources
kubectl top nodes

# Pod resources
kubectl top pods -n portfolio-production

# HPA status
kubectl get hpa -n portfolio-production
```

### Scale Application

```bash
# Manual scaling
kubectl scale deployment portfolio-production \
  --replicas=5 \
  -n portfolio-production

# HPA is enabled by default and will auto-scale
```

### Update Application

```bash
# Update image tag
helm upgrade portfolio-production ./helm/portfolio \
  --namespace portfolio-production \
  -f helm/portfolio/values-production.yaml \
  --set image.tag=v1.1.0 \
  --wait

# Or use GitHub Actions by pushing a new tag
git tag v1.1.0
git push origin v1.1.0
```

### Rollback Deployment

```bash
# Rollback to previous version
helm rollback portfolio-production -n portfolio-production

# Rollback to specific revision
helm rollback portfolio-production 3 -n portfolio-production

# View rollout history
kubectl rollout history deployment/portfolio-production -n portfolio-production
```

---

## 🔍 Troubleshooting

### Pods Not Starting

```bash
# Describe pod
kubectl describe pod <pod-name> -n portfolio-production

# Common issues:
# - ImagePullBackOff: Check image registry secret
# - CrashLoopBackOff: Check application logs
# - Pending: Check node resources
```

**Solutions:**
```bash
# Recreate registry secret
kubectl delete secret ghcr-secret -n portfolio-production
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_TOKEN \
  --namespace=portfolio-production

# Check logs
kubectl logs <pod-name> -n portfolio-production
```

### SSL Certificate Issues

```bash
# Check certificate status
kubectl describe certificate romeomukulah-cert -n portfolio-production

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Check if domain resolves
nslookup romeomukulah.org

# Force certificate renewal
kubectl delete certificate romeomukulah-cert -n portfolio-production
kubectl apply -f k8s/production/certificate.yaml
```

### Ingress Not Working

```bash
# Check ingress
kubectl get ingress -n portfolio-production
kubectl describe ingress portfolio-ingress -n portfolio-production

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# Test locally
kubectl port-forward svc/portfolio-production 3000:80 -n portfolio-production
curl http://localhost:3000
```

### High Memory/CPU Usage

```bash
# Check resource usage
kubectl top pods -n portfolio-production

# Check HPA
kubectl get hpa -n portfolio-production

# Increase resources
# Edit helm/portfolio/values-production.yaml
resources:
  limits:
    cpu: 2000m
    memory: 2Gi

# Apply changes
helm upgrade portfolio-production ./helm/portfolio \
  --namespace portfolio-production \
  -f helm/portfolio/values-production.yaml
```

### Database Connection Issues

```bash
# Check secrets
kubectl get secret app-secrets -n portfolio-production -o yaml

# Verify Supabase URL
kubectl exec -it <pod-name> -n portfolio-production -- env | grep SUPABASE

# Test from pod
kubectl exec -it <pod-name> -n portfolio-production -- sh
# Inside pod:
curl -v $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

---

## 🔒 Security Best Practices

### Implemented Security Features

✅ **Container Security:**
- Non-root user (UID 1001)
- Read-only root filesystem where possible
- Dropped all capabilities
- Security context policies

✅ **Network Security:**
- Network policies restricting pod-to-pod communication
- TLS/SSL encryption (cert-manager + Let's Encrypt)
- Ingress rate limiting
- Pod-to-pod encryption (service mesh ready)

✅ **Access Control:**
- RBAC for service accounts
- Pod Security Policies
- Secret management via Kubernetes secrets
- Image pull secrets for private registry

✅ **Monitoring & Auditing:**
- Security scanning in CI/CD (Trivy, Snyk)
- Code quality analysis (SonarCloud)
- Dependency vulnerability scanning
- Secret scanning (TruffleHog, GitLeaks)

### Additional Recommendations

1. **Enable Pod Security Standards:**
```bash
kubectl label namespace portfolio-production \
  pod-security.kubernetes.io/enforce=restricted
```

2. **Regular Security Scans:**
- Run security workflow manually: `Actions → Security Scanning → Run workflow`
- Review scan results weekly

3. **Rotate Secrets:**
```bash
# Update Supabase credentials
kubectl create secret generic app-secrets \
  --from-literal=NEXT_PUBLIC_SUPABASE_URL="new-url" \
  --from-literal=NEXT_PUBLIC_SUPABASE_ANON_KEY="new-key" \
  --namespace=portfolio-production \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart pods
kubectl rollout restart deployment/portfolio-production -n portfolio-production
```

---

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [AWS EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager Documentation](https://cert-manager.io/docs/)

---

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `kubectl logs -n portfolio-production`
2. Describe resources: `kubectl describe pod -n portfolio-production`
3. Review GitHub Actions workflow runs
4. Check AWS CloudWatch for EKS logs
5. Verify DNS configuration in Hostinger

---

**Made with ❤️ by Romeo Mukula**
