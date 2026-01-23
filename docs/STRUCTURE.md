# 📁 Project Structure - Complete Overview

## 🏗️ Architecture Overview

```
Portfolio Application
│
├── Frontend (Next.js + React)
│   └── Server-Side Rendering + Static Generation
│
├── Backend (Next.js API Routes + Supabase)
│   └── PostgreSQL Database with RLS
│
├── Docker Containers
│   ├── Development (Hot Reload)
│   └── Production (Multi-stage Build)
│
├── CI/CD (GitHub Actions)
│   ├── Build & Test
│   ├── Security Scanning
│   ├── Staging Deploy
│   └── Production Deploy
│
└── Kubernetes (AWS EKS)
    ├── Production Namespace (3-10 replicas)
    ├── Staging Namespace (2 replicas)
    ├── Nginx Ingress + SSL
    └── Auto-scaling + High Availability
```

---

## 📂 Directory Structure

```
portfolio-app/
│
├── 📱 APPLICATION CODE
│   ├── app/                          # Next.js App Router
│   │   ├── api/                     # API routes
│   │   │   └── health/              # Health check endpoint ✨
│   │   ├── admin/                   # Admin dashboard
│   │   ├── blog/                    # Blog pages
│   │   ├── services/                # Services pages
│   │   ├── shop/                    # E-commerce pages
│   │   ├── projects/                # Portfolio projects
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   └── globals.css              # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                      # UI primitives
│   │   ├── admin/                   # Admin components
│   │   └── ...                      # Feature components
│   │
│   ├── lib/                         # Utilities
│   │   ├── supabase/                # Supabase client
│   │   └── utils.ts                 # Helper functions
│   │
│   └── public/                      # Static assets
│
├── 🐳 DOCKER CONFIGURATION
│   ├── docker/                       # Docker artifacts ✨
│   │   ├── Dockerfile                # Production build ✨
│   │   ├── Dockerfile.dev            # Development build ✨
│   │   ├── docker-compose.yml        # Development environment ✨
│   │   ├── docker-compose.prod.yml   # Production environment ✨
│   │   └── .dockerignore             # Build optimization ✨
│   │
│   └── nginx/                        # Nginx configuration ✨
│       ├── nginx.conf                # Main config (performance, security)
│       └── conf.d/
│           └── default.conf          # Server blocks (romeomukulah.org)
│
├── 🔄 CI/CD PIPELINES
│   └── .github/
│       └── workflows/                # GitHub Actions workflows ✨
│           ├── ci.yml                # Build, test, lint, security
│           ├── cd-staging.yml        # Auto-deploy to staging
│           ├── cd-production.yml     # Deploy to production
│           ├── security.yml          # Security scanning (daily)
│           └── release.yml           # Automated releases
│
├── ☸️ KUBERNETES MANIFESTS
│   └── k8s/                          # Kubernetes configuration ✨
│       ├── base/
│       │   ├── namespace.yaml        # Namespaces (prod, staging)
│       │   └── configmap.yaml        # Application config
│       │
│       ├── production/
│       │   ├── deployment.yaml       # 3-10 replicas, HPA
│       │   ├── service.yaml          # ClusterIP service
│       │   ├── ingress.yaml          # Nginx ingress + SSL
│       │   ├── hpa.yaml              # Auto-scaling
│       │   └── certificate.yaml      # Let's Encrypt SSL
│       │
│       └── staging/
│           └── deployment.yaml       # Staging configuration
│
├── 📦 HELM CHARTS
│   └── helm/                         # Helm package ✨
│       └── portfolio/
│           ├── Chart.yaml            # Chart metadata
│           ├── values.yaml           # Default values
│           ├── values-staging.yaml   # Staging overrides
│           ├── values-production.yaml# Production overrides
│           ├── README.md             # Helm documentation
│           │
│           └── templates/            # Kubernetes templates
│               ├── _helpers.tpl      # Template helpers
│               ├── deployment.yaml   # Deployment template
│               ├── service.yaml      # Service template
│               ├── ingress.yaml      # Ingress template
│               ├── hpa.yaml          # HPA template
│               ├── pdb.yaml          # Pod Disruption Budget
│               ├── configmap.yaml    # ConfigMap template
│               ├── serviceaccount.yaml
│               └── networkpolicy.yaml
│
├── 🔧 AUTOMATION SCRIPTS
│   └── scripts/                      # Deployment scripts ✨
│       ├── dev.sh                    # Start development
│       ├── deploy.sh                 # Deploy production (Docker)
│       ├── setup-ssl.sh              # SSL certificate setup
│       ├── backup.sh                 # Backup configs
│       ├── logs.sh                   # Log viewer
│       ├── health-check.sh           # Health monitoring
│       ├── setup-eks.sh              # AWS EKS setup
│       └── k8s-deploy.sh             # Kubernetes deployment
│
├── 📚 DOCUMENTATION
│   ├── README.md                     # Main documentation
│   ├── DOCKER.md                     # Docker guide (94KB) ✨
│   ├── CICD.md                       # CI/CD & K8s guide (73KB) ✨
│   ├── GITHUB_SECRETS.md             # Secrets configuration ✨
│   ├── DEPLOYMENT.md                 # Deployment summary ✨
│   └── STRUCTURE.md                  # This file
│
├── ⚙️ CONFIGURATION FILES
│   ├── next.config.ts                # Next.js config (standalone mode) ✨
│   ├── tsconfig.json                 # TypeScript config
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── eslint.config.mjs             # ESLint config
│   ├── postcss.config.mjs            # PostCSS config
│   ├── package.json                  # Dependencies
│   ├── .env.local                    # Local environment
│   ├── .env.example                  # Environment template ✨
│   ├── .gitignore                    # Git ignore
│   └── .prettierrc                   # Code formatting
│
└── 📊 PROJECT METADATA
    ├── LICENSE                       # License file
    └── .git/                         # Git repository

✨ = New/Modified for Docker & Kubernetes deployment
```

