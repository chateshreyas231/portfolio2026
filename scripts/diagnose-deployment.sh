#!/bin/bash

# Diagnostic script to compare local vs deployed site

echo "🔍 Deployment Diagnostic Tool"
echo "=============================="
echo ""

# Check local build
echo "📦 Local Build Status:"
if [ -d ".next" ]; then
  echo "   ✅ .next folder exists"
  if [ -d ".next/standalone" ]; then
    echo "   ✅ Standalone mode enabled (production build)"
  else
    echo "   ⚠️  Standalone mode NOT enabled (dev build)"
  fi
else
  echo "   ❌ No .next folder - run 'npm run build' first"
fi
echo ""

# Check environment variables
echo "🔐 Environment Variables:"
if [ -f ".env.local" ]; then
  echo "   ✅ .env.local exists"
  if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local; then
    PROJECT_ID=$(grep "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
    echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${PROJECT_ID:0:30}..."
  else
    echo "   ❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local"
  fi
  if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
    echo "   ✅ NEXT_PUBLIC_FIREBASE_API_KEY: Set"
  else
    echo "   ❌ NEXT_PUBLIC_FIREBASE_API_KEY not found in .env.local"
  fi
else
  echo "   ❌ .env.local not found"
fi
echo ""

# Check git status
echo "📝 Git Status:"
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null || echo "unknown")

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
  echo "   ✅ Local and remote are in sync"
  echo "   Commit: ${LOCAL_COMMIT:0:7}"
else
  echo "   ⚠️  Local and remote differ!"
  echo "   Local:  ${LOCAL_COMMIT:0:7}"
  echo "   Remote: ${REMOTE_COMMIT:0:7}"
fi
echo ""

# Check deployment status
echo "🌐 Deployment Check:"
echo "   1. Check GitHub Actions:"
echo "      https://github.com/chateshreyas231/portfolio2026/actions"
echo ""
echo "   2. Check Cloud Run:"
echo "      https://console.cloud.google.com/run/detail/us-central1/portfolio-app"
echo ""
echo "   3. Check Build Info (deployed site):"
echo "      https://shreyaschate.com/api/debug/build-info"
echo ""

# Check for differences
echo "🔍 Common Issues:"
echo ""
echo "   If site looks different, check:"
echo "   1. Browser cache - use Incognito window"
echo "   2. Firebase config - verify GitHub Secrets match .env.local"
echo "   3. Build version - check /api/debug/build-info endpoint"
echo "   4. Deployment status - verify latest deployment completed"
echo ""

# Test production build locally
echo "🧪 To test production build locally:"
echo "   ./scripts/build-local-prod.sh"
echo "   npm start"
echo "   # Then visit http://localhost:3000"
echo ""

