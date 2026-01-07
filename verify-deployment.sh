#!/bin/bash

# Script to verify deployment and check what's actually deployed

echo "🔍 Verifying Deployment Status"
echo "================================"
echo ""

# Check latest commit
echo "📝 Latest Local Commit:"
git log --oneline -1
echo ""

# Check if pushed
echo "📤 Checking if pushed to origin:"
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "not set")

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "✅ Local and remote are in sync"
else
  echo "⚠️  Local and remote are different!"
  echo "   Local:  $LOCAL"
  echo "   Remote: $REMOTE"
  echo "   Run: git push origin main"
fi
echo ""

# Check Cloud Run service
echo "☁️  Cloud Run Service Info:"
echo "   Service: portfolio-app"
echo "   Region: us-central1"
echo "   Check: https://console.cloud.google.com/run/detail/us-central1/portfolio-app"
echo ""

# Check Firebase Hosting
echo "🔥 Firebase Hosting:"
echo "   Site: shreyaschate.com"
echo "   Check: https://console.firebase.google.com/project/portfolio2024-b95ee/hosting"
echo ""

# Check GitHub Actions
echo "🔄 GitHub Actions:"
echo "   Check: https://github.com/chateshreyas231/portfolio2026/actions"
echo ""

echo "🧪 Testing Steps:"
echo "1. Open site in Incognito/Private window"
echo "2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
echo "3. Check browser console (F12) for errors"
echo "4. Check Network tab - look for Cache-Control headers"
echo ""

echo "📋 To Force Clear Cache:"
echo "1. Open DevTools (F12)"
echo "2. Right-click refresh button"
echo "3. Select 'Empty Cache and Hard Reload'"
echo ""

