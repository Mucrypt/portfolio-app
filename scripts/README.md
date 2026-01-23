# Portfolio App Scripts

Essential deployment and development scripts for the portfolio application.

## 🚀 Production Deployment

### `deploy-to-production.sh`
**Main deployment script - Use this for all deployments!**

Handles the complete deployment pipeline:
- ✅ Code quality checks (ESLint + TypeScript)
- ✅ Git commit and push
- ✅ Direct Vercel deployment via CLI
- ✅ Deployment verification

**Usage:**
```bash
npm run deploy "your commit message"
# or
./scripts/deploy-to-production.sh "your commit message"
```

**Example:**
```bash
npm run deploy "feat: add new blog post feature"
```

---

## 📊 Code Quality

### `lint-summary.sh`
Generates a categorized ESLint report with:
- Error/warning counts
- Issue categories (TypeScript any, React Hooks, unused vars, etc.)
- Actionable recommendations

**Usage:**
```bash
npm run lint:summary
```

### `pre-deploy-check.sh`
Runs comprehensive pre-deployment validation:
- ESLint checks
- TypeScript type checking
- Build verification

**Usage:**
```bash
npm run check
```

---

## 🔍 Monitoring & Status

### `vercel-monitor.sh`
Monitor Vercel deployment status and get detailed information about recent deployments.

**Usage:**
```bash
./scripts/vercel-monitor.sh
```

### `status.sh`
Comprehensive git and project status:
- Git branch and commit info
- Uncommitted changes
- Remote sync status

**Usage:**
```bash
npm run status
```

### `logs.sh`
View application logs from Vercel.

**Usage:**
```bash
./scripts/logs.sh
```

---

## 🛠️ Development

### `dev.sh`
Start development server with enhanced logging.

**Usage:**
```bash
npm run dev
```

### `clean-build.sh`
Clean build artifacts and caches.

**Usage:**
```bash
npm run clean
```

### `health-check.sh`
Check application health and dependencies.

**Usage:**
```bash
./scripts/health-check.sh
```

---

## 🔄 Emergency Operations

### `vercel-rollback.sh`
Rollback to a previous deployment if something goes wrong.

**Usage:**
```bash
./scripts/vercel-rollback.sh
```

---

## 📝 Quick Reference

| Command | Description |
|---------|-------------|
| `npm run deploy "msg"` | Deploy to production |
| `npm run lint:summary` | ESLint summary report |
| `npm run check` | Pre-deployment checks |
| `npm run status` | Git & project status |
| `npm run dev` | Start development |
| `npm run clean` | Clean build artifacts |

---

## 💡 Best Practices

### Daily Workflow
```bash
# 1. Check status
npm run status

# 2. Make changes...

# 3. Deploy
npm run deploy "feat: your feature"
```

### Troubleshooting
```bash
# Clean and rebuild
npm run clean && npm run build

# Check deployment
./scripts/vercel-monitor.sh

# View logs
./scripts/logs.sh

# Rollback if needed
./scripts/vercel-rollback.sh
```

---

**Live Site**: https://romeomukulah.org
**Last Updated**: January 23, 2026
