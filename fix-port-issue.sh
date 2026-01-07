#!/bin/bash

# Quick fix script to remove PORT from existing Cloud Run service

PROJECT_ID="${FIREBASE_PROJECT_ID:-portfolio2024-b95ee}"
REGION="${CLOUD_RUN_REGION:-us-central1}"
SERVICE_NAME="portfolio-app"

echo "Removing PORT environment variable from Cloud Run service..."

# Remove PORT env var if service exists
if gcloud run services describe ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID} &>/dev/null; then
    echo "Service found. Removing PORT env var..."
    gcloud run services update ${SERVICE_NAME} \
        --region ${REGION} \
        --project ${PROJECT_ID} \
        --remove-env-vars PORT \
        --quiet
    
    if [ $? -eq 0 ]; then
        echo "✅ PORT removed successfully!"
        echo "Now you can run ./deploy-firebase.sh"
    else
        echo "❌ Failed to remove PORT. Trying to delete and recreate service..."
        echo "Deleting service..."
        gcloud run services delete ${SERVICE_NAME} \
            --region ${REGION} \
            --project ${PROJECT_ID} \
            --quiet
        echo "✅ Service deleted. Now run ./deploy-firebase.sh to create a new one."
    fi
else
    echo "Service doesn't exist yet. You can run ./deploy-firebase.sh directly."
fi

