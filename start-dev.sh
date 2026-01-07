#!/bin/bash

# Quick script to start the dev server with proper cleanup

echo "🧹 Cleaning up any existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Port 3000 is free"

echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
fi

echo "🚀 Starting Next.js dev server..."
echo "📍 Server will be available at: http://localhost:3000"
echo ""

# Start dev server
npm run dev

