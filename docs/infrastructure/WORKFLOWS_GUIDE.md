# 🚀 Enterprise GitHub Actions Workflows Guide

## Overview

Your portfolio app uses **enterprise-grade CI/CD workflows** specifically designed for the **Next.js + Vercel + Supabase** stack. These workflows are production-ready and require minimal configuration.

## 📋 Workflows Summary

### 1. **CI - Build and Test** (`ci.yml`)

**Triggers:** Push to `main`, `develop`, `feature/*` branches  
**Purpose:** Validate code quality and ensure builds succeed  
**Duration:** ~2-4 minutes

**Jobs:**

- ✅ **Code Quality Check** - ESLint + TypeScript validation
- ✅ **Security Scan** - npm audit for vulnerabilities
- ✅ **Build Application** - Full Next.js build test
- ✅ **CI Summary** - Consolidated results

**When it runs:**

- Every push to main/develop
- Every pull request
- Manual trigger via workflow_dispatch

---

### 2. **Security Scanning** (`security.yml`)

**Triggers:** Daily at 2 AM UTC, Push to `main`, Manual  
**Purpose:** Monitor dependencies and code for security issues  
**Duration:** ~1-2 minutes

**Jobs:**

- 🔒 **Dependency Security Scan** - npm audit with detailed reporting
- 🔍 **Environment Security Check** - Scan for exposed secrets in code
- 📊 **Security Summary** - Generate comprehensive security report

**Best Practices:**

