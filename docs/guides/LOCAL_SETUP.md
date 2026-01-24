# 🚀 Quick Start - Running Locally

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Redis is OPTIONAL for local development
REDIS_ENABLED=false
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Redis for Local Development (Optional)

Redis caching is **optional** for local development. The app works fine without it.

### Option 1: Disable Redis (Default)

In `.env.local`:
```bash
REDIS_ENABLED=false
```

### Option 2: Run Redis with Docker

If you want to test with caching locally:

```bash
# Start Redis
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Enable Redis in .env.local
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
```

To stop Redis:
```bash
docker stop redis
docker rm redis
```

---

## Common Issues

### Redis Connection Errors

If you see:
```
❌ Redis connection error: ENOTFOUND localhost
```

**Solution:** Either disable Redis or start it with Docker:
```bash
# Option 1: Disable Redis
echo "REDIS_ENABLED=false" >> .env.local

# Option 2: Start Redis
docker run -d -p 6379:6379 redis:7-alpine
```

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Supabase Connection Issues

Make sure:
1. Your Supabase project is active
2. `.env.local` has correct URL and anon key
3. You're using the **public anon key**, not the service key

---

## Development Workflow

### 1. Make Changes

Edit files in `app/`, `components/`, etc.

### 2. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and test your changes

### 3. Run Tests

```bash
# Run local test suite
./scripts/test-local.sh
```

### 4. Deploy

```bash
# Deploy to production
./scripts/deploy.sh "feat: your feature description"
```

---

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint --fix

# Type check
npx tsc --noEmit

# Local test suite
./scripts/test-local.sh

# Deploy to production
./scripts/deploy.sh "commit message"
```

---

## Project Structure

```
portfolio-app/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utilities (Supabase, Redis, etc.)
├── k8s/             # Kubernetes manifests
├── scripts/         # Deployment scripts
├── public/          # Static assets
└── docker/          # Docker configuration
```

---

## Testing Features

### Admin Dashboard

Visit: http://localhost:3000/admin

Features:
- Blog management
- Services management
- Analytics dashboard
- Error monitoring
- System monitoring

### API Endpoints

- Health: http://localhost:3000/api/health
- Cache Stats: http://localhost:3000/api/cache/stats
- Blog Posts: http://localhost:3000/api/blog/posts

---

## Environment Variables Reference

### Required

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_SITE_URL` - Your site URL

### Optional (Local Development)

- `REDIS_ENABLED` - Enable/disable Redis (default: true)
- `REDIS_HOST` - Redis host (default: localhost in dev)
- `REDIS_PORT` - Redis port (default: 6379)
- `NODE_ENV` - Environment (development/production)

---

## Need Help?

1. **Documentation:** Check `TESTING_GUIDE.md`, `REDIS_SETUP.md`, `DEPLOYMENT.md`
2. **Logs:** Check terminal output for errors
3. **Redis Issues:** Disable with `REDIS_ENABLED=false`
4. **Build Issues:** Delete `.next` folder and rebuild

---

## Next Steps

1. ✅ App running locally
2. Test features at http://localhost:3000
3. Access admin at http://localhost:3000/admin
4. Make your changes
5. Run `./scripts/test-local.sh`
6. Deploy with `./scripts/deploy.sh "message"`

**Happy coding!** 🚀
