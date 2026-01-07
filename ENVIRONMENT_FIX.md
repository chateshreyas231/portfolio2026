# Environment Variables Fix - Local vs Production

## 🔍 Issues Found

### 1. Missing Environment Variables in Docker Build
- `NEXT_PUBLIC_*` variables need to be available at **build time** (not just runtime)
- Docker build wasn't receiving these variables
- This could cause client-side code to fail or use wrong values

### 2. Missing OPENAI_API_KEY in Cloud Run
- OPENAI_API_KEY was missing from Cloud Run environment variables
- Needed for TTS (text-to-speech) and transcription

### 3. Build vs Runtime Variables
- **Build-time**: `NEXT_PUBLIC_*` (embedded in client bundle)
- **Runtime**: `OPENAI_API_KEY`, `GROQ_API_KEY` (server-side only)

## ✅ Fixes Applied

### 1. Updated Dockerfile
- Added `ARG` and `ENV` for `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- Added `ARG` and `ENV` for `NEXT_PUBLIC_FIREBASE_API_KEY`
- These are now passed during Docker build

### 2. Updated CI/CD Workflow
- Added `--build-arg` flags to pass Firebase env vars to Docker build
- Added `OPENAI_API_KEY` to Cloud Run environment variables
- Both build-time and runtime vars are now properly set

### 3. Environment Variable Flow

**Build Time (Docker):**
```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID  # Passed via --build-arg
NEXT_PUBLIC_FIREBASE_API_KEY      # Passed via --build-arg
BUILD_TIMESTAMP                   # Passed via --build-arg
BUILD_VERSION                     # Passed via --build-arg
GIT_COMMIT                        # Passed via --build-arg
```

**Runtime (Cloud Run):**
```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID  # Also set at runtime (redundant but safe)
NEXT_PUBLIC_FIREBASE_API_KEY     # Also set at runtime (redundant but safe)
OPENAI_API_KEY                    # Runtime only (server-side)
GROQ_API_KEY                      # Runtime only (server-side)
NODE_ENV=production               # Runtime
```

## 🧪 Testing

After deployment, verify:

1. **Check build info:**
   ```
   https://shreyaschate.com/api/debug/build-info
   ```

2. **Test AI widget:**
   - Should connect to Firebase
   - Should use Groq API
   - Should use OpenAI for TTS/transcription

3. **Check browser console:**
   - No Firebase connection errors
   - No missing API key errors

## 📋 Required GitHub Secrets

Make sure these are set in GitHub Secrets:
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `GROQ_API_KEY`
- ✅ `OPENAI_API_KEY`
- ✅ `GCP_SA_KEY`
- ✅ `FIREBASE_TOKEN`
- ✅ `RESEND_API_KEY` (in Secret Manager)

## 🔧 Making Repo Private

To make your GitHub repo private:

1. Go to: https://github.com/chateshreyas231/portfolio2026/settings
2. Scroll down to "Danger Zone"
3. Click "Change visibility"
4. Select "Make private"
5. Confirm

**Note:** Making it private won't affect:
- GitHub Actions (will still work)
- Secrets (will still work)
- Deployment (will still work)

## 🚀 Next Steps

1. **Push the fixes:**
   ```bash
   git push origin main
   ```

2. **Wait for deployment** (5-10 minutes)

3. **Verify:**
   - Check `/api/debug/build-info` for build version
   - Test AI widget functionality
   - Check browser console for errors

4. **Make repo private** (optional, see above)

