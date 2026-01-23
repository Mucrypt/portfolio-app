#!/bin/bash

# Backup Script for Portfolio Application
# Creates backups of database, uploads, and configurations

set -e

echo "💾 Creating backup for Portfolio Application..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="portfolio_backup_${DATE}"

# Create backup directory
mkdir -p ${BACKUP_DIR}/${BACKUP_NAME}

echo -e "${BLUE}📦 Creating backup directory: ${BACKUP_NAME}${NC}"

# Backup environment files
echo -e "${YELLOW}📄 Backing up environment files...${NC}"
if [ -f .env.production ]; then
    cp .env.production ${BACKUP_DIR}/${BACKUP_NAME}/
fi
if [ -f .env.local ]; then
    cp .env.local ${BACKUP_DIR}/${BACKUP_NAME}/
fi

# Backup nginx configuration
echo -e "${YELLOW}🌐 Backing up Nginx configuration...${NC}"
if [ -d nginx ]; then
    cp -r nginx ${BACKUP_DIR}/${BACKUP_NAME}/
fi

# Backup SSL certificates
echo -e "${YELLOW}🔐 Backing up SSL certificates...${NC}"
if [ -d nginx/ssl ]; then
    cp -r nginx/ssl ${BACKUP_DIR}/${BACKUP_NAME}/
fi

# Backup docker configurations
echo -e "${YELLOW}🐳 Backing up Docker configurations...${NC}"
cp docker-compose*.yml ${BACKUP_DIR}/${BACKUP_NAME}/ 2>/dev/null || true

# Create archive
echo -e "${BLUE}📦 Creating archive...${NC}"
cd ${BACKUP_DIR}
tar -czf ${BACKUP_NAME}.tar.gz ${BACKUP_NAME}
rm -rf ${BACKUP_NAME}

# Get file size
SIZE=$(du -h ${BACKUP_NAME}.tar.gz | cut -f1)

echo ""
echo -e "${GREEN}✅ Backup completed successfully!${NC}"
echo -e "${GREEN}📁 Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz${NC}"
echo -e "${GREEN}📊 Size: ${SIZE}${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: Upload this backup to your cloud storage for safekeeping${NC}"

# Optional: Upload to S3 (uncomment and configure)
# echo -e "${BLUE}☁️  Uploading to S3...${NC}"
# aws s3 cp ${BACKUP_NAME}.tar.gz s3://your-bucket/backups/

# Optional: Keep only last 7 backups
echo -e "${YELLOW}🧹 Cleaning old backups (keeping last 7)...${NC}"
ls -t portfolio_backup_*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm

echo -e "${GREEN}🎉 Backup process complete!${NC}"
