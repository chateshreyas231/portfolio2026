# CI/CD Pipeline Setup Guide

## ✅ What's Been Configured

A GitHub Actions workflow has been created at `.github/workflows/deploy.yml` that will automatically:
1. Build your Next.js application
2. Build and push Docker image to Google Container Registry
3. Deploy to Cloud Run
4. Deploy to Firebase Hosting

## 🔐 Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### Steps to Add Secrets:

1. Go to your GitHub repository: `https://github.com/chateshreyas231/portfolio2026`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret below

### Required Secrets:

#### 1. **GCP_SA_KEY** (Google Cloud Service Account JSON)
   - **How to get it:**
     1. Go to [Google Cloud Console](https://console.cloud.google.com/)
     2. Navigate to **IAM & Admin** → **Service Accounts**
     3. Click **Create Service Account**
     4. Name it: `github-actions-deployer`
     5. Grant these roles:
        - Cloud Run Admin
        - Service Account User
        - Storage Admin (for Google Container Registry)
        - Secret Manager Admin
        - Firebase Admin
     6. Click **Create Key** → **JSON**
     7. Copy the entire JSON content and paste it as the secret value

#### 2. **FIREBASE_TOKEN** (Firebase CI Token)
   - **How to get it:**
     ```bash
     # Install Firebase CLI if not already installed
     npm install -g firebase-tools
     
     # Login and generate token
     firebase login:ci
     ```
   - Copy the generated token and paste it as the secret value

#### 3. **RESEND_API_KEY** (Resend API Key)
   - **Value:** Your Resend API key from your `.env` file
   - **Format:** `re_xxxxxxxxxxxxx`
   - You mentioned you have this in your `.env` files, so just copy it from there

#### 4. **NEXT_PUBLIC_FIREBASE_PROJECT_ID** (Firebase Project ID)
   - **Value:** `portfolio2024-b95ee`
   - This is your Firebase project ID

#### 5. **NEXT_PUBLIC_FIREBASE_API_KEY** (Firebase Web API Key)
   - **How to get it:**
     1. Go to [Firebase Console](https://console.firebase.google.com/)
     2. Select your project: `portfolio2024-b95ee`
     3. Go to **Project Settings** → **General** tab
     4. Scroll down to **Your apps** section
     5. Find your web app and copy the **API Key**

### Optional Secrets:

#### 6. **OPENAI_API_KEY** (Optional - for AI widget features)
   - Only needed if you want full AI widget functionality

## 🚀 How It Works

The workflow automatically runs when you:
- **Push to `main` branch** - Automatic deployment
- **Manual trigger** - Go to Actions tab → Select workflow → Run workflow

### Workflow Steps:

1. ✅ Checks out your code
2. ✅ Installs dependencies and builds Next.js app
3. ✅ Authenticates to Google Cloud
4. ✅ Builds Docker image
5. ✅ Pushes to Google Container Registry
6. ✅ Creates/updates Resend API key secret in Secret Manager
7. ✅ Deploys to Cloud Run
8. ✅ Deploys to Firebase Hosting

## 📝 Next Steps

1. **Add all the secrets** listed above to your GitHub repository
2. **Push a commit** to trigger the workflow, or manually trigger it from the Actions tab
3. **Monitor the deployment** in the Actions tab

## 🔍 Troubleshooting

### If deployment fails:

1. **Check the Actions tab** for error messages
2. **Verify all secrets are set correctly**
3. **Ensure the service account has all required permissions**
4. **Check that Firebase project ID matches** (`portfolio2024-b95ee`)

### Common Issues:

- **"Permission denied"** → Check service account roles
- **"Secret not found"** → Verify all secrets are added
- **"Firebase authentication failed"** → Regenerate Firebase token
- **"Docker build failed"** → Check Dockerfile syntax

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)

---

**Note:** The workflow is configured to use your existing project ID (`portfolio2024-b95ee`) and region (`us-central1`). If you need to change these, edit `.github/workflows/deploy.yml`.