---

## 🎯 Key Files by Purpose

### Development
```
docker/docker-compose.yml        # Start: ./scripts/dev.sh
docker/Dockerfile.dev            # Hot reload development
.env.local                      # Local configuration
```

### Production (Local)
```
docker/docker-compose.prod.yml   # Start: ./scripts/deploy.sh
docker/Dockerfile                # Optimized production build
nginx/                          # Reverse proxy config
```

### CI/CD
```
.github/workflows/ci.yml        # Runs on every push
.github/workflows/cd-staging.yml # Auto-deploy develop branch
.github/workflows/cd-production.yml # Deploy tags (v*.*.*)
.github/workflows/security.yml  # Daily security scans
```

### Kubernetes Deployment
```
k8s/production/                 # Production manifests
helm/portfolio/                 # Helm chart package
scripts/setup-eks.sh            # EKS cluster setup
scripts/k8s-deploy.sh           # Deploy to K8s
```

### Documentation
```
README.md                       # Main guide
DOCKER.md                       # Docker deployment
CICD.md                         # CI/CD & Kubernetes
GITHUB_SECRETS.md               # Secrets setup
DEPLOYMENT.md                   # Deployment summary
```

---

## 🔍 File Count Summary

### Application Code
- **Total Files:** ~150+ (app/, components/, lib/)
- **TypeScript/TSX:** ~120 files
- **Styles:** ~10 CSS files
- **Config:** ~8 files

### Docker & Infrastructure
- **Dockerfiles:** 2 (prod + dev)
- **Docker Compose:** 2 (dev + prod)
- **Nginx Configs:** 2
- **Scripts:** 8 automation scripts

### CI/CD & Kubernetes
- **Workflows:** 5 GitHub Actions
- **K8s Manifests:** 8 files
- **Helm Templates:** 9 templates
- **Helm Values:** 3 files

### Documentation
- **Markdown Docs:** 6 comprehensive guides
- **Total Doc Size:** ~200KB

