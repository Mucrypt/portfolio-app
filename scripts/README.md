# 🚀 Deployment Scripts Guide

Complete guide to all deployment and development scripts for **romeomukulah.org** portfolio application.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [One-Command Deployment](#one-command-deployment)
- [Development Scripts](#development-scripts)
- [Deployment Scripts](#deployment-scripts)
- [Monitoring Scripts](#monitoring-scripts)
- [Utility Scripts](#utility-scripts)
- [Best Practices](#best-practices)

---

## 🏃 Quick Start

### Make Scripts Executable

```bash
npm run make-executable
# or
chmod +x scripts/*.sh
```

### Check Project Status

```bash
npm run status
```

---

## 🎯 One-Command Deployment

### **Deploy Everything** (Recommended)

Pushes to GitHub and optionally merges to main for auto-deployment:

```bash
npm run deploy "feat: Add new feature"
# or
./scripts/deploy-full.sh "feat: Add new feature"
```

**What it does:**

1. ✅ Runs ESLint
2. ✅ Runs TypeScript check
3. ✅ Builds the project
4. ✅ Commits changes
5. ✅ Pushes to current branch
6. ✅ **Asks if you want to merge to main**
7. ✅ Vercel auto-deploys from main

**Perfect for:** Production-ready features

---

## 🛠️ Development Scripts

### Quick Push (Feature Branch Only)

Fast commit and push without merging to main:

```bash
npm run quick-push "fix: Update styles"
# or
./scripts/quick-push.sh "fix: Update styles"
```

**Use when:** Working on features that aren't ready for production

---

### Create Feature Branch

Start a new feature with best practices:

```bash
npm run new-feature my-awesome-feature
# or
./scripts/create-feature-branch.sh my-awesome-feature
```

**Creates:** `feature/my-awesome-feature` branch from latest main

---

### Sync Branch with Main

Update your feature branch with latest main changes:

```bash
npm run sync
# or
./scripts/sync-branch.sh
```

**What it does:**

1. Stashes uncommitted changes
2. Fetches latest from origin
3. Pulls main
4. Rebases your branch on main
5. Restores stashed changes

---

## 🚀 Deployment Scripts

### Pre-Deployment Check

Run all checks before deploying:

```bash
npm run check
# or
./scripts/pre-deploy-check.sh
```

**Checks:**

- ✅ Node modules installed
- ✅ Environment variables
- ✅ Git status
- ✅ ESLint
- ✅ TypeScript
- ✅ Build test
- ✅ Package.json scripts

---

### Clean Build

Remove all build artifacts and rebuild:

```bash
npm run clean
# or
./scripts/clean-build.sh
```

**Removes:**

- `.next/` directory
- `node_modules/.cache`
- `out/` directory
- `.turbo` cache

**Optional:** Reinstall node_modules

---

## 📊 Monitoring Scripts

### Vercel Deployment Monitor

Check deployment status:

```bash
./scripts/vercel-monitor.sh
```

**Shows:**

- Current deployment status
- Recent deployments
- Production URL

---

### Health Check

Test application health:

```bash
./scripts/health-check.sh
```

**Checks:**

- API health endpoint
- Database connection
- Response time
- Status codes

---

### View Logs

Stream application logs:

```bash
./scripts/logs.sh
```

**Options:**

- Production logs
- Development logs
- Error logs only

---

## 🔧 Utility Scripts

### Project Status

Comprehensive project overview:

```bash
npm run status
# or
./scripts/status.sh
```

**Shows:**

- Git information
- Dependencies
- Build status
- Deployment info
- Database status
- Monitoring services
- Disk usage

---

### Database Backup

Backup Supabase data:

```bash
./scripts/db-backup.sh
```

**Backups:**

- All database tables
- Saved to `./backups/YYYY-MM-DD/`

---

### Vercel DNS Monitor

Check DNS configuration:

```bash
./scripts/vercel-dns-monitor.sh
```

**Monitors:**

- DNS propagation
- SSL certificate
- Domain health

---

### Vercel Rollback

Rollback to previous deployment:

```bash
./scripts/vercel-rollback.sh
```

**Use when:** Production issues need immediate rollback

---

## 📝 Best Practices

### Development Workflow

```bash
# 1. Create feature branch
npm run new-feature awesome-dashboard

# 2. Make changes...
# 3. Quick push while developing
npm run quick-push "wip: Working on dashboard"

# 4. Sync with main if needed
npm run sync

# 5. Run checks before final deployment
npm run check

# 6. Deploy to production
npm run deploy "feat: Add awesome dashboard"
```

---

### Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Testing
- `chore:` Maintenance

**Examples:**

```bash
npm run deploy "feat: Add user authentication"
npm run deploy "fix: Resolve login bug"
npm run deploy "docs: Update API documentation"
npm run deploy "perf: Optimize image loading"
```

---

### Branch Naming Convention

- **Features:** `feature/feature-name`
- **Bug fixes:** `fix/bug-description`
- **Hotfixes:** `hotfix/critical-issue`

**Examples:**

```bash
npm run new-feature user-dashboard
npm run new-feature blog-comments
npm run new-feature payment-integration
```

---

### Safe Deployment Checklist

Before deploying to production:

- [ ] Run `npm run check` - All checks pass
- [ ] Test locally with `npm run dev`
- [ ] Build successfully with `npm run build`
- [ ] Review changes with `git status`
- [ ] Write clear commit message
- [ ] Deploy with `npm run deploy "message"`
- [ ] Monitor deployment in Vercel dashboard
- [ ] Check live site: https://romeomukulah.org
- [ ] Verify admin dashboard: https://romeomukulah.org/admin

---

## 🎓 Common Scenarios

### Scenario 1: Quick Feature Addition

```bash
# Create feature branch
npm run new-feature quick-button

# Make changes, test locally
npm run dev

# Quick commit during development
npm run quick-push "wip: Adding button"

# More changes...
npm run quick-push "wip: Button styling"

# Final deployment
npm run deploy "feat: Add quick action button"
# Choose 'Y' to merge to main
```

---

### Scenario 2: Bug Fix in Production

```bash
# Create fix branch from main
npm run new-feature fix-login-error

# Make fix, test thoroughly
npm run dev

# Run checks
npm run check

# Deploy immediately
npm run deploy "fix: Resolve login timeout issue"
# Choose 'Y' to merge to main
```

---

### Scenario 3: Working on Large Feature

```bash
# Create feature branch
npm run new-feature admin-redesign

# Multiple quick pushes during development
npm run quick-push "wip: New layout"
npm run quick-push "wip: Add components"
npm run quick-push "wip: Styling updates"

# Sync with main periodically
npm run sync

# When feature is complete
npm run check
npm run deploy "feat: Complete admin dashboard redesign"
```

---

## 🔐 Environment Variables

Required for deployment:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Sentry
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-3BZZ8D5TED

# Redis (optional)
REDIS_URL=your-redis-url
REDIS_ENABLED=false
```

---

## 📞 Troubleshooting

### Build Fails

```bash
# Clean build and reinstall
npm run clean
npm install
npm run build
```

### Git Conflicts

```bash
# Sync with main
npm run sync
# Resolve conflicts manually
git add .
git rebase --continue
```

### Deployment Stuck

```bash
# Check Vercel dashboard
# Or rollback
./scripts/vercel-rollback.sh
```

### Scripts Not Executable

```bash
npm run make-executable
```

---

## 🌐 Useful Links

- **Live Site:** https://romeomukulah.org
- **Admin Dashboard:** https://romeomukulah.org/admin
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/Mucrypt/portfolio-app
- **Supabase:** https://supabase.com/dashboard
- **Sentry:** https://sentry.io/organizations/mukulah
- **UptimeRobot:** https://dashboard.uptimerobot.com

---

## 💡 Tips

1. **Always run checks before deploying:** `npm run check`
2. **Use quick-push during development:** Don't merge every small change
3. **Sync regularly:** Keep your branch updated with main
4. **Write clear commit messages:** Follow conventional commits
5. **Test locally first:** Run `npm run dev` and verify
6. **Monitor deployments:** Check Vercel dashboard after deployment
7. **Keep backups:** Run `./scripts/db-backup.sh` periodically

---

## 📊 Script Summary

| Command               | Description           | Use Case                  |
| --------------------- | --------------------- | ------------------------- |
| `npm run deploy`      | **Full deployment**   | Production-ready features |
| `npm run quick-push`  | Quick commit & push   | Development iterations    |
| `npm run check`       | Pre-deployment checks | Before production deploy  |
| `npm run status`      | Project overview      | General status check      |
| `npm run sync`        | Sync with main        | Update feature branch     |
| `npm run clean`       | Clean build           | Fix build issues          |
| `npm run new-feature` | Create feature branch | Start new feature         |

---

## 🎉 Success!

You now have a streamlined deployment workflow! Deploy with confidence using:

```bash
npm run deploy "your awesome commit message"
```

Happy coding! 🚀