- Runs automatically daily to catch new vulnerabilities
- Non-blocking (won't fail deployments)
- Generates artifacts for audit trails

---

### 3. **Vercel Production Deployment** (`vercel-production.yml`)

**Triggers:** Push to `main`  
**Purpose:** Deploy to production with health checks  
**Duration:** ~3-5 minutes

**Jobs:**

- 🧪 **Run Tests** - Pre-deployment validation
- 🔐 **Security Scan** - Quick security check
- 🚀 **Deploy to Production** - Deploy to Vercel with health checks

**Deployment Methods:**

1. **Vercel Integration** (Recommended) - Automatic, no token needed
2. **GitHub Actions** - Manual control with VERCEL_TOKEN

**Health Checks:**

- Waits 45s for deployment to stabilize
- Retries 5 times with 10s intervals
- Checks `/api/health` endpoint
- Graceful failure with warnings

---

### 4. **Vercel Preview Deployment** (`vercel-preview.yml`)

**Triggers:** Pull requests to `main`/`develop`  
**Purpose:** Preview changes before merging  
**Duration:** ~3-5 minutes

**Jobs:**

- 🧪 **Run Tests** - Build validation
- 🚀 **Deploy Preview** - Create preview deployment
- 💬 **Comment PR** - Auto-comment with preview URL

**Features:**

- Automatic preview for every PR
- Comments PR with preview URL
- Full build testing before merge

---

### 5. **Release** (`release.yml`)

**Triggers:** Version tags (`v*.*.*`)  
**Purpose:** Create GitHub releases with changelogs  
**Duration:** ~1 minute

**Features:**

- Auto-generates release notes
- Semantic versioning support
- Changelog from commit messages

---

## 🔧 Configuration

### Required Secrets

| Secret                          | Required    | Purpose                                                            |
| ------------------------------- | ----------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅ Yes      | Supabase project URL                                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes      | Supabase anonymous key                                             |
| `VERCEL_TOKEN`                  | ⚠️ Optional | GitHub Actions deployment (not needed if using Vercel integration) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ❌ No       | Google Analytics (optional)                                        |

### How to Add Secrets

1. Go to **GitHub** → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret from the table above

**Get Supabase Credentials:**

```bash
# Go to Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Get Vercel Token (Optional):**

```bash
# Go to Vercel → Settings → Tokens → Create Token
VERCEL_TOKEN=your_vercel_token
```

---

## 📊 Workflow Status

### Check Status

```bash
# View all workflow runs
https://github.com/Mucrypt/portfolio-app/actions

# Monitor current deployment
npm run status

# Or use script directly
./scripts/vercel-monitor.sh
```

### Common Status Messages

| Status         | Meaning             | Action Required                   |
| -------------- | ------------------- | --------------------------------- |
| ✅ Success     | All checks passed   | None - deploy successful          |
| ⚠️ Warning     | Non-critical issues | Review warnings, but OK to deploy |
| ❌ Failure     | Critical errors     | Fix issues before deploying       |
| 🔄 In Progress | Running             | Wait for completion               |

---

## 🎯 Deployment Flow

### Production Deployment

```
Push to main
    ↓
CI Workflow (Build + Test)
    ↓
Security Scan (npm audit)
    ↓
Vercel Deployment
    ↓
Health Check (5 retries)
    ↓
Live on https://romeomukulah.org
```

### Using Deploy Script

```bash
# Recommended: Use the deploy script
npm run deploy "your commit message"

# Or directly
./scripts/deploy-full.sh "feat: add new feature"
```

**What it does:**

1. Checks for uncommitted changes
2. Runs ESLint (non-blocking)
3. Runs TypeScript check
4. Commits changes
5. Pushes to GitHub
6. Triggers all workflows automatically

---

## 🚨 Troubleshooting

### Workflow Fails: "VERCEL_TOKEN not found"

**Solution:** This is NOT an error! The workflow is designed to work with Vercel's GitHub integration.

```
ℹ️  VERCEL_TOKEN not configured - Skipping GitHub Actions deployment
✅ Vercel will auto-deploy from GitHub integration
```

**To use GitHub Actions deployment (optional):**

1. Go to Vercel → Settings → Tokens
2. Create token
3. Add as `VERCEL_TOKEN` secret in GitHub

### Workflow Fails: "Build failed"

**Check:**

1. Run build locally: `npm run build`
2. Check TypeScript errors: `npm run type-check`
3. Fix ESLint errors: `npm run lint`

### Health Check Fails

**Normal:** First deployment may take longer to propagate DNS
**Check:**

- Wait 2-3 minutes
- Visit https://romeomukulah.org/api/health
- Check Vercel dashboard for deployment status

---

## 🏗️ Architecture

### Tech Stack Integration

```
Next.js 16 (App Router)
    ↓
Supabase (Auth + Database)
    ↓
Vercel (Hosting + Edge Functions)
    ↓
GitHub Actions (CI/CD)
```

### Workflow Design Principles

1. **Non-Blocking Checks** - Warnings don't stop deployments
2. **Graceful Degradation** - Missing tokens handled gracefully
3. **Fast Feedback** - Most workflows complete in 2-4 minutes
4. **Security First** - Daily security scans, secret detection
5. **Cost Efficient** - Optimized for GitHub Actions free tier

### GitHub Actions Free Tier

- ✅ **2,000 minutes/month** for private repos
- ✅ **Unlimited** for public repos
- Your workflows use ~10-15 minutes per deployment
- **Estimated:** ~100-150 deployments/month within free tier

---

## 📈 Performance Metrics

### Average Workflow Times

- CI Build: 2-4 minutes
- Security Scan: 1-2 minutes
- Production Deploy: 3-5 minutes
- Preview Deploy: 3-5 minutes
- Total (full deployment): ~10-15 minutes

### Optimization Features

- ✅ npm cache enabled
- ✅ Parallel job execution
- ✅ Incremental builds
- ✅ Artifact caching (30 days)

---

## 🔄 Continuous Improvement

### Future Enhancements (Optional)

**Add E2E Testing:**

```yaml
- name: Run Playwright tests
  run: npm run test:e2e
```

**Add Lighthouse CI:**

```yaml
- name: Lighthouse performance audit
  uses: treosh/lighthouse-ci-action@v10
```

**Add Sentry Release Tracking:**

```yaml
- name: Create Sentry release
  run: npx @sentry/cli releases new ${{ github.sha }}
```

---

## 📚 Learn More

### Workflow Files

- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/security.yml` - Security scanning
- `.github/workflows/vercel-production.yml` - Production deploys
- `.github/workflows/vercel-preview.yml` - Preview deploys
- `.github/workflows/release.yml` - Release automation

### Scripts

- `scripts/deploy-full.sh` - Full deployment workflow
- `scripts/vercel-monitor.sh` - Monitor deployments
- `scripts/status.sh` - Check git/deployment status
- `scripts/lint-summary.sh` - ESLint summary report

### Documentation

- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/CICD.md` - CI/CD details
- `docs/GITHUB_SECRETS.md` - Secret management

---

## 💡 Pro Tips

1. **Use the deploy script:** `npm run deploy "message"` - handles everything
2. **Monitor deployments:** `npm run status` - real-time status
3. **Check logs:** `./scripts/logs.sh` - view application logs
4. **Test locally first:** `npm run build` - catch issues early
5. **Small commits:** Easier to debug if something fails
6. **Meaningful messages:** Makes commit history useful

---

## 🆘 Support

**Issues with workflows?**

1. Check GitHub Actions tab for error details
2. Review workflow logs
3. Test locally: `npm run build && npm run type-check`
4. Check Vercel dashboard for deployment status

**Common Commands:**

```bash
# Check deployment status
npm run status

# View recent logs
./scripts/logs.sh

# Test build locally
npm run build

# Check for errors
npm run check

# Clean and rebuild
npm run clean && npm run build
```

---

**Last Updated:** January 2026  
**Workflow Version:** v2.0 (Enterprise Edition)  
**Optimized for:** Next.js 16 + Vercel + Supabase
