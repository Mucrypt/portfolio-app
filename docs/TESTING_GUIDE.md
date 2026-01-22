# 🧪 Local Testing Guide

## Quick Start

Before deploying, **always** test locally first:

```bash
# Run comprehensive test suite
./scripts/test-local.sh

# If all tests pass, then deploy
./scripts/deploy.sh "feat: your feature description"
```

---

## What the Test Script Checks

### 1. **Dependencies** 📦
- Verifies node_modules installed
- Checks Redis client (ioredis) present
- Validates package.json

### 2. **Environment Variables** 🔐
- Checks for .env.local
- Validates Supabase configuration
- Ensures required secrets present

### 3. **Code Quality** 🎨
- Runs ESLint for code standards
- TypeScript type checking
- Catches errors before build

### 4. **Build Test** 🏗️
- Complete Next.js production build
- Verifies build succeeds
- Checks .next output directory

### 5. **Kubernetes Manifests** ☸️
- Validates deployment.yaml
- Validates redis.yaml
- Validates hpa.yaml
- Dry-run applies to check syntax

### 6. **Redis Module** 🔴
- Checks cache.ts exists
- Verifies exports (getCache, setCache)
- Validates CACHE_KEYS

### 7. **API Routes** 🛣️
- Health endpoint exists
- Cache stats endpoint exists
- Blog posts API exists
- All required routes present

### 8. **Docker Build** 🐳
- Tests Dockerfile builds successfully
- Checks image size
- Validates multi-stage build

### 9. **Local Server** 🚀
- Starts dev server
- Tests health endpoint responds
- Tests home page loads
- Verifies server functionality

### 10. **Git Status** 📝
- Checks for uncommitted changes
- Shows current branch
- Warns if dirty working tree

### 11. **Deployment Readiness** ✅
- GitHub CLI authenticated
- kubectl connected to cluster
- All tools available

---

## Test Output

### Successful Test:
```
╔═══════════════════════════════════════════════════════════╗
║                   TEST SUMMARY                            ║
╚═══════════════════════════════════════════════════════════╝

✅ Tests Passed:   25
⚠️  Warnings:      2
❌ Tests Failed:   0

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    🎉 ALL TESTS PASSED! READY TO DEPLOY                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

You can now safely run:
./scripts/deploy.sh "Your commit message"
```

### Failed Test:
```
╔═══════════════════════════════════════════════════════════╗
║                   TEST SUMMARY                            ║
╚═══════════════════════════════════════════════════════════╝

✅ Tests Passed:   20
⚠️  Warnings:      3
❌ Tests Failed:   2

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    ❌ TESTS FAILED - FIX ERRORS BEFORE DEPLOYING         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Please fix the errors above before deploying.
```

---

## Common Issues & Fixes

### Issue: ESLint Errors
**Fix:**
```bash
npm run lint --fix
```

### Issue: TypeScript Errors
**Fix:**
```bash
npx tsc --noEmit
# Fix reported type errors in your code
```

### Issue: Build Failed
**Fix:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Issue: Missing node_modules
**Fix:**
```bash
npm install
```

### Issue: Environment Variables Missing
**Fix:**
```bash
# Create .env.local
cp .env.example .env.local

# Add your variables
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Issue: Kubernetes Manifest Errors
**Fix:**
```bash
# Validate manually
kubectl apply --dry-run=client -f k8s/production/deployment.yaml
kubectl apply --dry-run=client -f k8s/production/redis.yaml
kubectl apply --dry-run=client -f k8s/production/hpa.yaml
```

### Issue: Docker Build Failed
**Fix:**
```bash
# Check Dockerfile syntax
docker build -f docker/Dockerfile -t test .

# View logs
cat /tmp/docker-build.txt
```

---

## Development Workflow

### Best Practice Workflow:

```bash
# 1. Make your changes
code app/page.tsx

# 2. Test locally first
npm run dev
# Visit http://localhost:3000

# 3. Run test suite
./scripts/test-local.sh

# 4. If tests pass, commit
git add .
git commit -m "feat: your feature"

# 5. Deploy with confidence
./scripts/deploy.sh "feat: your feature"
```

---

## Quick Commands

### Run Specific Tests:

```bash
# Just linting
npm run lint

# Just type check
npx tsc --noEmit

# Just build
npm run build

# Just Docker test
docker build -f docker/Dockerfile -t test .

# Just K8s validation
kubectl apply --dry-run=client -f k8s/production/
```

### Watch Mode (Development):

```bash
# Watch for changes and auto-rebuild
npm run dev

# Watch for type errors
npx tsc --noEmit --watch

# Watch for lint errors
npm run lint -- --watch
```

---

## CI/CD Integration

The test script simulates what GitHub Actions will do:

1. **Local Test** → `./scripts/test-local.sh`
2. **CI Runs** → GitHub Actions (same checks)
3. **Build Image** → Docker with build-args
4. **Deploy** → Kubernetes update

**Always pass local tests before pushing to avoid CI failures!**

---

## Skipping Tests (Not Recommended)

If you **must** skip tests (NOT RECOMMENDED):

```bash
# Skip local tests and deploy directly (DANGER!)
./scripts/deploy.sh "feat: feature" --no-test

# Or just push and let CI handle it (DANGER!)
git push origin main
```

**⚠️ Warning:** Skipping tests may result in:
- Failed CI builds
- Deployment errors
- Broken production app
- Wasted time debugging

---

## Performance Benchmarks

Expected test times:

- Dependencies: 1-2s
- Linting: 5-10s
- Type Checking: 10-15s
- Build: 30-60s
- Docker: 2-5min (first time), 30s (cached)
- K8s Validation: 1-2s
- Local Server: 10s
- **Total: ~2-7 minutes**

---

## Integration with Deploy Script

The test script and deploy script work together:

```bash
# Option 1: Test then deploy (RECOMMENDED)
./scripts/test-local.sh && ./scripts/deploy.sh "feat: feature"

# Option 2: Deploy script with auto-test (future)
./scripts/deploy.sh "feat: feature" --test

# Option 3: Test only (no deploy)
./scripts/test-local.sh
```

---

## Continuous Testing

### Pre-commit Hook (Optional):

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
echo "Running pre-commit tests..."
./scripts/test-local.sh

if [ $? -ne 0 ]; then
    echo "Tests failed! Commit aborted."
    exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

Now tests run automatically before every commit!

---

## Summary

✅ **Always test locally before deploying**
✅ **Fix all errors before pushing**
✅ **Use warnings as guidance for improvements**
✅ **Follow the development workflow**
✅ **Save time by catching errors early**

**Test locally → Deploy confidently → Sleep peacefully** 😴
