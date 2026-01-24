# 🔐 GitHub Actions Secrets Configuration

Complete guide for setting up GitHub repository secrets for CI/CD pipelines.

---

## 📋 Overview

This document lists all required secrets for the CI/CD pipelines and how to obtain them.

---

## 🔑 Required Secrets

### AWS Credentials (Required)

Navigate to: `Repository → Settings → Secrets and variables → Actions → New repository secret`

#### 1. `AWS_ACCESS_KEY_ID`
**Purpose:** AWS authentication for EKS deployment

**How to obtain:**
1. Log in to AWS Console
2. Go to IAM → Users → Your User
3. Go to "Security credentials" tab
4. Click "Create access key"
5. Select "Application running outside AWS"
6. Copy the Access Key ID

**Example:** `AKIAIOSFODNN7EXAMPLE`

---

#### 2. `AWS_SECRET_ACCESS_KEY`
**Purpose:** AWS authentication secret

**How to obtain:**
- Obtained together with Access Key ID (step above)
- **IMPORTANT:** Save this immediately, it's only shown once!

**Example:** `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

---

#### 3. `AWS_REGION`
**Purpose:** AWS region for EKS cluster

**Value:** `us-east-1` (or your preferred region)

**Available regions:**
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)

---

#### 4. `EKS_CLUSTER_NAME`
**Purpose:** Name of your EKS cluster

**Value:** `portfolio-cluster` (or your chosen name)

---

### Supabase - Staging (Required)

#### 5. `STAGING_SUPABASE_URL`
**Purpose:** Staging environment database URL

**How to obtain:**
1. Log in to [Supabase](https://supabase.com)
2. Select your staging project (or create one)
3. Go to Settings → API
4. Copy "Project URL"

**Example:** `https://abcdefghijklmnop.supabase.co`

---

#### 6. `STAGING_SUPABASE_ANON_KEY`
**Purpose:** Staging environment anonymous key

**How to obtain:**
1. Same location as above (Settings → API)
2. Copy "anon public" key

**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### Supabase - Production (Required)

#### 7. `PROD_SUPABASE_URL`
**Purpose:** Production environment database URL

**How to obtain:**
1. Create separate Supabase project for production
2. Go to Settings → API
3. Copy "Project URL"

**Example:** `https://zyxwvutsrqponmlk.supabase.co`

---

#### 8. `PROD_SUPABASE_ANON_KEY`
**Purpose:** Production environment anonymous key

**How to obtain:**
1. Same location as above (Settings → API)
2. Copy "anon public" key

**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### Security Scanning (Optional but Recommended)

#### 9. `SNYK_TOKEN`
**Purpose:** Vulnerability scanning with Snyk

**How to obtain:**
1. Create account at [Snyk.io](https://snyk.io)
2. Go to Account Settings
3. Copy "Auth Token"

**Example:** `12345678-1234-1234-1234-123456789abc`

**Note:** Free tier available for open-source projects

---

#### 10. `SONAR_TOKEN`
**Purpose:** Code quality analysis with SonarCloud

**How to obtain:**
1. Create account at [SonarCloud.io](https://sonarcloud.io)
2. Go to My Account → Security
3. Generate new token
4. Name it "GitHub Actions"

**Example:** `squ_1234567890abcdef1234567890abcdef12345678`

**Additional SonarCloud setup:**
1. Import your repository
2. Set organization key in `.github/workflows/security.yml`
3. Set project key: `Mucrypt_portfolio-app`

---

### Notifications (Optional)

#### 11. `SLACK_WEBHOOK`
**Purpose:** Deployment notifications to Slack

**How to obtain:**
1. Go to your Slack workspace
2. Create a Slack app or use existing one
3. Enable Incoming Webhooks
4. Create webhook for your channel
5. Copy webhook URL

**Example:** `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`

---

## 🚀 Quick Setup Guide

### Step 1: AWS Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

### Step 2: Supabase Setup

**Staging:**
1. Create project named "portfolio-staging"
2. Note the URL and anon key
3. Import your database schema
4. Configure RLS policies

**Production:**
1. Create project named "portfolio-production"
2. Note the URL and anon key
3. Import your database schema
4. Configure RLS policies
5. Enable point-in-time recovery

### Step 3: Add Secrets to GitHub

```bash
# Using GitHub CLI (optional)
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set AWS_REGION
gh secret set EKS_CLUSTER_NAME
gh secret set STAGING_SUPABASE_URL
gh secret set STAGING_SUPABASE_ANON_KEY
gh secret set PROD_SUPABASE_URL
gh secret set PROD_SUPABASE_ANON_KEY
```

**Or manually:**
1. Go to: `https://github.com/Mucrypt/portfolio-app/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret listed above

---

## ✅ Verification Checklist

Before deploying, verify all secrets are set:

```bash
# Check GitHub CLI
gh secret list

# Or check in GitHub UI
# Repository → Settings → Secrets and variables → Actions
```

### Required Secrets (Must Have):
- [ ] AWS_ACCESS_KEY_ID
- [ ] AWS_SECRET_ACCESS_KEY
- [ ] AWS_REGION
- [ ] EKS_CLUSTER_NAME
- [ ] STAGING_SUPABASE_URL
- [ ] STAGING_SUPABASE_ANON_KEY
- [ ] PROD_SUPABASE_URL
- [ ] PROD_SUPABASE_ANON_KEY

### Optional Secrets (Recommended):
- [ ] SNYK_TOKEN
- [ ] SONAR_TOKEN
- [ ] SLACK_WEBHOOK

---

## 🔒 Security Best Practices

### DO:
✅ Use separate Supabase projects for staging and production  
✅ Rotate AWS access keys every 90 days  
✅ Use minimal IAM permissions (least privilege)  
✅ Enable MFA on AWS account  
✅ Never commit secrets to git  
✅ Use GitHub environment secrets for production  
✅ Regularly scan for leaked secrets  

### DON'T:
❌ Share AWS credentials  
❌ Use root AWS account credentials  
❌ Commit `.env` files  
❌ Use same Supabase project for staging and production  
❌ Store secrets in code or documentation  
❌ Use personal access tokens with full permissions  

---

## 🔄 Rotating Secrets

### AWS Credentials

```bash
# Create new access key
aws iam create-access-key --user-name your-username

# Update GitHub secret
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY

# Delete old access key
aws iam delete-access-key --access-key-id OLD_KEY_ID --user-name your-username
```

### Supabase Keys

1. Go to Supabase project settings
2. Project API Settings → RLS
3. Generate new anon key (if needed)
4. Update GitHub secret
5. Invalidate old key

---

## 🆘 Troubleshooting

### "AWS credentials not configured"

**Solution:**
1. Verify secrets are set in GitHub
2. Check secret names match exactly (case-sensitive)
3. Ensure AWS user has proper permissions

### "Supabase connection failed"

**Solution:**
1. Verify Supabase URL is correct (no trailing slash)
2. Check anon key is valid
3. Ensure project is not paused
4. Verify IP is not blocked in Supabase settings

### "Secret scanning failed"

**Solution:**
1. Snyk token: Verify it's a valid organization token
2. SonarCloud: Ensure project is imported and token has analysis permissions

---

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Supabase Security](https://supabase.com/docs/guides/platform/going-into-prod)
- [Snyk Documentation](https://docs.snyk.io/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)

---

## 📞 Support

If you need help:
1. Check the [CICD.md](CICD.md) documentation
2. Review GitHub Actions workflow logs
3. Verify all secrets are correctly set
4. Check AWS CloudWatch logs

---

**Last Updated:** January 22, 2026  
**Maintained by:** Romeo Mukula
