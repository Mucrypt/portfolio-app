# Vercel Infrastructure

Professional Vercel deployment setup with CI/CD, monitoring, and best practices.

## 🚀 Quick Start

### Initial Setup

```bash
# 1. Login to Vercel
vercel login

# 2. Link project
vercel link

# 3. Set up environment variables
./scripts/vercel-env.sh setup

# 4. Deploy to production
./scripts/vercel-deploy.sh production
```

## 📁 Project Structure

```
portfolio-app/
├── .github/workflows/
│   ├── vercel-production.yml    # Production deployment CI/CD
│   └── vercel-preview.yml       # PR preview deployments
├── scripts/
│   ├── vercel-deploy.sh         # Deployment script
│   ├── vercel-env.sh            # Environment management
│   └── vercel-monitor.sh        # Monitoring & health checks
└── vercel.json                  # Vercel configuration
```

## 🔧 Scripts

### Deployment Script

```bash
# Deploy to production
./scripts/vercel-deploy.sh production

# Deploy to preview
./scripts/vercel-deploy.sh preview

# Deploy without tests
./scripts/vercel-deploy.sh production true
```

### Environment Management

```bash
# Set up all environment variables
./scripts/vercel-env.sh setup

# List environment variables
./scripts/vercel-env.sh list

# Pull environment variables locally
./scripts/vercel-env.sh pull production

# Remove an environment variable
./scripts/vercel-env.sh remove VARIABLE_NAME production
```

### Monitoring

```bash
# View full monitoring dashboard
./scripts/vercel-monitor.sh dashboard

# Check production health
./scripts/vercel-monitor.sh health

# View deployment status
./scripts/vercel-monitor.sh status

# Stream live logs
./scripts/vercel-monitor.sh logs

# Run performance tests
./scripts/vercel-monitor.sh performance

# Check DNS configuration
./scripts/vercel-monitor.sh dns

# View analytics
./scripts/vercel-monitor.sh analytics
```

## 🔄 CI/CD Workflows

### Production Deployment (`vercel-production.yml`)

**Trigger:** Push to `main` branch

**Steps:**

1. ✅ Run tests (lint, type check, build)
2. 🔒 Security scan with Snyk
3. 🚀 Deploy to Vercel production
4. ⏳ Wait for deployment
5. 🏥 Run health checks
6. ✅ Verify Google Analytics

### Preview Deployment (`vercel-preview.yml`)

**Trigger:** Pull requests to `main` or `develop`

**Steps:**

1. ✅ Run tests
2. 🚀 Deploy preview
3. 💬 Comment PR with preview URL
4. 🏥 Run health checks

## 📝 Environment Variables

### Required Variables

| Variable                        | Description            | Example                    |
| ------------------------------- | ---------------------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL   | `https://xxx.supabase.co`  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...`                   |
| `NEXT_PUBLIC_SITE_URL`          | Production URL         | `https://romeomukulah.org` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID    | `G-3BZZ8D5TED`             |
| `REDIS_ENABLED`                 | Enable Redis caching   | `false`                    |

### GitHub Secrets

Add these secrets to your GitHub repository:

- `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - Found in Vercel project settings
- `VERCEL_PROJECT_ID` - Found in Vercel project settings
- `SNYK_TOKEN` - (Optional) For security scanning

## 🌐 Domains

### Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `romeomukulah.org`
3. Update DNS records:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (5-10 minutes)

### Preview Domains

Every PR gets an automatic preview deployment:

- `https://portfolio-app-git-[branch]-[user].vercel.app`

## 📊 Monitoring

### Health Checks

- Production: `https://romeomukulah.org/api/health`
- Preview: `https://[deployment-url]/api/health`

### Performance Monitoring

```bash
# Run comprehensive performance tests
./scripts/vercel-monitor.sh performance

# Check response times for all endpoints
./scripts/vercel-monitor.sh dashboard
```

### Live Logs

```bash
# Stream deployment logs
./scripts/vercel-monitor.sh logs

# Or use Vercel CLI
vercel logs --follow
```

## 🔒 Security

### Headers

Configured in `vercel.json`:

- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Security Scanning

- Automated Snyk security scan on every deployment
- Dependency vulnerability checks
- Code analysis

## 💰 Cost Comparison

| Service          | AWS EKS    | Vercel Free | Vercel Pro |
| ---------------- | ---------- | ----------- | ---------- |
| **Monthly Cost** | $548.88 ❌ | $0 ✅       | $20 💚     |
| **Bandwidth**    | Limited    | 100GB       | 1TB        |
| **Build Time**   | Unlimited  | 6000 min    | Unlimited  |
| **Deployments**  | Manual     | Unlimited   | Unlimited  |
| **SSL**          | Manual     | Automatic   | Automatic  |
| **CDN**          | Extra cost | Global      | Global     |
| **Maintenance**  | High       | Zero        | Zero       |

## 🎯 Best Practices

### 1. Branch Strategy

- `main` → Production deployments
- `develop` → Development (no auto-deploy)
- Feature branches → Preview deployments

### 2. Deployment Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 4. Create PR
# → Automatic preview deployment

# 5. Merge to main
# → Automatic production deployment
```

### 3. Testing Before Deploy

```bash
# Always test build before deploying
npm run build
npm start

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

### 4. Environment Variables

- Never commit `.env` files
- Use Vercel dashboard or `vercel-env.sh` to manage
- Different values for production/preview/development

### 5. Monitoring

- Check health after every deployment
- Monitor response times
- Review logs for errors
- Set up alerts (Vercel Pro)

## 🚨 Troubleshooting

### Build Failures

```bash
# Check build locally
npm run build

# View detailed logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls
```

### Health Check Failures

```bash
# Test health endpoint
curl https://romeomukulah.org/api/health

# Check full dashboard
./scripts/vercel-monitor.sh dashboard
```

### Domain Issues

```bash
# Check DNS
./scripts/vercel-monitor.sh dns

# Verify CNAME
dig romeomukulah.org CNAME
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Actions with Vercel](https://vercel.com/docs/deployments/git)

## 🎉 Features

✅ **Zero Cost** - Free tier for unlimited bandwidth
✅ **Automatic Deployments** - Push to deploy
✅ **Preview Deployments** - Every PR gets a preview
✅ **Global CDN** - Lightning-fast worldwide
✅ **Automatic SSL** - HTTPS out of the box
✅ **Zero Maintenance** - No servers to manage
✅ **Built-in Analytics** - Web vitals and metrics
✅ **Instant Rollbacks** - One-click rollback
✅ **Edge Functions** - API routes at the edge
✅ **Monitoring** - Health checks and logs

## 🔄 Migration from AWS EKS

### What Changed

- ❌ Removed: EKS cluster, EC2 nodes, Load balancers
- ❌ Removed: Kubernetes manifests, Helm charts
- ❌ Removed: Docker configurations
- ❌ Removed: Redis (can be added with Vercel KV)
- ✅ Added: Vercel workflows
- ✅ Added: Vercel deployment scripts
- ✅ Added: Monitoring dashboard

### What Stayed the Same

- ✅ Next.js application code
- ✅ Supabase database
- ✅ Google Analytics integration
- ✅ Admin dashboard
- ✅ All features and functionality

### Cost Savings

**Before:** $548.88/month on AWS EKS
**After:** $0/month on Vercel Free tier
**Savings:** $6,586.56/year 💰

---

**Questions?** Check the monitoring dashboard:

```bash
./scripts/vercel-monitor.sh dashboard
```
