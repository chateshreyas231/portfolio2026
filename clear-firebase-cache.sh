#!/bin/bash

# Clear Firebase Hosting cache and force redeploy

echo "🔥 Clearing Firebase Hosting cache..."
echo ""

# Get project ID
PROJECT_ID="portfolio2024-b95ee"

echo "📋 Project: $PROJECT_ID"
echo ""

# Force redeploy to Firebase Hosting (this clears cache)
echo "🚀 Force redeploying to Firebase Hosting..."
firebase deploy --only hosting --project $PROJECT_ID --force

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Clear your browser cache:"
echo "   - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo "   - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)"
echo "   - Or use Incognito/Private window"
echo ""
echo "🌐 Your site should now show the latest updates!"