---

## 🌐 Domains & URLs

### Production
- **Primary:** https://romeomukulah.org
- **WWW:** https://www.romeomukulah.org
- **Health:** https://romeomukulah.org/api/health

### Staging
- **Primary:** https://staging.romeomukulah.org
- **Health:** https://staging.romeomukulah.org/api/health

### Local Development
- **Application:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Health:** http://localhost:3000/api/health

---

## 🔐 Security Features

### Container Security
```
Dockerfile
├── Non-root user (UID 1001)
├── Minimal base image (node:20-alpine)
├── Multi-stage build
└── Read-only root filesystem
```

### Network Security
```
nginx/conf.d/default.conf
├── TLS 1.2/1.3 only
├── Rate limiting (100 req/s)
├── Connection limits
├── Security headers
└── HTTPS redirect
```

### Kubernetes Security
```
k8s/production/
├── Network policies
├── Pod security context
├── Resource limits
├── RBAC policies
└── Secrets management
```

### CI/CD Security
```
.github/workflows/security.yml
├── Dependency scanning (Snyk)
├── Container scanning (Trivy)
├── Code analysis (SonarCloud)
├── Secret scanning (TruffleHog)
└── CodeQL analysis
```

---

## 📊 Performance Features

### Caching Strategy
```
nginx/
├── Static assets: 7 days
├── Images: 7 days
├── API: No cache
└── Proxy cache: STATIC zone
```

### Auto-scaling
```
k8s/production/hpa.yaml
├── Min replicas: 3
├── Max replicas: 10
├── CPU target: 70%
└── Memory target: 80%
```

### Resource Management
```
k8s/production/deployment.yaml
├── CPU request: 200m
├── CPU limit: 1000m
├── Memory request: 512Mi
└── Memory limit: 1Gi
```

---

## 🚀 Deployment Flow

```
1. Developer pushes code
   └──> GitHub

2. CI Pipeline runs
   ├──> Lint & Test
   ├──> Build Docker image
   ├──> Security scan
   └──> Push to GHCR

3. Staging Deployment (develop branch)
   ├──> Kubernetes staging namespace
   ├──> 2 replicas
   └──> Health checks

4. Production Deployment (tags)
   ├──> Manual approval
   ├──> Kubernetes production namespace
   ├──> 3-10 replicas (auto-scale)
   ├──> Blue-green deployment
   └──> Smoke tests

5. Post-Deployment
   ├──> Monitoring
   ├──> Logging
   └──> Alerts
```

---

## 🎯 Quick Navigation

### Need to...
- **Start dev environment?** → `./scripts/dev.sh`
- **Deploy locally?** → `./scripts/deploy.sh`
- **Setup EKS?** → `./scripts/setup-eks.sh`
- **Deploy to K8s?** → `./scripts/k8s-deploy.sh`
- **View logs?** → `./scripts/logs.sh`
- **Check health?** → `./scripts/health-check.sh`
- **Backup configs?** → `./scripts/backup.sh`

### Need docs on...
- **Docker?** → [DOCKER.md](DOCKER.md)
- **CI/CD & K8s?** → [CICD.md](CICD.md)
- **GitHub Secrets?** → [GITHUB_SECRETS.md](GITHUB_SECRETS.md)
- **Deployment?** → [DEPLOYMENT.md](DEPLOYMENT.md)
- **Helm?** → [helm/portfolio/README.md](../helm/portfolio/README.md)

---

## 📈 Project Stats

- **Lines of Code:** ~15,000+
- **React Components:** ~40+
- **API Routes:** ~10+
- **Database Tables:** ~15+
- **Docker Images:** 2 (dev + prod)
- **Kubernetes Resources:** ~25+
- **Helm Templates:** 9
- **Automation Scripts:** 8
- **Documentation Pages:** 6
- **CI/CD Workflows:** 5

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0  
**Total Files:** ~350+  
**Total Size:** ~50MB (excluding node_modules)
