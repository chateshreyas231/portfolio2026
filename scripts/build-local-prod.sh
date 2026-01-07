#!/bin/bash

# Script to build locally with same environment as deployment
# This ensures local build matches production build

echo "🔨 Building with production environment (matching deployment)..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "❌ Error: .env.local file not found"
  echo "Please create .env.local with required environment variables"
  exit 1
fi

# Export environment variables from .env.local
set -a
source .env.local
set +a

# Verify required variables are set
if [ -z "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" ]; then
  echo "⚠️  Warning: NEXT_PUBLIC_FIREBASE_PROJECT_ID not set"
fi

if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
  echo "⚠️  Warning: NEXT_PUBLIC_FIREBASE_API_KEY not set"
fi

echo "📦 Environment variables loaded from .env.local"
echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID:0:20}..."
echo "   NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY:0:20}..."
echo ""

# Set production mode
export NODE_ENV=production

# Build
echo "🔨 Running Next.js build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build completed successfully!"
  echo ""
  echo "📋 Build output:"
  echo "   - .next/ folder created"
  echo "   - Standalone mode: $(if [ -d ".next/standalone" ]; then echo "✅ Enabled"; else echo "❌ Not enabled (check next.config.js)"; fi)"
  echo ""
  echo "🧪 To test production build locally:"
  echo "   npm start"
else
  echo ""
  echo "❌ Build failed!"
  exit 1
fi

