# 📦 Helm Chart - Portfolio Application

This Helm chart deploys the Portfolio Application to Kubernetes with production-grade configuration.

## Quick Start

```bash
# Install for production
helm install portfolio-production ./helm/portfolio \
  --namespace portfolio-production \
  --values helm/portfolio/values-production.yaml

# Install for staging
helm install portfolio-staging ./helm/portfolio \
  --namespace portfolio-staging \
  --values helm/portfolio/values-staging.yaml
```

## Configuration

### Required Values

Create secrets before deployment:

```bash
kubectl create secret generic app-secrets \
  --from-literal=NEXT_PUBLIC_SUPABASE_URL="your-url" \
  --from-literal=NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key" \
  --namespace=<namespace>

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<username> \
  --docker-password=<token> \
  --namespace=<namespace>
```

### Customization

Override values using custom values file or `--set`:

```bash
helm install portfolio ./helm/portfolio \
  --set image.tag=v1.0.0 \
  --set replicaCount=5 \
  --set resources.limits.memory=2Gi
```

## Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `3` |
| `image.repository` | Image repository | `ghcr.io/mucrypt/portfolio-app` |
| `image.tag` | Image tag | `latest` |
| `resources.limits.cpu` | CPU limit | `1000m` |
| `resources.limits.memory` | Memory limit | `1Gi` |
| `autoscaling.enabled` | Enable HPA | `true` |
| `autoscaling.minReplicas` | Minimum replicas | `3` |
| `autoscaling.maxReplicas` | Maximum replicas | `10` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.host` | Primary hostname | `romeomukulah.org` |

See [values.yaml](values.yaml) for full list of parameters.

## Upgrading

```bash
helm upgrade portfolio-production ./helm/portfolio \
  --namespace portfolio-production \
  --values helm/portfolio/values-production.yaml
```

## Rollback

```bash
helm rollback portfolio-production --namespace portfolio-production
```

## Uninstalling

```bash
helm uninstall portfolio-production --namespace portfolio-production
```
