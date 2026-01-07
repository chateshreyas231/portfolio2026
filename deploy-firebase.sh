#!/bin/bash

# Firebase + Cloud Run Deployment Script
# This script deploys your Next.js portfolio to Firebase Hosting with Cloud Run backend

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
PROJECT_ID="${FIREBASE_PROJECT_ID:-your-firebase-project-id}"
REGION="${CLOUD_RUN_REGION:-us-central1}"
SERVICE_NAME="portfolio-app"

echo -e "${GREEN}🚀 Starting Firebase + Cloud Run Deployment${NC}\n"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI is not installed.${NC}"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI is not installed.${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed.${NC}"
    echo "Install it from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if user is logged in to Firebase
echo -e "${YELLOW}📋 Checking Firebase authentication...${NC}"
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}Please log in to Firebase...${NC}"
    firebase login
fi

# Check if user is logged in to gcloud
echo -e "${YELLOW}📋 Checking Google Cloud authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}Please log in to Google Cloud...${NC}"
    gcloud auth login
fi

# Set the project
echo -e "${YELLOW}🔧 Setting Firebase project to ${PROJECT_ID}...${NC}"
firebase use ${PROJECT_ID} || firebase use --add ${PROJECT_ID}

echo -e "${YELLOW}🔧 Setting Google Cloud project to ${PROJECT_ID}...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Check if Resend API key is set
if [ -z "$RESEND_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  RESEND_API_KEY environment variable is not set.${NC}"
    echo "Please set it: export RESEND_API_KEY=re_your_key_here"
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create or update Resend API key secret
if [ ! -z "$RESEND_API_KEY" ]; then
    echo -e "${YELLOW}🔐 Creating/updating Resend API key secret...${NC}"
    echo -n "$RESEND_API_KEY" | gcloud secrets create resend-api-key --data-file=- 2>/dev/null || \
    echo -n "$RESEND_API_KEY" | gcloud secrets versions add resend-api-key --data-file=-
    
    # Grant Cloud Run access to the secret
    PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format='value(projectNumber)')
    gcloud secrets add-iam-policy-binding resend-api-key \
        --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet 2>/dev/null || true
fi

# Build Docker image
echo -e "${YELLOW}🐳 Building Docker image...${NC}"
docker build -t gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest .

# Push to Google Container Registry
echo -e "${YELLOW}📤 Pushing Docker image to Google Container Registry...${NC}"
docker push gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest

# Update cloud-run.yaml with project ID
sed "s/PROJECT_ID/${PROJECT_ID}/g" cloud-run.yaml > cloud-run-deploy.yaml

# Deploy to Cloud Run
echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"

# Check if service exists and remove PORT env var if it does (Cloud Run sets PORT automatically)
if gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(metadata.name)' &>/dev/null; then
    echo -e "${YELLOW}⚠️  Service exists. Removing PORT env var if present...${NC}"
    # Get current env vars and remove PORT
    CURRENT_ENV=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(spec.template.spec.containers[0].env[].name)' 2>/dev/null | grep -v "^PORT$" | tr '\n' ',' | sed 's/,$//')
    if [ ! -z "$CURRENT_ENV" ]; then
        # Update service to remove PORT, keeping other env vars
        gcloud run services update ${SERVICE_NAME} \
            --region ${REGION} \
            --remove-env-vars PORT 2>/dev/null || true
    fi
fi

# Deploy (PORT is automatically set by Cloud Run - do NOT include it in --set-env-vars)
# Use --update-env-vars to merge with existing vars instead of replacing all
gcloud run deploy ${SERVICE_NAME} \
    --image gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --min-instances 1 \
    --max-instances 10 \
    --memory 2Gi \
    --cpu 2 \
    --timeout 300 \
    --update-env-vars "NODE_ENV=production,CONTACT_EMAIL=connect@shreyaschate.dev,FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>" \
    --update-secrets "RESEND_API_KEY=resend-api-key:latest" \
    --port 8080 \
    --quiet

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')
echo -e "${GREEN}✅ Cloud Run service deployed at: ${SERVICE_URL}${NC}"

# Update firebase.json with the service URL (if needed)
echo -e "${YELLOW}📝 Updating Firebase configuration...${NC}"

# Deploy Firebase Hosting (this will proxy to Cloud Run)
echo -e "${YELLOW}🌐 Deploying Firebase Hosting...${NC}"
firebase deploy --only hosting

# Clean up temporary file
rm -f cloud-run-deploy.yaml

echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Your portfolio is live on Firebase Hosting${NC}"
echo -e "${GREEN}🔗 Cloud Run service: ${SERVICE_URL}${NC}"
echo -e "\n${YELLOW}📝 Note: Make sure your Firebase Hosting is configured to proxy to Cloud Run${NC}"
echo -e "${YELLOW}   Update firebase.json if needed to point to the correct service.${NC}"
