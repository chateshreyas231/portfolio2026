# Debug: Why Changes Don't Appear on Live Site

## Quick Diagnostic Steps

### 1. Check What's Actually Deployed

Visit this URL to see the build version:
```
https://shreyaschate.com/api/debug/build-info
```

Compare with your local build:
```bash
# Local build info
node -e "console.log(require('./lib/buildInfo.ts'))"
```

### 2. Verify Deployment Completed

1. **Check GitHub Actions:**
   - Go to: https://github.com/chateshreyas231/portfolio2026/actions
   - Check latest workflow run
   - Verify all steps completed (green checkmarks)
   - Check for any errors

2. **Check Cloud Run:**
   - Go to: https://console.cloud.google.com/run/detail/us-central1/portfolio-app
   - Check "Revisions" tab
   - Verify latest revision is active
   - Check deployment timestamp

3. **Check Firebase Hosting:**
   - Go to: https://console.firebase.google.com/project/portfolio2024-b95ee/hosting
   - Check latest deployment
   - Verify it's pointing to latest Cloud Run revision

### 3. Clear All Caches

**Browser Cache:**
- Open DevTools (F12)
- Right-click refresh → "Empty Cache and Hard Reload"
- Or use Incognito/Private window

**Firebase CDN Cache:**
- The `--force` flag in deployment should clear this
- Or manually redeploy: `firebase deploy --only hosting --force`

### 4. Verify Files Are in Docker Build

The Dockerfile copies all files with `COPY . .`, but check:
- Are your changed files in the repo? (`git status`)
- Are they committed? (`git log`)
- Are they pushed? (`git log origin/main`)

## Common Issues

### Issue 1: Browser Cache
**Symptom:** Local works, live site shows old version
**Fix:** Hard refresh (Cmd+Shift+R) or use Incognito

### Issue 2: Firebase CDN Cache
**Symptom:** Changes deployed but not visible
**Fix:** Wait 5-10 minutes OR force redeploy with `--force` flag

### Issue 3: Cloud Run Not Updating
**Symptom:** Build succeeds but service shows old version
**Fix:** 
- Check Cloud Run revisions
- Verify new revision is active
- Check environment variables are set

### Issue 4: Build Not Including Changes
**Symptom:** Files changed but Docker build doesn't see them
**Fix:**
- Verify files are committed and pushed
- Check `.dockerignore` doesn't exclude them
- Rebuild Docker image

## Test Commands

```bash
# 1. Check what's committed
git log --oneline -5

# 2. Check if pushed
git log origin/main --oneline -5

# 3. Check build info locally
npm run build
node -e "console.log(require('./lib/buildInfo.ts'))"

# 4. Test production build locally
npm run dev:prod
# Visit http://localhost:3000/api/debug/build-info
```

## Verify Deployment

After pushing, check:
1. GitHub Actions completed successfully
2. Cloud Run has new revision
3. Build info endpoint shows new version
4. Hard refresh browser
5. Check in Incognito window

## Still Not Working?

1. **Check build logs** in GitHub Actions
2. **Check Cloud Run logs** for errors
3. **Compare build info** between local and live
4. **Check environment variables** are set correctly
5. **Verify Docker image** was built with latest code

