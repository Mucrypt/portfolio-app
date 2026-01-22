#!/bin/bash

# Production Deployment Script
# This script builds and deploys the production environment

set -e

echo "🚀 Deploying Portfolio to Production..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    echo -e "${YELLOW}Please create .env.production file with required environment variables${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}Please start Docker and try again${NC}"
    exit 1
fi

# Confirmation prompt
echo -e "${YELLOW}⚠️  This will deploy to PRODUCTION environment${NC}"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
fi

# Pull latest changes (if in git repo)
if [ -d .git ]; then
    echo -e "${BLUE}📥 Pulling latest changes...${NC}"
    git pull origin main || echo -e "${YELLOW}⚠️  Git pull failed or not needed${NC}"
fi

# Stop existing production containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f docker/docker-compose.prod.yml down

# Remove old images (optional cleanup)
read -p "Do you want to remove old Docker images? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
    docker image prune -f
fi

# Build production images
echo -e "${GREEN}🔨 Building production images...${NC}"
docker-compose -f docker/docker-compose.prod.yml build --no-cache

# Start production containers
echo -e "${GREEN}🚀 Starting production containers...${NC}"
docker-compose -f docker/docker-compose.prod.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 15

# Health check
echo -e "${BLUE}🏥 Running health checks...${NC}"
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nginx is healthy${NC}"
else
    echo -e "${RED}⚠️  Nginx health check failed${NC}"
fi

# Check container status
if docker ps | grep -q portfolio-app && docker ps | grep -q portfolio-nginx; then
    echo ""
    echo -e "${GREEN}🎉 Production deployment successful!${NC}"
    echo -e "${GREEN}🌐 Application: http://yourdomain.com${NC}"
    echo -e "${GREEN}🔐 SSL: https://yourdomain.com${NC}"
    echo ""
    echo -e "${YELLOW}📊 Container Status:${NC}"
    docker-compose -f docker/docker-compose.prod.yml ps
    echo ""
    echo -e "${YELLOW}📝 To view logs: docker-compose -f docker/docker-compose.prod.yml logs -f${NC}"
    echo -e "${YELLOW}🛑 To stop: docker-compose -f docker/docker-compose.prod.yml down${NC}"
else
    echo -e "${RED}❌ Error: Containers failed to start${NC}"
    echo -e "${YELLOW}Run 'docker-compose -f docker/docker-compose.prod.yml logs' to see errors${NC}"
    exit 1
fi
