#!/bin/bash

# Health Check Script
# Monitors the health of all services

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏥 Portfolio Application Health Check${NC}"
echo ""

# Check Docker
echo -ne "Docker Engine: "
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not Running${NC}"
    exit 1
fi

# Check containers
echo ""
echo -e "${YELLOW}Container Status:${NC}"

# App container
echo -ne "  App Container: "
if docker ps | grep -q portfolio-app; then
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' portfolio-app 2>/dev/null || echo "no-health")
    if [ "$STATUS" = "healthy" ]; then
        echo -e "${GREEN}✓ Healthy${NC}"
    elif [ "$STATUS" = "no-health" ]; then
        echo -e "${YELLOW}⚠ Running (no health check)${NC}"
    else
        echo -e "${RED}✗ Unhealthy${NC}"
    fi
else
    echo -e "${RED}✗ Not Running${NC}"
fi

# Nginx container
echo -ne "  Nginx Container: "
if docker ps | grep -q portfolio-nginx; then
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' portfolio-nginx 2>/dev/null || echo "no-health")
    if [ "$STATUS" = "healthy" ]; then
        echo -e "${GREEN}✓ Healthy${NC}"
    elif [ "$STATUS" = "no-health" ]; then
        echo -e "${YELLOW}⚠ Running (no health check)${NC}"
    else
        echo -e "${RED}✗ Unhealthy${NC}"
    fi
else
    echo -e "${RED}✗ Not Running${NC}"
fi

# Check endpoints
echo ""
echo -e "${YELLOW}Endpoint Health:${NC}"

# HTTP endpoint
echo -ne "  HTTP (Port 80): "
if curl -f -s http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Responding${NC}"
else
    echo -e "${RED}✗ Not Responding${NC}"
fi

# HTTPS endpoint (if SSL is configured)
echo -ne "  HTTPS (Port 443): "
if curl -f -s -k https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Responding${NC}"
else
    echo -e "${YELLOW}⚠ Not Configured or Not Responding${NC}"
fi

# App direct endpoint
echo -ne "  App Direct (Port 3000): "
if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Responding${NC}"
else
    echo -e "${RED}✗ Not Responding${NC}"
fi

# Resource usage
echo ""
echo -e "${YELLOW}Resource Usage:${NC}"

if docker ps | grep -q portfolio-app; then
    STATS=$(docker stats --no-stream --format "{{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep portfolio)
    echo "$STATS" | while IFS=$'\t' read -r container cpu mem; do
        echo -e "  ${container}: CPU ${cpu}, Memory ${mem}"
    done
fi

# Disk usage
echo ""
echo -e "${YELLOW}Disk Usage:${NC}"
echo -e "  Docker System: $(docker system df --format '{{.Size}}' | head -1)"

# Network
echo ""
echo -e "${YELLOW}Network:${NC}"
if docker network ls | grep -q portfolio-network; then
    echo -e "  ${GREEN}✓ portfolio-network active${NC}"
else
    echo -e "  ${RED}✗ portfolio-network not found${NC}"
fi

echo ""
echo -e "${BLUE}Health check complete${NC}"
