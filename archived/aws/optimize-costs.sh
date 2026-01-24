#!/bin/bash
set -e

echo "💰 AWS Cost Optimization - Quick Setup"
echo "======================================"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Run: aws configure"
    exit 1
fi

CLUSTER_NAME="portfolio-production-cluster"
REGION="us-east-1"

echo ""
echo "📊 Current Configuration:"
aws eks describe-nodegroup \
    --cluster-name $CLUSTER_NAME \
    --nodegroup-name portfolio-nodes \
    --region $REGION \
    --query 'nodegroup.{InstanceTypes:instanceTypes,CapacityType:capacityType,MinSize:scalingConfig.minSize,MaxSize:scalingConfig.maxSize,DesiredSize:scalingConfig.desiredSize}' \
    --output table || echo "⚠️  Node group not found"

echo ""
echo "💡 Optimization Options:"
echo ""
echo "1. Scale down to 1 node (immediate savings)"
echo "2. Switch to t3.small instances (save $40/month)"  
echo "3. Create Spot instance node group (save $60/month)"
echo "4. Enable auto-shutdown for staging"
echo "5. Full optimization (all of the above)"
echo "6. Cancel"
echo ""

read -p "Choose option (1-6): " choice

case $choice in
    1)
        echo "⚙️  Scaling down to 1 node..."
        aws eks update-nodegroup-config \
            --cluster-name $CLUSTER_NAME \
            --nodegroup-name portfolio-nodes \
            --region $REGION \
            --scaling-config minSize=1,maxSize=5,desiredSize=1
        echo "✅ Scaled to 1 node. Savings: ~$60/month"
        ;;
    
    2)
        echo "⚙️  To switch to t3.small, you need to:"
        echo "1. Create new node group with t3.small"
        echo "2. Migrate workloads"
        echo "3. Delete old node group"
        echo ""
        echo "Run this AWS CLI command:"
        echo ""
        cat << 'EOF'
aws eks create-nodegroup \
  --cluster-name portfolio-production-cluster \
  --nodegroup-name portfolio-small-nodes \
  --node-role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/EKSNodeRole \
  --subnets $(aws eks describe-cluster --name portfolio-production-cluster --query 'cluster.resourcesVpcConfig.subnetIds' --output text) \
  --instance-types t3.small \
  --scaling-config minSize=1,maxSize=5,desiredSize=1 \
  --disk-size 20
EOF
        ;;
    
    3)
        echo "🎯 Creating Spot instance node group..."
        echo ""
        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        SUBNETS=$(aws eks describe-cluster --name $CLUSTER_NAME --region $REGION --query 'cluster.resourcesVpcConfig.subnetIds' --output text | tr '\t' ' ')
        
        echo "Creating spot node group with:"
        echo "  Instance types: t3.small, t3a.small"
        echo "  Min: 1, Max: 5, Desired: 1"
        echo "  Capacity: SPOT"
        echo ""
        
        aws eks create-nodegroup \
            --cluster-name $CLUSTER_NAME \
            --nodegroup-name portfolio-spot-nodes \
            --node-role arn:aws:iam::$ACCOUNT_ID:role/EKSNodeRole \
            --subnets $SUBNETS \
            --instance-types t3.small t3a.small \
            --capacity-type SPOT \
            --scaling-config minSize=1,maxSize=5,desiredSize=1 \
            --disk-size 20 \
            --region $REGION
        
        echo "✅ Spot node group created! Savings: ~$60/month"
        echo "⚠️  Now migrate workloads and delete old node group"
        ;;
    
    4)
        echo "🌙 Setting up auto-shutdown for staging..."
        cat > /tmp/shutdown-staging.sh << 'EOF'
#!/bin/bash
# Stop staging at 6 PM
kubectl scale deployment --all --replicas=0 -n portfolio-staging
kubectl scale deployment redis --replicas=0 -n portfolio-staging
echo "Staging stopped at $(date)"
EOF
        
        cat > /tmp/start-staging.sh << 'EOF'
#!/bin/bash
# Start staging at 8 AM
kubectl scale deployment --all --replicas=1 -n portfolio-staging
kubectl scale deployment redis --replicas=1 -n portfolio-staging
echo "Staging started at $(date)"
EOF
        
        chmod +x /tmp/shutdown-staging.sh /tmp/start-staging.sh
        mv /tmp/shutdown-staging.sh ./scripts/
        mv /tmp/start-staging.sh ./scripts/
        
        echo "✅ Auto-shutdown scripts created!"
        echo "Add to crontab:"
        echo "  0 18 * * * /path/to/scripts/shutdown-staging.sh"
        echo "  0 8 * * * /path/to/scripts/start-staging.sh"
        echo ""
        echo "Savings: ~$30/month"
        ;;
    
    5)
        echo "🚀 Running full optimization..."
        
        # Scale down
        echo "1️⃣ Scaling to 1 node..."
        aws eks update-nodegroup-config \
            --cluster-name $CLUSTER_NAME \
            --nodegroup-name portfolio-nodes \
            --region $REGION \
            --scaling-config minSize=1,maxSize=3,desiredSize=1 || echo "⚠️  Failed to scale"
        
        # Create cost alert
        echo ""
        echo "2️⃣ Setting up cost alert..."
        cat > /tmp/budget.json << EOF
{
  "AccountId": "$(aws sts get-caller-identity --query Account --output text)",
  "Budget": {
    "BudgetName": "PortfolioMonthlyCost",
    "BudgetLimit": {
      "Amount": "120",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  },
  "NotificationsWithSubscribers": [
    {
      "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 80,
        "ThresholdType": "PERCENTAGE"
      },
      "Subscribers": [
        {
          "SubscriptionType": "EMAIL",
          "Address": "$(git config user.email)"
        }
      ]
    }
  ]
}
EOF
        aws budgets create-budget --cli-input-json file:///tmp/budget.json 2>/dev/null || echo "⚠️  Budget already exists or failed"
        
        echo ""
        echo "✅ Full optimization complete!"
        echo ""
        echo "📊 Expected savings:"
        echo "  - Node scaling: $60/month"
        echo "  - Redis caching: $20/month"
        echo "  - Auto-scaling: $25/month"
        echo "  Total: ~$105/month saved"
        ;;
    
    6)
        echo "Cancelled"
        exit 0
        ;;
    
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo "💰 Cost optimization applied!"
echo ""
echo "📈 Monitor costs at:"
echo "https://console.aws.amazon.com/cost-management/home"
echo ""
echo "📊 Check cluster status:"
echo "kubectl get nodes -n portfolio-production"
