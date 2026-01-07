# Troubleshooting: Deployed Site Not Matching Local

## 🔍 Step-by-Step Diagnosis

### Step 1: Verify Deployment Actually Happened

1. **Check GitHub Actions:**
   - Go to: https://github.com/chateshreyas231/portfolio2026/actions
   - Find the latest workflow run
   - Verify it completed successfully (green checkmarks)
   - Check the timestamp - should be recent

2. **Check Build Info Endpoint:**
   - Visit: `https://shreyaschate.com/api/debug/build-info`
   - This shows the actual build version deployed
   - Compare with your latest commit hash

3. **Check Cloud Run:**
   - Go to: https://console.cloud.google.com/run/detail/us-central1/portfolio-app
   - Check "Revisions" tab
   - Latest revision should have recent timestamp
   - Verify it's "Active" (100% traffic)

### Step 2: Clear All Caches

**Browser Cache:**
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. OR use Incognito/Private window

**Firebase CDN Cache:**
- The deployment uses `--force` flag which should clear cache
- If still cached, wait 5-10 minutes for CDN propagation

### Step 3: Compare Environment Variables

**Run diagnostic script:**
```bash
chmod +x scripts/diagnose-deployment.sh
./scripts/diagnose-deployment.sh
```

**Manually check:**
1. Your `.env.local` file:
   ```bash
   cat .env.local | grep NEXT_PUBLIC
   ```

2. GitHub Secrets (should match):
   - Go to: https://github.com/chateshreyas231/portfolio2026/settings/secrets/actions
   - Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches
   - Verify `NEXT_PUBLIC_FIREBASE_API_KEY` matches

### Step 4: Test Production Build Locally

This will show you exactly what production looks like:

```bash
# Build with production settings
./scripts/build-local-prod.sh

# Or manually:
NODE_ENV=production npm run build
npm start

# Visit http://localhost:3000
# Compare with deployed site
```

### Step 5: Check for Specific Differences

**What exactly is different?**
- [ ] UI/Design looks different
- [ ] Features don't work (AI widget, etc.)
- [ ] Content is different
- [ ] Performance is different
- [ ] Errors in browser console

**For each difference, check:**

#### UI/Design Different
- Check if CSS is loading: DevTools → Network → Filter "CSS"
- Check for CSS errors in console
- Verify Tailwind is building correctly

#### Features Don't Work
- Check browser console for errors
- Check Network tab for failed API calls
- Verify environment variables are set correctly
- Check if API routes are accessible

#### Content Different
- Check if data is coming from Firebase
- Verify Firebase connection in console
- Check if profile data is loading

## 🚨 Most Common Issues

### Issue 1: Old Deployment Still Active
**Symptom:** Changes pushed but site shows old version
**Fix:**
1. Check GitHub Actions - did deployment complete?
2. Check Cloud Run - is new revision active?
3. Wait 5-10 minutes for propagation
4. Clear browser cache

### Issue 2: Environment Variables Mismatch
**Symptom:** Features work locally but not deployed
**Fix:**
1. Compare `.env.local` with GitHub Secrets
2. Update GitHub Secrets to match
3. Trigger new deployment

### Issue 3: Browser Cache
**Symptom:** Site shows old version even after deployment
**Fix:**
1. Use Incognito/Private window
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Clear browser cache completely

### Issue 4: Build Differences
**Symptom:** Local build works, deployment fails or looks different
**Fix:**
1. Test production build locally: `./scripts/build-local-prod.sh`
2. Compare build output
3. Check for build errors in GitHub Actions logs

## 🔧 Quick Fixes

### Force New Deployment
```bash
# Create empty commit to trigger deployment
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### Verify What's Deployed
```bash
# Check build info
curl https://shreyaschate.com/api/debug/build-info

# Compare with local commit
git log --oneline -1
```

### Test Production Locally
```bash
# This matches deployment exactly
./scripts/build-local-prod.sh
npm start
# Visit http://localhost:3000
```

## 📋 Checklist

Before reporting issues, verify:
- [ ] Latest code is pushed to GitHub
- [ ] GitHub Actions deployment completed successfully
- [ ] Cloud Run has new active revision
- [ ] Browser cache cleared (or using Incognito)
- [ ] Environment variables match between local and GitHub Secrets
- [ ] Production build works locally (`./scripts/build-local-prod.sh`)
- [ ] Build info endpoint shows latest version

## 🆘 Still Not Working?

1. **Check GitHub Actions logs:**
   - Look for errors in build step
   - Check if environment variables are set
   - Verify Docker build succeeded

2. **Check Cloud Run logs:**
   - Go to Cloud Run console
   - Check "Logs" tab
   - Look for errors or warnings

3. **Check browser console:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

4. **Compare build outputs:**
   - Local: `.next/` folder
   - Deployed: Check what's actually served
   - Use build info endpoint to verify version

## 📞 Next Steps

If none of the above works:
1. Run diagnostic script: `./scripts/diagnose-deployment.sh`
2. Check specific error messages
3. Compare local production build with deployed site
4. Verify all environment variables match

