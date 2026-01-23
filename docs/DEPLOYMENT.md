# Deployment Guide

## Quick Deploy Script

Use the automated deployment script to deploy new features to production:

```bash
./scripts/deploy.sh "feat: add new feature description"
```

### What the script does:

1. **Commits your changes** - Automatically commits all changes with your message
2. **Pushes to GitHub** - Pushes to your current branch
3. **Waits for CI** - Monitors the GitHub Actions workflow until build completes
4. **Deploys to Kubernetes** - Automatically updates the production deployment with the new image
5. **Verifies deployment** - Waits for rollout to complete and shows status

### Usage Examples:

```bash
# Deploy a new feature
./scripts/deploy.sh "feat: add dark mode toggle"

# Deploy a bug fix
./scripts/deploy.sh "fix: resolve navigation issue"

# Deploy UI improvements
./scripts/deploy.sh "style: update homepage design"
```

### Requirements:

- All environment variables must be configured in GitHub Secrets
- AWS EKS cluster must be configured and accessible via kubectl
- GitHub CLI (`gh`) must be installed and authenticated

### Process Flow:

```
Code Changes → Commit → Push → GitHub Actions CI → Docker Build → 
Push to Registry → Update Kubernetes → Rollout → Live! 🚀
```

### Troubleshooting:

If deployment fails:

1. **Check CI logs**: `gh run view <RUN_ID> --log`
2. **Check pod status**: `kubectl get pods -n portfolio-production`
3. **Check pod logs**: `kubectl logs <POD_NAME> -n portfolio-production`
4. **Rollback if needed**: `kubectl rollout undo deployment/portfolio-app -n portfolio-production`

### Manual Deployment Steps:

If you prefer manual control:

```bash
# 1. Commit and push
git add .
git commit -m "Your message"
git push origin feature/infra-clean

# 2. Wait for CI to complete
gh run list --limit 1

# 3. Deploy manually
kubectl set image deployment/portfolio-app \
  placeholder=ghcr.io/mucrypt/portfolio-app:<COMMIT_SHA> \
  -n portfolio-production

# 4. Watch rollout
kubectl rollout status deployment/portfolio-app -n portfolio-production
```

## CI/CD Pipeline

### GitHub Actions Workflows:

- **CI Workflow** (`.github/workflows/ci.yml`) - Builds, tests, and pushes Docker images
- **CD Production** (`.github/workflows/cd-production.yml`) - Deploys to production
- **CD Staging** (`.github/workflows/cd-staging.yml`) - Deploys to staging

### Environment Variables:

Required GitHub Secrets:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_SITE_URL` - Your domain (https://romeomukulah.org)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (us-east-1)
- `EKS_CLUSTER_NAME` - EKS cluster name

## Infrastructure

### AWS EKS Cluster:
- Cluster: `portfolio-production-cluster`
- Region: `us-east-1`
- Nodes: 3x t3.medium across 3 availability zones

### Kubernetes Resources:
- Namespace: `portfolio-production`
- Deployment: `portfolio-app`
- Service: `portfolio-service`
- Secrets: `app-secrets`, `ghcr-secret`

### Domain:
- Production: https://romeomukulah.org
- Staging: https://staging.romeomukulah.org

## Monitoring

### Check Application Status:

```bash
# Pod status
kubectl get pods -n portfolio-production

# View logs
kubectl logs -f deployment/portfolio-app -n portfolio-production

# Check service
kubectl get svc -n portfolio-production

# Check ingress
kubectl get ingress -n portfolio-production
```

### Health Checks:

- Health endpoint: https://romeomukulah.org/api/health
- Homepage: https://romeomukulah.org

Enjoy automated deployments! 🚀
