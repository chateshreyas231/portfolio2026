#!/bin/bash

# Clear Next.js cache and restart dev server

echo "🧹 Clearing Next.js cache..."
rm -rf .next

echo "🧹 Clearing node_modules/.cache..."
rm -rf node_modules/.cache

echo "🛑 Killing any processes on ports 3000 and 3001..."
lsof -ti:3000,3001 2>/dev/null | xargs kill -9 2>/dev/null || true

echo "🧹 Clearing browser cache hint..."
echo "⚠️  Make sure to hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)"
echo "⚠️  Make sure you're visiting http://localhost:3000 (not 3001)"

echo ""
echo "🚀 Restarting dev server on port 3000..."
echo ""

PORT=3000 npm run dev

