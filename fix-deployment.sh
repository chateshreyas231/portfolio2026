#!/bin/bash

# Emergency fix script to completely remove PORT and redeploy
# Run this if deployment fails due to PORT environment variable

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID="${FIREBASE_PROJECT_ID:-portfolio2024-b95ee}"
REGION="${CLOUD_RUN_REGION:-us-central1}"
SERVICE_NAME="portfolio-app"

echo -e "${YELLOW}🔧 Fixing Cloud Run deployment - Removing PORT environment variable...${NC}"

# Set project
gcloud config set project ${PROJECT_ID}

# Check if service exists
if gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(metadata.name)' &>/dev/null; then
    echo -e "${YELLOW}📋 Service exists. Checking for PORT env var...${NC}"
    
    # Check if PORT exists
    if gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(spec.template.spec.containers[0].env[].name)' 2>/dev/null | grep -q "^PORT$"; then
        echo -e "${RED}❌ PORT environment variable found!${NC}"
        echo -e "${YELLOW}🔧 Attempting to remove PORT...${NC}"
        
        # Try to remove PORT
        if gcloud run services update ${SERVICE_NAME} \
            --region ${REGION} \
            --remove-env-vars PORT \
            --quiet 2>/dev/null; then
            echo -e "${GREEN}✅ PORT removed successfully!${NC}"
        else
            echo -e "${RED}❌ Failed to remove PORT. Deleting service...${NC}"
            gcloud run services delete ${SERVICE_NAME} \
                --region ${REGION} \
                --quiet
            echo -e "${GREEN}✅ Service deleted. Ready for fresh deployment.${NC}"
        fi
    else
        echo -e "${GREEN}✅ No PORT environment variable found. Service is clean.${NC}"
    fi
else
    echo -e "${GREEN}✅ Service doesn't exist. Ready for fresh deployment.${NC}"
fi

echo -e "\n${GREEN}✅ Fix complete!${NC}"
echo -e "${YELLOW}📝 You can now run: ./deploy-firebase.sh${NC}"

