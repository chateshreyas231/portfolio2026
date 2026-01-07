# Fix: Standalone Build Differences

## 🔍 The Problem

When Next.js builds in **standalone mode** (required for Docker), it creates a different file structure than a regular production build:

**Regular Build (`npm start` locally):**
- Uses `.next/` folder directly
- All files in standard locations
- Public folder at `./public`

**Standalone Build (Docker):**
- Creates `.next/standalone/` with minimal server
- Only includes necessary files
- File paths are different
- May not include all public assets correctly

## ✅ The Fix

The Dockerfile has been updated to ensure:
1. Standalone output is copied correctly
2. Static files are in the right location
3. Public folder is accessible

## 🧪 Testing Standalone Build Locally

To test the exact Docker build locally:

```bash
# Build with standalone mode
NODE_ENV=production npm run build

# Check standalone structure
ls -la .next/standalone/

# Run the standalone server (like Docker does)
cd .next/standalone
node server.js
# Visit http://localhost:3000
```

## 🔍 Key Differences

### File Structure

**Regular Production:**
```
.next/
  ├── static/
  ├── server/
  └── ...
public/
```

**Standalone:**
```
.next/standalone/
  ├── server.js
  ├── node_modules/ (minimal)
  └── ...
.next/static/ (copied separately)
public/ (copied separately)
```

### What to Check

1. **Public Assets:**
   - Images, fonts, etc. should be accessible
   - Check if `/favicon.ico` loads
   - Check if images in `/public` load

2. **Static Files:**
   - JavaScript bundles should load
   - CSS files should load
   - Check browser console for 404 errors

3. **API Routes:**
   - Should work the same in both
   - Check `/api/debug/build-info`

## 🚨 Common Issues

### Issue 1: Public Assets Not Loading
**Symptom:** Images, fonts, or other public files return 404
**Fix:** Ensure `public` folder is copied to Docker image root

### Issue 2: Static Files Not Loading
**Symptom:** JavaScript or CSS files return 404
**Fix:** Ensure `.next/static` is copied correctly

### Issue 3: Different Behavior
**Symptom:** Site works locally but not in Docker
**Fix:** Test standalone build locally first

## 📋 Verification Steps

1. **Build standalone locally:**
   ```bash
   NODE_ENV=production npm run build
   cd .next/standalone
   node server.js
   ```

2. **Check what files exist:**
   ```bash
   ls -la .next/standalone/
   ls -la .next/standalone/public/  # Should exist
   ```

3. **Compare with Docker:**
   - Check Docker logs for file structure
   - Verify public folder is accessible
   - Check static files are served

## 🔧 Next Steps

After this fix:
1. Push changes
2. Wait for deployment
3. Test deployed site
4. Compare with standalone local build

