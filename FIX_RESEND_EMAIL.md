# Fix: Resend Email Service Not Working

## 🔍 Common Issues

### Issue 1: RESEND_API_KEY Not Set
**Symptom:** "Email service not configured" error
**Fix:**
1. Get your Resend API key from: https://resend.com/api-keys
2. Add to GitHub Secrets: `RESEND_API_KEY`
3. Verify it's in Secret Manager: `resend-api-key`

### Issue 2: FROM_EMAIL Domain Not Verified
**Symptom:** "Domain not verified" or "Unauthorized" error
**Current FROM_EMAIL:** `Portfolio Contact <onboarding@resend.dev>`

**Fix Options:**

**Option A: Use Verified Domain (Recommended)**
1. Go to Resend Dashboard: https://resend.com/domains
2. Add and verify your domain (e.g., `shreyaschate.dev`)
3. Update FROM_EMAIL to use your domain:
   ```
   Portfolio Contact <noreply@shreyaschate.dev>
   ```
   Or:
   ```
   Shreyas Chate <connect@shreyaschate.dev>
   ```

**Option B: Keep Using onboarding@resend.dev**
- This should work for testing, but may have limitations
- Make sure your Resend account is fully set up

### Issue 3: Secret Manager Configuration
**Symptom:** API key not accessible in Cloud Run
**Fix:**
1. Verify secret exists:
   ```bash
   gcloud secrets describe resend-api-key --project=portfolio2024-b95ee
   ```
2. Verify service account has access:
   ```bash
   gcloud secrets get-iam-policy resend-api-key --project=portfolio2024-b95ee
   ```

### Issue 4: FROM_EMAIL Format
**Current:** `Portfolio Contact <onboarding@resend.dev>`
**Note:** The format is correct, but the domain must be verified in Resend

## ✅ Quick Fixes

### Fix 1: Verify GitHub Secret
1. Go to: https://github.com/chateshreyas231/portfolio2026/settings/secrets/actions
2. Check `RESEND_API_KEY` exists
3. Verify it matches your Resend API key

### Fix 2: Verify Secret Manager
1. Go to: https://console.cloud.google.com/security/secret-manager
2. Check `resend-api-key` exists
3. Verify latest version has the correct key

### Fix 3: Update FROM_EMAIL (if you have verified domain)
If you've verified `shreyaschate.dev` in Resend, update:
- `.env.local`: `FROM_EMAIL=Shreyas Chate <noreply@shreyaschate.dev>`
- Cloud Run env var in deployment workflow
- Or use: `connect@shreyaschate.dev` (if verified)

### Fix 4: Check Resend Dashboard
1. Go to: https://resend.com/emails
2. Check if emails are being sent
3. Look for error messages
4. Check API key status

## 🧪 Testing

### Test Locally:
```bash
# Make sure .env.local has:
RESEND_API_KEY=re_your_actual_key_here
FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
CONTACT_EMAIL=connect@shreyaschate.dev

# Test the API:
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### Check Cloud Run Logs:
1. Go to: https://console.cloud.google.com/run/detail/us-central1/portfolio-app/logs
2. Look for Resend errors
3. Check for "Resend Direct Error" or "Resend API Error"

## 📋 Checklist

- [ ] `RESEND_API_KEY` is set in GitHub Secrets
- [ ] `resend-api-key` exists in Secret Manager
- [ ] Service account has access to secret
- [ ] FROM_EMAIL domain is verified in Resend (if using custom domain)
- [ ] Resend API key is valid and active
- [ ] Check Cloud Run logs for specific error messages

## 🔧 Enhanced Error Handling

I've added better error logging that will show:
- Whether API key is set
- FROM_EMAIL being used
- Specific Resend error messages
- This will help identify the exact issue

## 🚀 Next Steps

1. **Check Cloud Run logs** for the specific error
2. **Verify Resend API key** is correct
3. **Check Resend dashboard** for domain verification
4. **Update FROM_EMAIL** if you have a verified domain
5. **Test locally** with your API key

