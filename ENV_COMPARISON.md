# Environment Variables: Local vs Deployment Comparison

## 🔍 Current Differences

### Local Build (`npm run build`)
**Environment Source:** `.env.local` file
**Variables Available:**
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (from .env.local)
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY` (from .env.local)
- ✅ `OPENAI_API_KEY` (from .env.local)
- ✅ `GROQ_API_KEY` (from .env.local)
- ✅ `NODE_ENV=production` (when running `npm run build`)
- ✅ Any other vars in `.env.local`

### Deployment Build (GitHub Actions → Docker)
**Step 1: GitHub Actions Build**
**Environment Source:** GitHub Secrets (only for initial build test)
**Variables Available:**
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (from secrets)
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY` (from secrets)
- ❌ `OPENAI_API_KEY` (NOT set - runtime only)
- ❌ `GROQ_API_KEY` (NOT set - runtime only)
- ✅ `NODE_ENV=production`

**Step 2: Docker Build**
**Environment Source:** Docker build args
**Variables Available:**
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (via --build-arg)
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY` (via --build-arg)
- ❌ `OPENAI_API_KEY` (NOT available at build time)
- ❌ `GROQ_API_KEY` (NOT available at build time)
- ✅ `NODE_ENV=production`

**Step 3: Cloud Run Runtime**
**Environment Source:** Cloud Run env vars
**Variables Available:**
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (set at runtime)
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY` (set at runtime)
- ✅ `OPENAI_API_KEY` (set at runtime)
- ✅ `GROQ_API_KEY` (set at runtime)
- ✅ `NODE_ENV=production`

## ⚠️ Potential Issues

1. **Build-time code that uses OPENAI_API_KEY or GROQ_API_KEY**
   - If any code runs at build time and needs these vars, it will fail
   - These should only be used at runtime (server-side API routes)

2. **Different Firebase config values**
   - If `.env.local` has different values than GitHub Secrets, builds will differ

3. **Missing environment variables**
   - Any vars in `.env.local` that aren't in GitHub Secrets won't be available

4. **Standalone mode differences**
   - Local: `npm run build` creates `.next` folder
   - Deployment: Docker build creates `.next/standalone` (different structure)

## 🔧 Solution: Match Local and Deployment

We need to ensure:
1. Same environment variables at build time
2. Same build configuration
3. Same Next.js settings

