# Fix: Local Build vs Deployment Mismatch

## 🔍 Problem

Your local build (`npm run build`) uses `.env.local` which may have different values or additional variables compared to what's deployed.

## ✅ Solution: Ensure Same Environment

### Option 1: Use Script to Match Deployment (Recommended)

I've created a script that builds with the same environment as deployment:

```bash
chmod +x scripts/build-local-prod.sh
./scripts/build-local-prod.sh
```

This script:
- Loads variables from `.env.local`
- Sets `NODE_ENV=production`
- Builds with same settings as deployment
- Shows what's being used

### Option 2: Verify Your .env.local Matches GitHub Secrets

**Required in `.env.local`:**
```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
```

**Optional (runtime only, but good to have locally):**
```bash
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
```

**Verify GitHub Secrets match:**
1. Go to: https://github.com/chateshreyas231/portfolio2026/settings/secrets/actions
2. Check these secrets match your `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `OPENAI_API_KEY` (optional)
   - `GROQ_API_KEY` (optional)

### Option 3: Test Production Build Locally

```bash
# This builds exactly like production
npm run dev:prod
```

This will:
1. Build with `NODE_ENV=production`
2. Use standalone mode (like Docker)
3. Start production server
4. Match deployed version exactly

## 🔍 Key Differences Explained

### Build-Time Variables (Embedded in Client Bundle)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ✅ Must match
- `NEXT_PUBLIC_FIREBASE_API_KEY` ✅ Must match

**These are embedded in the JavaScript bundle at build time.**
**If they differ, the client-side code will use different values!**

### Runtime Variables (Server-Side Only)
- `OPENAI_API_KEY` ⚠️ Only used in API routes
- `GROQ_API_KEY` ⚠️ Only used in API routes

**These are NOT embedded in the bundle.**
**They're only used when API routes are called.**

## 🧪 How to Verify They Match

### 1. Check Build Output
```bash
# Local build
npm run build
# Check .next/static files for embedded values

# Or use the script
./scripts/build-local-prod.sh
```

### 2. Compare Values
```bash
# Check what's in your .env.local
cat .env.local | grep NEXT_PUBLIC

# Compare with what GitHub Secrets should have
# (You'll need to check GitHub UI)
```

### 3. Test Production Build
```bash
npm run dev:prod
# Visit http://localhost:3000
# Check browser console for Firebase connection
# Should match deployed site
```

## 🚨 Common Issues

### Issue 1: Different Firebase Project
**Symptom:** Local works, deployment doesn't connect to Firebase
**Fix:** Ensure `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches in both places

### Issue 2: Different Firebase API Key
**Symptom:** Local works, deployment has auth errors
**Fix:** Ensure `NEXT_PUBLIC_FIREBASE_API_KEY` matches in both places

### Issue 3: Missing Variables
**Symptom:** Build succeeds but features don't work
**Fix:** Check if any `NEXT_PUBLIC_*` vars are missing from GitHub Secrets

## 📋 Checklist

Before deploying, verify:
- [ ] `.env.local` has `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `.env.local` has `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] GitHub Secrets have same values
- [ ] Local build succeeds: `npm run build`
- [ ] Production build test works: `npm run dev:prod`
- [ ] Firebase connection works in production build test

## 🔧 Quick Fix

If builds are different:

1. **Check your .env.local:**
   ```bash
   cat .env.local
   ```

2. **Update GitHub Secrets to match:**
   - Go to GitHub Settings → Secrets → Actions
   - Update `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - Update `NEXT_PUBLIC_FIREBASE_API_KEY`

3. **Rebuild and redeploy:**
   ```bash
   git commit --allow-empty -m "Trigger rebuild with correct env vars"
   git push origin main
   ```

4. **Verify:**
   - Check `/api/debug/build-info` on deployed site
   - Compare with local build

