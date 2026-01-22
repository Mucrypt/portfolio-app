#!/bin/bash

# Docker Build Script for Portfolio App
# This script builds the Docker image with proper environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Portfolio App Docker Build ===${NC}"
echo

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}Error: .env.local file not found!${NC}"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
echo -e "${YELLOW}Loading environment variables...${NC}"
export $(cat .env.local | grep -v '^#' | xargs)

# Check required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}Error: NEXT_PUBLIC_SUPABASE_URL not set${NC}"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not set${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables loaded${NC}"
echo

# Build Docker image
echo -e "${BLUE}Building Docker image...${NC}"
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}" \
  -t portfolio-app:latest \
  -f docker/Dockerfile \
  .

if [ $? -eq 0 ]; then
    echo
    echo -e "${GREEN}✓ Docker image built successfully!${NC}"
    echo
    echo -e "${BLUE}Image details:${NC}"
    docker images portfolio-app:latest
    echo
    echo -e "${YELLOW}To run the container:${NC}"
    echo "  docker run -p 3000:3000 --env-file .env.local portfolio-app:latest"
else
    echo
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi
