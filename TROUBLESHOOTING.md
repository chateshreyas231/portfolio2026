# Troubleshooting Guide - CI/CD Pipeline

## 🔴 Repository "portfolio-app" not found

### Problem
The pipeline fails with: `name unknown: Repository "portfolio-app" not found`

### Root Cause
The service account used in GitHub Actions doesn't have permission to create Artifact Registry repositories.

### Solution

#### Step 1: Verify Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Find the service account you're using (the one whose JSON key is in `GCP_SA_KEY` secret)

#### Step 2: Grant Required Permissions
The service account needs these roles:

1. **Artifact Registry Administrator** (to create repositories)
   - Go to the service account → **Permissions** tab
   - Click **Grant Access**
   - Add role: `Artifact Registry Administrator`
   - Click **Save**

2. **Artifact Registry Writer** (to push images)
   - Add role: `Artifact Registry Writer`

3. **Cloud Run Admin** (to deploy services)
   - Add role: `Cloud Run Admin`

4. **Secret Manager Admin** (to manage secrets)
   - Add role: `Secret Manager Admin`

5. **Service Account User** (to use service accounts)
   - Add role: `Service Account User`

#### Step 3: Alternative - Create Repository Manually

If you prefer to create the repository manually:

```bash
gcloud artifacts repositories create portfolio-app \
  --repository-format=docker \
  --location=us-central1 \
  --project=portfolio2024-b95ee \
  --description="Docker repository for portfolio app"
```

Then grant the service account access:

```bash
# Get your service account email
SA_EMAIL="your-service-account@portfolio2024-b95ee.iam.gserviceaccount.com"

# Grant Artifact Registry Writer role
gcloud artifacts repositories add-iam-policy-binding portfolio-app \
  --location=us-central1 \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/artifactregistry.writer" \
  --project=portfolio2024-b95ee
```

#### Step 4: Verify Permissions

Run this command to verify the service account has the right permissions:

```bash
gcloud projects get-iam-policy portfolio2024-b95ee \
  --flatten="bindings[].members" \
  --filter="bindings.members:YOUR_SERVICE_ACCOUNT_EMAIL" \
  --format="table(bindings.role)"
```

You should see:
- `roles/artifactregistry.admin` or `roles/artifactregistry.admin`
- `roles/artifactregistry.writer`
- `roles/run.admin`
- `roles/secretmanager.admin`
- `roles/iam.serviceAccountUser`

## 🔍 Other Common Issues

### Issue: "Permission denied" errors

**Solution**: Ensure all required APIs are enabled:
- Artifact Registry API
- Cloud Run API
- Secret Manager API
- Cloud Build API

### Issue: Docker push fails with authentication errors

**Solution**: 
1. Verify `GCP_SA_KEY` secret is valid JSON
2. Ensure service account has `Artifact Registry Writer` role
3. Check that Artifact Registry API is enabled

### Issue: Cloud Run deployment fails

**Solution**:
1. Verify service account has `Cloud Run Admin` role
2. Check that Cloud Run API is enabled
3. Ensure the Docker image was pushed successfully

### Issue: Firebase deployment fails

**Solution**:
1. Verify `FIREBASE_TOKEN` secret is valid
2. Run `firebase login:ci` locally to generate a new token if needed
3. Ensure Firebase project ID matches: `portfolio2024-b95ee`

## 📋 Quick Permission Checklist

Before running the pipeline, verify:

- [ ] Service account has `Artifact Registry Administrator` role
- [ ] Service account has `Artifact Registry Writer` role
- [ ] Service account has `Cloud Run Admin` role
- [ ] Service account has `Secret Manager Admin` role
- [ ] Service account has `Service Account User` role
- [ ] Artifact Registry API is enabled
- [ ] Cloud Run API is enabled
- [ ] Secret Manager API is enabled
- [ ] All GitHub secrets are set correctly

## 🛠️ Manual Repository Creation (One-Time Setup)

If you want to create the repository once and let the pipeline use it:

```bash
# Set your project
export PROJECT_ID=portfolio2024-b95ee
export REGION=us-central1
export REPO_NAME=portfolio-app

# Create repository
gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --project=$PROJECT_ID \
  --description="Docker repository for portfolio app"

# Verify it was created
gcloud artifacts repositories list --location=$REGION --project=$PROJECT_ID
```

After this, the pipeline will detect the repository exists and skip creation.

## 🔄 Testing the Fix

After granting permissions:

1. Go to GitHub Actions: https://github.com/chateshreyas231/portfolio2026/actions
2. Click **Run workflow** → **Run workflow** (manual trigger)
3. Monitor the logs to see if repository creation succeeds

## 📞 Still Having Issues?

1. Check the GitHub Actions logs for specific error messages
2. Verify service account email matches the one in IAM
3. Ensure the service account JSON key in `GCP_SA_KEY` is valid
4. Try creating the repository manually first (see above)

---

**Last Updated**: $(date)

