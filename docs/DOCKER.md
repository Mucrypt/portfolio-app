# 🐳 Docker Deployment Guide

Complete guide for containerizing and deploying the Portfolio Application with Docker, Docker Compose, and Nginx.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Development Environment](#development-environment)
4. [Production Deployment](#production-deployment)
5. [SSL/HTTPS Setup](#sslhttps-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Architecture](#architecture)

---

## 🔧 Prerequisites

### Required Software
- **Docker**: 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: 2.0+ (included with Docker Desktop)
- **Git**: For version control
- **Node.js**: 20+ (for local development only)

### Server Requirements (Production)
- **OS**: Ubuntu 20.04+ / Debian 11+ / Amazon Linux 2
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB, Recommended 50GB+
- **CPU**: 2+ cores recommended
- **Network**: Public IP address with ports 80, 443 open

### Domain & DNS (Production)
- Domain name registered (from Hostinger or any registrar)
- DNS A record pointing to your server IP
- WWW CNAME record (optional but recommended)

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd portfolio-app
```

### 2. Environment Setup
```bash
# For development
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# For production
cp .env.example .env.production
# Edit .env.production with production values
```

### 3. Start Development Environment
```bash
# Option 1: Using script
./scripts/dev.sh

# Option 2: Manual
docker-compose up -d
```

### 4. Access Application
- **Application**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Health Check**: http://localhost:3000/api/health

---

## 💻 Development Environment

### Starting Development Server

#### Using Automation Script
```bash
./scripts/dev.sh
```

This script will:
- ✅ Check for `.env.local` file
- ✅ Verify Docker is running
- ✅ Build Docker images
- ✅ Start containers
- ✅ Perform health checks
- ✅ Display access URLs

#### Manual Start
```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Development Features
- **Hot Reload**: Code changes are automatically reflected
- **Volume Mounting**: Source code is mounted for live updates
- **Fast Builds**: Development Dockerfile optimized for speed
- **Easy Debugging**: Full access to logs and container shell

### Useful Development Commands
```bash
# View logs
docker-compose logs -f

# Access container shell
docker exec -it portfolio-dev sh

# Restart services
docker-compose restart

# Rebuild after dependency changes
docker-compose up -d --build

# Clean everything (including volumes)
docker-compose down -v
docker system prune -a
```

---

## 🏭 Production Deployment

### Initial Setup

#### 1. Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

#### 2. Clone Application
```bash
cd /opt
sudo git clone <your-repo-url> portfolio-app
cd portfolio-app
sudo chown -R $USER:$USER .
```

#### 3. Configure Environment
```bash
# Create production environment file
cp .env.example .env.production

# Edit with production values
nano .env.production
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000
```

#### 4. Deploy Application
```bash
# Option 1: Using deployment script
./scripts/deploy.sh

# Option 2: Manual deployment
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Production Commands
```bash
# View status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🔐 SSL/HTTPS Setup

### Automatic Setup with Let's Encrypt

#### 1. Run SSL Setup Script
```bash
./scripts/setup-ssl.sh
```

You'll be prompted for:
- **Domain name**: example.com
- **Email address**: your@email.com

The script will:
1. ✅ Create necessary directories
2. ✅ Configure Certbot
3. ✅ Request SSL certificates
4. ✅ Update Nginx configuration
5. ✅ Set up auto-renewal

#### 2. Verify SSL
```bash
# Test HTTPS
curl -I https://yourdomain.com

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Manual SSL Setup

#### 1. Prepare Certbot
```bash
# Create directories
mkdir -p nginx/ssl nginx/certbot

# Update Nginx config
nano nginx/conf.d/default.conf
# Replace 'yourdomain.com' with your actual domain
```

#### 2. Request Certificate
```bash
# Using Certbot container
docker run -it --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v $(pwd)/nginx/certbot:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d yourdomain.com \
  -d www.yourdomain.com
```

#### 3. Update Nginx Paths
```bash
nano nginx/conf.d/default.conf

# Update certificate paths:
ssl_certificate /etc/nginx/ssl/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/live/yourdomain.com/privkey.pem;
```

#### 4. Reload Nginx
```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

### Certificate Renewal

Certificates expire every 90 days. Renew them:

```bash
# Manual renewal
./scripts/renew-ssl.sh

# Or using Certbot directly
docker-compose -f docker-compose.certbot.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml restart nginx
```

#### Setup Auto-Renewal (Cron)
```bash
# Open crontab
crontab -e

# Add this line (runs at 2 AM on the 1st of every month)
0 2 1 * * /opt/portfolio-app/scripts/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
```

---

## 📊 Monitoring & Maintenance

### Health Checks

#### Using Health Check Script
```bash
./scripts/health-check.sh
```

This checks:
- ✅ Docker Engine status
- ✅ Container health
- ✅ Endpoint responses
- ✅ Resource usage
- ✅ Network connectivity

#### Manual Health Checks
```bash
# Check container health
docker ps
docker inspect portfolio-app | grep -A 10 Health

# Test endpoints
curl http://localhost/health
curl http://localhost:3000/api/health

# Check resource usage
docker stats

# View recent logs
docker logs portfolio-app --tail 50
```

### Log Management

#### Using Log Viewer Script
```bash
./scripts/logs.sh
```

Options:
1. Development logs (all services)
2. Production logs (all services)
3. App container only
4. Nginx container only
5. Nginx access logs
6. Nginx error logs

#### Manual Log Access
```bash
# Application logs
docker logs -f portfolio-app

# Nginx logs
docker logs -f portfolio-nginx
docker exec portfolio-nginx tail -f /var/log/nginx/access.log
docker exec portfolio-nginx tail -f /var/log/nginx/error.log

# Save logs to file
docker logs portfolio-app > app-logs-$(date +%Y%m%d).log
```

### Backup & Restore

#### Create Backup
```bash
./scripts/backup.sh
```

This backs up:
- Environment files
- Nginx configuration
- SSL certificates
- Docker configurations

Backups are stored in `backups/` directory.

#### Restore from Backup
```bash
# Extract backup
cd backups
tar -xzf portfolio_backup_YYYYMMDD_HHMMSS.tar.gz

# Copy files back
cp -r portfolio_backup_*/nginx ../
cp portfolio_backup_*/.env.production ../

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### Performance Optimization

#### 1. Clean Docker System
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

#### 2. Monitor Resource Usage
```bash
# Real-time stats
docker stats

# Disk usage
docker system df

# Container processes
docker top portfolio-app
```

#### 3. Nginx Performance
```bash
# Test configuration
docker exec portfolio-nginx nginx -t

# Reload configuration (zero downtime)
docker exec portfolio-nginx nginx -s reload

# View active connections
docker exec portfolio-nginx cat /var/run/nginx.pid | xargs ps aux | grep nginx
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Container Won't Start
```bash
# Check logs
docker-compose logs

# Specific container
docker logs portfolio-app

# Check for port conflicts
sudo lsof -i :3000
sudo lsof -i :80
sudo lsof -i :443
```

**Solutions:**
- Ensure ports are not in use
- Check environment variables
- Verify Docker is running
- Check disk space: `df -h`

#### 2. Application Not Accessible
```bash
# Test network
docker network ls
docker network inspect portfolio-network

# Test connectivity
docker exec portfolio-nginx wget -O- http://app:3000

# Check firewall
sudo ufw status
sudo firewall-cmd --list-all
```

**Solutions:**
- Verify containers are on same network
- Check firewall rules
- Ensure ports are exposed
- Verify DNS settings

#### 3. SSL Certificate Issues
```bash
# Check certificate
docker exec portfolio-nginx ls -la /etc/nginx/ssl/

# Test SSL
openssl s_client -connect yourdomain.com:443

# View Certbot logs
docker-compose -f docker-compose.certbot.yml logs
```

**Solutions:**
- Ensure domain points to server
- Check port 80 is accessible
- Verify email address
- Check Certbot logs

#### 4. Performance Issues
```bash
# Check resource usage
docker stats

# Check disk space
df -h

# Check memory
free -h

# View system load
uptime
```

**Solutions:**
- Increase server resources
- Clean Docker system
- Optimize Nginx cache
- Review application logs

#### 5. Build Failures
```bash
# Clean build
docker-compose build --no-cache

# Check Docker space
docker system df

# Prune everything
docker system prune -a
```

**Solutions:**
- Clear Docker cache
- Check internet connection
- Verify package.json
- Update Docker version

### Debug Mode

#### Enable Detailed Logging
```bash
# Set in .env.production
LOG_LEVEL=debug

# Restart
docker-compose -f docker-compose.prod.yml restart
```

#### Access Container Shell
```bash
# App container
docker exec -it portfolio-app sh

# Nginx container
docker exec -it portfolio-nginx sh

# Run commands inside container
node --version
npm list
ps aux
```

### Getting Help

If you're still stuck:

1. **Check logs**: Always start with logs
2. **Review configuration**: Verify all config files
3. **Test individually**: Test each component separately
4. **Google the error**: Search for specific error messages
5. **Check documentation**: Docker, Next.js, Nginx docs
6. **Community help**: Docker forums, Stack Overflow

---

## 🏗️ Architecture

### System Overview

```
                                    Internet
                                       |
                                       |
                         ┌─────────────▼─────────────┐
                         │   Firewall (80, 443)      │
                         └─────────────┬─────────────┘
                                       |
                         ┌─────────────▼─────────────┐
                         │   Nginx Reverse Proxy     │
                         │   - SSL Termination       │
                         │   - Load Balancing        │
                         │   - Static Caching        │
                         │   - Rate Limiting         │
                         └─────────────┬─────────────┘
                                       |
                                       |
                         ┌─────────────▼─────────────┐
                         │   Next.js Application     │
                         │   - Server Side Rendering │
                         │   - API Routes            │
                         │   - Authentication        │
                         └─────────────┬─────────────┘
                                       |
                                       |
                         ┌─────────────▼─────────────┐
                         │   Supabase (External)     │
                         │   - PostgreSQL Database   │
                         │   - Authentication        │
                         │   - Storage               │
                         └───────────────────────────┘
```

### Container Architecture

**Development (docker-compose.yml)**
```yaml
portfolio-dev (Next.js)
  ├── Port: 3000 (exposed)
  ├── Hot Reload: Enabled
  ├── Volumes: Source code mounted
  └── Network: portfolio-network
```

**Production (docker-compose.prod.yml)**
```yaml
portfolio-nginx (Nginx)
  ├── Port: 80, 443 (exposed)
  ├── SSL: Enabled
  ├── Reverse Proxy → app:3000
  └── Network: portfolio-network

portfolio-app (Next.js)
  ├── Port: 3000 (internal)
  ├── Standalone build
  ├── Health checks
  └── Network: portfolio-network
```

### File Structure
```
portfolio-app/
├── docker-compose.yml              # Development
├── docker-compose.prod.yml         # Production
├── Dockerfile                      # Production build
├── Dockerfile.dev                  # Development build
├── .dockerignore                   # Ignore patterns
├── nginx/
│   ├── nginx.conf                 # Main config
│   └── conf.d/
│       └── default.conf           # Site config
├── scripts/
│   ├── dev.sh                     # Start development
│   ├── deploy.sh                  # Deploy production
│   ├── setup-ssl.sh               # SSL setup
│   ├── backup.sh                  # Create backups
│   ├── logs.sh                    # View logs
│   └── health-check.sh            # Health checks
└── app/
    └── api/
        └── health/
            └── route.ts           # Health endpoint
```

### Port Mapping

| Service | Internal Port | External Port | Protocol |
|---------|--------------|---------------|----------|
| Nginx   | 80           | 80            | HTTP     |
| Nginx   | 443          | 443           | HTTPS    |
| Next.js | 3000         | 3000 (dev)    | HTTP     |

### Volume Mounts

**Development:**
- Source code → `/app`
- `node_modules` → Named volume
- `.next` → Named volume

**Production:**
- Nginx config → `/etc/nginx`
- SSL certs → `/etc/nginx/ssl`
- Cache → Named volume
- Logs → Named volume

---

## 📚 Additional Resources

### Official Documentation
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Let's Encrypt](https://letsencrypt.org/docs/)

### Useful Tools
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Portainer](https://www.portainer.io/) - Docker GUI
- [Nginx Config Generator](https://nginxconfig.io/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)

### Next Steps
1. ✅ Docker setup complete
2. ⏭️ CI/CD with GitHub Actions
3. ⏭️ Kubernetes deployment
4. ⏭️ Monitoring with Prometheus
5. ⏭️ Log aggregation with ELK

---

## 🤝 Contributing

Found an issue or have a suggestion? Please open an issue or submit a pull request.

---

## 📄 License

This deployment configuration is part of the Portfolio Application project.

---

**Made with ❤️ by Romeo Mukula**
