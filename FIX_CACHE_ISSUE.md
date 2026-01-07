# Fix: Website Not Getting Updates After Deployment

## Problem
Deployment completes successfully but website still shows old content.

## Root Causes
1. **Browser Cache** - Your browser cached the old version
2. **Firebase CDN Cache** - Firebase Hosting cached the old version
3. **Aggressive Cache Headers** - Previous config had very long cache times

## ✅ Fixes Applied

### 1. Updated Cache Headers
- **Static assets** (images, fonts): Still cached for 1 year (good for performance)
- **HTML/JS/CSS files**: Now set to `max-age=0, must-revalidate` (always check for updates)
- **All routes**: Cache control updated to allow updates

### 2. Force Deploy in CI/CD
- Deployment now uses `--force` flag to clear Firebase cache

## 🔧 Immediate Fixes

### Option 1: Clear Browser Cache (Try This First!)

**Chrome/Edge:**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: Open DevTools (F12) → Right-click refresh → "Empty Cache and Hard Reload"

**Firefox:**
- Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

**Safari:**
- Press `Cmd+Option+R`

**Or use Incognito/Private window:**
- This bypasses all cache

### Option 2: Force Redeploy Firebase Hosting

Run this locally (if you have Firebase CLI):
```bash
firebase deploy --only hosting --force
```

Or trigger a new deployment:
```bash
git commit --allow-empty -m "Force redeploy to clear cache"
git push origin main
```

### Option 3: Clear Firebase Cache via Console

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `portfolio2024-b95ee`
3. Go to Hosting
4. Click on your site
5. Look for "Clear cache" or redeploy option

## 🧪 Verify Updates Are Live

1. **Check deployment timestamp:**
   - Look at GitHub Actions → Latest deployment
   - Note the deployment time

2. **Check Cloud Run:**
   - Go to: https://console.cloud.google.com/run
   - Check `portfolio-app` service
   - Verify latest revision is active

3. **Test in Incognito:**
   - Open incognito/private window
   - Visit your site
   - Should show latest version

4. **Check version in code:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Reload page
   - Check response headers for `Cache-Control`
   - Should see `max-age=0` for HTML/JS files

## 📝 Files Changed

1. **firebase.json** - Updated cache headers
2. **next.config.js** - Updated cache headers
3. **.github/workflows/deploy.yml** - Added `--force` flag

## 🚀 Next Deployment

The next time you push code:
1. GitHub Actions will deploy with `--force` flag
2. Cache headers will allow updates
3. Browser will check for new version

## ⚠️ Still Not Working?

1. **Wait 5-10 minutes** - CDN propagation can take time
2. **Check Cloud Run directly:**
   - Visit: `https://portfolio-app-753231674328.us-central1.run.app/`
   - If this shows updates but Firebase doesn't, it's a Firebase cache issue
3. **Check browser console** for errors
4. **Verify environment variables** are set correctly

## 🔍 Debug Steps

1. Open DevTools (F12) → Network tab
2. Reload page
3. Check response headers for files:
   - Look for `Cache-Control` header
   - Should see `max-age=0` for HTML/JS
4. Check if files have new timestamps
5. Verify Cloud Run service is updated

