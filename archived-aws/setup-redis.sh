#!/bin/bash
set -e

echo "🚀 Setting up Redis, Monitoring & Auto-scaling"
echo "=============================================="

# Deploy Redis
echo ""
echo "📦 Deploying Redis cache..."
kubectl apply -f k8s/production/redis.yaml
echo "✅ Redis deployed"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
kubectl wait --for=condition=ready pod -l app=redis -n portfolio-production --timeout=120s
echo "✅ Redis is ready"

# Update HPA
echo ""
echo "📈 Configuring auto-scaling (HPA)..."
kubectl apply -f k8s/production/hpa.yaml
echo "✅ Auto-scaling configured (1-10 pods based on CPU/memory)"

# Update deployment with Redis config
echo ""
echo "🔄 Updating deployment with Redis configuration..."
kubectl apply -f k8s/production/deployment.yaml
echo "✅ Deployment updated"

# Check status
echo ""
echo "=============================================="
echo "📊 Deployment Status:"
echo "=============================================="

echo ""
echo "Redis Status:"
kubectl get pods -n portfolio-production -l app=redis

echo ""
echo "Application Pods:"
kubectl get pods -n portfolio-production -l app=portfolio

echo ""
echo "HPA Status:"
kubectl get hpa -n portfolio-production

echo ""
echo "=============================================="
echo "✅ Setup Complete!"
echo "=============================================="

echo ""
echo "📝 Next steps:"
echo "1. Test Redis connection: curl https://romeomukulah.org/api/cache/stats"
echo "2. Monitor HPA: kubectl get hpa -n portfolio-production -w"
echo "3. View Redis logs: kubectl logs -f deployment/redis -n portfolio-production"
echo "4. View app logs: kubectl logs -f deployment/portfolio-app -n portfolio-production"

echo ""
echo "💡 Redis is now caching:"
echo "   - Blog posts (5 min TTL)"
echo "   - Services (10 min TTL)"
echo "   - Categories (10 min TTL)"
echo "   - Page data (10 min TTL)"

echo ""
echo "📈 Expected improvements:"
echo "   ⚡ 70-90% faster page loads"
echo "   💰 80% reduction in Supabase API calls"
echo "   📊 Auto-scaling: 1-10 pods based on load"
echo "   💵 Cost savings when traffic is low"
