# GitHub Actions Workflows

## Required Secrets

To use the CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

### How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Required Secrets

1. **`GCP_SA_KEY`** - Google Cloud Service Account JSON key
   - Create a service account in Google Cloud Console
   - Grant it the following roles:
     - Cloud Run Admin
     - Service Account User
     - Storage Admin (for GCR)
     - Secret Manager Admin
   - Download the JSON key and paste it as the secret value

2. **`FIREBASE_TOKEN`** - Firebase CI Token
   - Run `firebase login:ci` locally (requires Firebase CLI)
   - Copy the generated token and paste it as the secret value
   - Or generate from: Firebase Console → Project Settings → Service Accounts → Generate new private key

3. **`RESEND_API_KEY`** - Resend API key for email functionality
   - Get from your Resend account dashboard
   - Format: `re_xxxxxxxxxxxxx`

4. **`NEXT_PUBLIC_FIREBASE_PROJECT_ID`** - Firebase Project ID
   - Your Firebase project ID (e.g., `portfolio2024-b95ee`)

5. **`NEXT_PUBLIC_FIREBASE_API_KEY`** - Firebase Web API Key
   - Found in Firebase Console → Project Settings → General → Your apps

### Optional Secrets (for AI features)

6. **`OPENAI_API_KEY`** - OpenAI API key (optional, for AI widget features)

## Workflow

The `deploy.yml` workflow:
1. Builds the Next.js application
2. Builds and pushes Docker image to Google Container Registry
3. Deploys to Cloud Run
4. Deploys to Firebase Hosting

The workflow runs automatically on every push to `main` branch, or can be triggered manually.

