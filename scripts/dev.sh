#!/bin/bash

# Development Environment Setup Script
# This script sets up and starts the development environment

set -e

echo "🚀 Starting Portfolio Development Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env.local file not found${NC}"
    echo -e "${YELLOW}Please create .env.local file with required environment variables${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}Please start Docker Desktop and try again${NC}"
    exit 1
fi

# Clean up previous containers (optional)
read -p "Do you want to clean up previous containers? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🧹 Cleaning up previous containers...${NC}"
    docker-compose down -v
fi

# Build and start containers
echo -e "${GREEN}📦 Building Docker images...${NC}"
docker-compose build

echo -e "${GREEN}🚀 Starting containers...${NC}"
docker-compose up -d

# Wait for application to be ready
echo -e "${YELLOW}⏳ Waiting for application to be ready...${NC}"
sleep 10

# Check if container is running
if docker ps | grep -q portfolio-dev; then
    echo -e "${GREEN}✅ Development environment is ready!${NC}"
    echo -e "${GREEN}🌐 Application: http://localhost:3000${NC}"
    echo -e "${GREEN}🔧 Admin Panel: http://localhost:3000/admin${NC}"
    echo ""
    echo -e "${YELLOW}📝 To view logs: docker-compose -f docker/docker-compose.yml logs -f${NC}"
    echo -e "${YELLOW}🛑 To stop: docker-compose -f docker/docker-compose.yml down${NC}"
else
    echo -e "${RED}❌ Error: Container failed to start${NC}"
    echo -e "${YELLOW}Run 'docker-compose logs' to see the error${NC}"
    exit 1
fi
