#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# This script helps you set up SSL certificates for your domain

set -e

echo "🔐 SSL Certificate Setup for Portfolio Application"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get domain name
read -p "Enter your domain name (e.g., example.com): " DOMAIN
read -p "Enter your email for Let's Encrypt: " EMAIL

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Domain and email are required${NC}"
    exit 1
fi

# Create SSL directory
mkdir -p nginx/ssl

echo -e "${YELLOW}📝 Setting up Certbot for Let's Encrypt...${NC}"

# Add certbot to docker-compose
cat > docker/docker-compose.certbot.yml << EOF
version: '3.9'

services:
  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./nginx/ssl:/etc/letsencrypt
      - ./nginx/certbot:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email ${EMAIL} --agree-tos --no-eff-email -d ${DOMAIN} -d www.${DOMAIN}
EOF

# Create webroot directory
mkdir -p nginx/certbot

# Update nginx configuration for certbot verification
echo -e "${BLUE}🔧 Updating Nginx configuration...${NC}"

# Start nginx temporarily for verification
echo -e "${YELLOW}🚀 Starting Nginx for verification...${NC}"
docker-compose -f docker-compose.prod.yml up -d nginx

# Wait for nginx
sleep 5

# Run certbot
echo -e "${GREEN}🎫 Requesting SSL certificate...${NC}"
docker-compose -f docker-compose.certbot.yml run --rm certbot

# Check if certificates were created
if [ -f "nginx/ssl/live/${DOMAIN}/fullchain.pem" ]; then
    echo -e "${GREEN}✅ SSL certificates obtained successfully!${NC}"
    
    # Update nginx configuration with correct paths
    sed -i "s|yourdomain.com|${DOMAIN}|g" nginx/conf.d/default.conf
    sed -i "s|/etc/nginx/ssl/fullchain.pem|/etc/nginx/ssl/live/${DOMAIN}/fullchain.pem|g" nginx/conf.d/default.conf
    sed -i "s|/etc/nginx/ssl/privkey.pem|/etc/nginx/ssl/live/${DOMAIN}/privkey.pem|g" nginx/conf.d/default.conf
    
    # Reload nginx
    echo -e "${BLUE}♻️  Reloading Nginx...${NC}"
    docker-compose -f docker-compose.prod.yml restart nginx
    
    echo ""
    echo -e "${GREEN}🎉 SSL setup complete!${NC}"
    echo -e "${GREEN}🔐 Your site is now available at: https://${DOMAIN}${NC}"
    echo ""
    echo -e "${YELLOW}📝 Certificate renewal:${NC}"
    echo -e "${YELLOW}Certificates will expire in 90 days${NC}"
    echo -e "${YELLOW}Run: docker-compose -f docker-compose.certbot.yml run --rm certbot renew${NC}"
else
    echo -e "${RED}❌ Failed to obtain SSL certificates${NC}"
    echo -e "${YELLOW}Please check:${NC}"
    echo -e "  - Domain DNS is pointing to this server"
    echo -e "  - Port 80 is accessible from the internet"
    echo -e "  - Nginx is running"
    exit 1
fi

# Setup auto-renewal cron job
echo -e "${BLUE}⏰ Setting up auto-renewal...${NC}"
cat > scripts/renew-ssl.sh << 'EOF'
#!/bin/bash
docker-compose -f docker-compose.certbot.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml restart nginx
EOF

chmod +x scripts/renew-ssl.sh

echo -e "${GREEN}✅ Auto-renewal script created at scripts/renew-ssl.sh${NC}"
echo -e "${YELLOW}Add to crontab: 0 0 1 * * /path/to/portfolio-app/scripts/renew-ssl.sh${NC}"
