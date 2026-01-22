#!/bin/bash
# Monitor Terraform deployment progress

echo "🔍 Monitoring Terraform Deployment..."
echo ""

while true; do
  clear
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║           AWS Infrastructure Deployment Status             ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  
  # Check VPC
  echo "📡 VPC Status:"
  aws ec2 describe-vpcs --filters "Name=tag:Name,Values=portfolio-production-vpc" \
    --query 'Vpcs[0].[VpcId,State]' --output text 2>/dev/null || echo "  ⏳ Creating..."
  echo ""
  
  # Check EKS Cluster
  echo "☸️  EKS Cluster Status:"
  aws eks describe-cluster --name portfolio-production-cluster \
    --query 'cluster.[name,status]' --output text 2>/dev/null || echo "  ⏳ Creating..."
  echo ""
  
  # Check Node Group
  echo "🖥️  Node Group Status:"
  aws eks list-nodegroups --cluster-name portfolio-production-cluster \
    --query 'nodegroups[0]' --output text 2>/dev/null && \
  aws eks describe-nodegroup --cluster-name portfolio-production-cluster \
    --nodegroup-name $(aws eks list-nodegroups --cluster-name portfolio-production-cluster --query 'nodegroups[0]' --output text 2>/dev/null) \
    --query 'nodegroup.status' --output text 2>/dev/null || echo "  ⏳ Creating..."
  echo ""
  
  # Check NAT Gateways
  echo "🌐 NAT Gateways:"
  aws ec2 describe-nat-gateways --filter "Name=tag:Project,Values=portfolio" \
    --query 'NatGateways[*].[NatGatewayId,State]' --output table 2>/dev/null || echo "  ⏳ Creating..."
  echo ""
  
  echo "Press Ctrl+C to stop monitoring"
  echo "Last updated: $(date '+%Y-%m-%d %H:%M:%S')"
  
  sleep 30
done
