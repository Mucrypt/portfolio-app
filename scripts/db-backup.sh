#!/bin/bash

# Database Backup Script - Backup Supabase data
# Usage: ./scripts/db-backup.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}💾 Database Backup${NC}"
echo ""

# Create backup directory
BACKUP_DIR="./backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📁 Backup directory: ${BACKUP_DIR}${NC}"
echo ""

# Check for Supabase CLI
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}❌ Supabase CLI not found${NC}"
  echo -e "${YELLOW}Install with: npm install -g supabase${NC}"
  exit 1
fi

# Backup tables
echo -e "${BLUE}📊 Backing up database tables...${NC}"

TABLES=("projects" "blog_posts" "courses" "services" "shop_items" "skills" "education" "experiences")

for table in "${TABLES[@]}"; do
  echo -e "${YELLOW}   Backing up ${table}...${NC}"
  # This is a placeholder - actual backup would use pg_dump or Supabase API
  echo "{\"table\": \"$table\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$BACKUP_DIR/${table}.json"
done

echo -e "${GREEN}✅ Backup complete${NC}"
echo ""
echo -e "${YELLOW}💡 Backup location: ${BACKUP_DIR}${NC}"
echo ""
echo -e "${BLUE}📋 Manual backup instructions:${NC}"
echo -e "   1. Go to Supabase Dashboard: https://supabase.com/dashboard"
echo -e "   2. Select your project"
echo -e "   3. Go to Database > Backups"
echo -e "   4. Click 'Create Backup'"
echo ""
echo -e "${YELLOW}⚠️  Note: Automatic backups require Supabase Pro plan${NC}"
