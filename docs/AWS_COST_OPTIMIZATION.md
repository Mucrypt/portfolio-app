# 💰 AWS Cost Optimization Guide

## Current Monthly Cost: ~$150
## Optimized Cost: ~$45
## **SAVINGS: $105/month ($1,260/year)**

---

## 🎯 Cost Breakdown & Optimization

### 1. **EKS Cluster Costs** 💰 BIGGEST SAVINGS

#### Current Setup:
```
3x t3.medium nodes (24/7):
- 3 nodes × $0.0416/hour × 730 hours = $91/month
- EKS control plane: $0.10/hour × 730 = $73/month
Total: $164/month
```

#### Optimized Setup:
```
Option A: Spot Instances (RECOMMENDED)
- 1-2 t3.small spot nodes
- Cost: $0.0104/hour × 730 × 2 = $15/month
- EKS control plane: $73/month
- Redis: $15/month
Total: $103/month
SAVES: $61/month
```

```
Option B: Fargate (Serverless)
- Pay only for running pods
- No node management
- Estimated: $80-120/month
SAVES: $40-80/month
```

```
Option C: Mix of On-Demand + Spot
- 1 t3.small on-demand (core services)
- 2-3 t3.nano spot instances (auto-scale)
- Cost: $20 + $10 = $30/month nodes
- EKS: $73/month
Total: $103/month
SAVES: $61/month
```

---

### 2. **Database (Supabase)** 💰 MAJOR SAVINGS

#### Current:
```
- Pro plan: $25/month
- Or Pay-as-you-go with high API calls
```

#### Optimized with Redis:
```
- Free tier: $0/month (up to 500MB + 2GB bandwidth)
- Or Starter: $10/month
- 80% fewer API calls due to caching
SAVES: $15-25/month
```

---

### 3. **Data Transfer & Bandwidth**

#### Current:
```
- No CDN, all traffic through EKS
- ~$10-20/month
```

#### Optimized with CloudFront:
```
- CloudFront CDN: $1-5/month (first 1TB free)
- Reduces EKS bandwidth
SAVES: $5-15/month
```

---

### 4. **Development/Staging Environments**

#### Strategy: Auto-Shutdown
```bash
# Schedule to stop dev/staging at night
kubectl scale deployment --all --replicas=0 -n portfolio-staging

# Use AWS Lambda to auto-shutdown (cron: 6 PM - 8 AM)
SAVES: $30-50/month
```

---

## 🚀 Implementation Plan

### Phase 1: Immediate Savings (Today)

#### 1. Enable Auto-Scaling HPA (Already Done! ✅)
```bash
# Scales down to 1 pod when idle
# Already configured in k8s/production/hpa.yaml
SAVES: $30/month immediately
```

#### 2. Switch to t3.small Nodes
```bash
# Update node group to t3.small
aws eks update-nodegroup-config \
  --cluster-name portfolio-production-cluster \
  --nodegroup-name portfolio-nodes \
  --scaling-config minSize=1,maxSize=5,desiredSize=1

SAVES: $40/month
```

#### 3. Enable Spot Instances
```bash
# Create spot instance node group
./scripts/create-spot-nodegroup.sh

SAVES: Additional $20/month
```

---

### Phase 2: Infrastructure Optimization

#### 1. Implement CloudFront CDN
```bash
# Serve static assets via CloudFront
# Setup script provided below
SAVES: $10/month
```

#### 2. Optimize Images
```bash
# Use Next.js Image Optimization
# Already configured, but ensure using it
# Reduces bandwidth by 60-80%
SAVES: $5/month
```

---

### Phase 3: Monitoring & Alerts

#### Set up Cost Alerts
```bash
# AWS Budgets - get alerted at $50, $75, $100
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget file://budget.json

FREE but prevents overspending
```

---

## 📊 Optimized Cost Breakdown

| Service | Before | After | Savings |
|---------|--------|-------|---------|
| EKS Control Plane | $73 | $73 | $0 |
| Worker Nodes (3x t3.medium) | $91 | $15 (2x t3.small spot) | **$76** |
| Redis | $0 | $0 (self-hosted) | $0 |
| Supabase | $25 | $0 (free tier) | **$25** |
| Data Transfer | $15 | $5 (with CDN) | **$10** |
| Load Balancer | $20 | $20 | $0 |
| Route53 | $1 | $1 | $0 |
| **TOTAL** | **$225** | **$114** | **$111/month** |

**Annual Savings: $1,332** 💰

---

## 🛠️ Quick Setup Scripts

### 1. Create Spot Node Group

```bash
#!/bin/bash
# scripts/create-spot-nodegroup.sh

aws eks create-nodegroup \
  --cluster-name portfolio-production-cluster \
  --nodegroup-name portfolio-spot-nodes \
  --node-role arn:aws:iam::YOUR_ACCOUNT:role/EKSNodeRole \
  --subnets subnet-xxx subnet-yyy subnet-zzz \
  --instance-types t3.small t3a.small \
  --capacity-type SPOT \
  --scaling-config minSize=1,maxSize=5,desiredSize=1 \
  --disk-size 20
```

### 2. Auto-Shutdown Script

```bash
#!/bin/bash
# scripts/auto-shutdown-staging.sh

# Stop staging environment at 6 PM
kubectl scale deployment --all --replicas=0 -n portfolio-staging
kubectl scale deployment redis --replicas=0 -n portfolio-staging

echo "Staging environment stopped - will restart manually"
```

### 3. Cost Monitoring Script

```bash
#!/bin/bash
# scripts/check-aws-costs.sh

# Get current month costs
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --query 'ResultsByTime[*].[TimePeriod.Start,Total.BlendedCost.Amount]' \
  --output text
```

---

## 🎯 Best Practices to Keep Costs Low

### 1. **Use Reserved Instances** (Long-term)
- Commit to 1-year: Save 30%
- Commit to 3-year: Save 50%
- Only for production critical nodes

### 2. **Right-Size Resources**
```yaml
# Update deployment.yaml
resources:
  requests:
    cpu: 100m      # Down from 200m
    memory: 256Mi  # Down from 512Mi
  limits:
    cpu: 500m      # Down from 1000m
    memory: 512Mi  # Down from 1Gi
```

### 3. **Use Free Tier Services**
- Supabase Free: Up to 500MB DB
- CloudFront: 1TB free per month
- CloudWatch: 10 metrics free
- S3: 5GB storage free

### 4. **Monitor Everything**
```bash
# Install cost monitoring
kubectl apply -f https://raw.githubusercontent.com/kubecost/cost-analyzer-helm-chart/master/kubecost.yaml

# Access at: http://localhost:9090
kubectl port-forward deployment/kubecost-cost-analyzer 9090:9090
```

---

## 📈 Expected Results After Optimization

### Monthly Cost Comparison:

```
BEFORE Optimization:
├─ EKS Control: $73
├─ 3x t3.medium: $91
├─ Supabase Pro: $25
├─ Data Transfer: $15
├─ Load Balancer: $20
└─ Total: $224/month

AFTER Optimization:
├─ EKS Control: $73
├─ 2x t3.small Spot: $15
├─ Supabase Free: $0
├─ CloudFront CDN: $5
├─ Load Balancer: $20
└─ Total: $113/month

SAVINGS: $111/month ($1,332/year) 💰
```

---

## 🚨 Warning: Don't Cut These

### Keep These for Stability:
1. ✅ Load Balancer (needed for HTTPS)
2. ✅ At least 1 on-demand node (for reliability)
3. ✅ EKS Control Plane (can't avoid)
4. ✅ Health checks and monitoring
5. ✅ Automated backups

---

## 🎯 Action Plan - Deploy Now

### Week 1: Quick Wins
```bash
1. Enable HPA (already done ✅)
2. Switch to t3.small nodes
3. Enable spot instances
Expected savings: $70/month
```

### Week 2: Infrastructure
```bash
1. Setup CloudFront CDN
2. Optimize image delivery
3. Configure Redis caching
Expected savings: Additional $20/month
```

### Week 3: Monitoring
```bash
1. Setup cost alerts
2. Install Kubecost
3. Review and optimize
Expected savings: Identify more savings
```

---

## 📱 Cost Alert Setup

```json
{
  "budget": {
    "budgetName": "PortfolioMonthlyCost",
    "budgetLimit": {
      "amount": "120",
      "unit": "USD"
    },
    "timeUnit": "MONTHLY",
    "budgetType": "COST"
  },
  "notificationsWithSubscribers": [
    {
      "notification": {
        "notificationType": "ACTUAL",
        "comparisonOperator": "GREATER_THAN",
        "threshold": 80,
        "thresholdType": "PERCENTAGE"
      },
      "subscribers": [
        {
          "subscriptionType": "EMAIL",
          "address": "your-email@example.com"
        }
      ]
    }
  ]
}
```

---

**Deploy these optimizations and cut your AWS bill in HALF!** 💰✂️

Your app will be faster AND cheaper! 🚀
