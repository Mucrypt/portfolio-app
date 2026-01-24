#!/bin/bash
# Setup Terraform Backend Infrastructure
# Creates S3 bucket and DynamoDB table with enterprise security

set -e

ACCOUNT_ID="839868753466"
BUCKET_NAME="portfolio-terraform-state-${ACCOUNT_ID}"
TABLE_NAME="portfolio-terraform-locks"
REGION="us-east-1"

echo "🔧 Creating Terraform Backend Infrastructure..."
echo "   S3 Bucket: ${BUCKET_NAME}"
echo "   DynamoDB Table: ${TABLE_NAME}"
echo "   Region: ${REGION}"
echo ""

# Lifecycle policy with correct ID parameter
echo "🔐 Configuring lifecycle policy..."
aws s3api put-bucket-lifecycle-configuration \
  --bucket "${BUCKET_NAME}" \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 90
      },
      "Filter": {
        "Prefix": ""
      }
    }]
  }' \
  --no-cli-pager

echo "   ✓ Lifecycle policy configured"

# Create DynamoDB table
echo ""
echo "📊 Creating DynamoDB table for state locking..."

if aws dynamodb describe-table --table-name "${TABLE_NAME}" --region "${REGION}" --no-cli-pager &>/dev/null; then
  echo "   ℹ Table already exists"
else
  aws dynamodb create-table \
    --table-name "${TABLE_NAME}" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "${REGION}" \
    --tags Key=Project,Value=portfolio-app Key=ManagedBy,Value=terraform \
    --no-cli-pager > /dev/null
  
  echo "   ✓ Table created"
  echo "   ⏳ Waiting for table to be active..."
  aws dynamodb wait table-exists --table-name "${TABLE_NAME}" --region "${REGION}"
  echo "   ✓ Table is active"
fi

echo ""
echo "✅ Terraform backend infrastructure ready!"
echo ""
echo "Backend Configuration:"
echo "  Bucket: ${BUCKET_NAME}"
echo "  Table:  ${TABLE_NAME}"
echo "  Region: ${REGION}"
echo ""
