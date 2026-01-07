#!/bin/bash

# Test standalone build to match Docker exactly

echo "🧪 Testing Standalone Build (matches Docker)"
echo "============================================"
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
echo ""

# Build with production settings
echo "🔨 Building with NODE_ENV=production..."
NODE_ENV=production npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo ""
echo "✅ Build completed"
echo ""

# Check standalone structure
echo "📁 Checking standalone structure..."
if [ -d ".next/standalone" ]; then
  echo "   ✅ .next/standalone exists"
  echo ""
  echo "   Structure:"
  ls -la .next/standalone/ | head -10
  echo ""
  
  if [ -f ".next/standalone/server.js" ]; then
    echo "   ✅ server.js exists"
  else
    echo "   ❌ server.js NOT found!"
  fi
  
  if [ -d ".next/static" ]; then
    echo "   ✅ .next/static exists"
  else
    echo "   ❌ .next/static NOT found!"
  fi
  
  if [ -d "public" ]; then
    echo "   ✅ public folder exists"
  else
    echo "   ❌ public folder NOT found!"
  fi
else
  echo "   ❌ .next/standalone NOT found!"
  echo "   This means standalone mode is not enabled"
  echo "   Check next.config.js - output: 'standalone' should be set"
  exit 1
fi

echo ""
echo "🚀 To test standalone server (like Docker):"
echo "   cd .next/standalone"
echo "   # Copy public and static if needed"
echo "   cp -r ../../public ./public 2>/dev/null || true"
echo "   cp -r ../../.next/static ./.next/static 2>/dev/null || true"
echo "   PORT=3000 node server.js"
echo "   # Then visit http://localhost:3000"
echo ""

