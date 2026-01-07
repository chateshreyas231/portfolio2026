# URL Sync Issue - Cloud Run & Firebase Hosting

## Problem
Both URLs are showing minimal content (just "SC" and "Shreyas Chate"):
- `https://portfolio-app-753231674328.us-central1.run.app/` (Cloud Run - direct)
- `https://shreyaschate.com/` (Firebase Hosting - proxies to Cloud Run)

## Root Cause
Firebase Hosting is correctly configured to proxy to Cloud Run, but Cloud Run is serving an outdated or incomplete build.

## Solution
Trigger a fresh deployment to sync both URLs:

1. **The CI/CD pipeline will:**
   - Build the latest Next.js app with all fixes
   - Deploy to Cloud Run with correct environment variables
   - Deploy Firebase Hosting (which proxies to Cloud Run)

2. **After deployment, both URLs should show the same content**

## Current Configuration

### Firebase Hosting (`firebase.json`)
- Serves static files from `.next/static`
- Proxies all requests (`**`) to Cloud Run service `portfolio-app` in `us-central1`
- This is correct - Firebase Hosting acts as a CDN/proxy to Cloud Run

### Cloud Run
- Service name: `portfolio-app`
- Region: `us-central1`
- Should serve the full Next.js application

## Next Steps
1. Push latest code to trigger deployment
2. Wait for CI/CD pipeline to complete
3. Both URLs should be synced and showing full content

