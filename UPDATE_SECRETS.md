# Update GitHub Secrets - Fix Authentication

## Current Values (Verified)

**Base URL:** `https://vv92gt6j.us-east.insforge.app`

**Fresh Anon Key:** 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDMxODN9.b9QRIwEEmS7GVC9t7hssbtnou8sIHjokR1n--lkuQmk
```

## Step 1: Update GitHub Secrets

Go to: https://github.com/aidandaniel/fitness-logbook/settings/secrets/actions

### Update Secret 1: VITE_INSFORGE_BASE_URL
1. Click on `VITE_INSFORGE_BASE_URL`
2. Click "Update"
3. Set value to: `https://vv92gt6j.us-east.insforge.app`
4. **Important:** No trailing slash, no quotes, no spaces
5. Click "Update secret"

### Update Secret 2: VITE_INSFORGE_ANON_KEY
1. Click on `VITE_INSFORGE_ANON_KEY` (or create it if it doesn't exist)
2. Click "Update" (or "New repository secret")
3. Set value to:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDMxODN9.b9QRIwEEmS7GVC9t7hssbtnou8sIHjokR1n--lkuQmk
```
4. **Important:** Copy the ENTIRE token, no spaces, no quotes
5. Click "Update secret" (or "Add secret")

## Step 2: Update Local .env File

Also update your local `.env` file to match:

```env
VITE_INSFORGE_BASE_URL=https://vv92gt6j.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDMxODN9.b9QRIwEEmS7GVC9t7hssbtnou8sIHjokR1n--lkuQmk
```

## Step 3: Test Locally

1. Restart your dev server:
```bash
npm run dev
```

2. Test authentication:
   - Go to http://localhost:5173
   - Try signing in with email/password
   - Try signing in with Google
   - Try signing in with GitHub

3. If it works locally, the secrets are correct

## Step 4: Trigger New Deployment

After updating GitHub Secrets:

1. Go to: https://github.com/aidandaniel/fitness-logbook/actions
2. Click "Deploy to GitHub Pages"
3. Click "Run workflow"
4. Select "main" branch
5. Click "Run workflow"

This will rebuild with the new secrets.

## Step 5: Verify Deployment

1. Wait for workflow to complete (2-5 minutes)
2. Go to: https://aidandaniel.github.io/fitness-logbook/
3. Test authentication again

## Troubleshooting

### Still Not Working?

1. **Check browser console** (F12) for errors
2. **Verify secrets are set:**
   - Go to Settings → Secrets → Actions
   - Make sure both secrets exist
   - Check they don't have extra spaces

3. **Test the backend directly:**
   - Visit: https://vv92gt6j.us-east.insforge.app/auth/signin
   - Does the auth page load?

4. **Check network tab:**
   - Open DevTools → Network
   - Try to sign in
   - Look for failed requests
   - Check the request URLs

### Common Mistakes

❌ **Wrong:**
- `VITE_INSFORGE_BASE_URL=https://vv92gt6j.us-east.insforge.app/` (trailing slash)
- `VITE_INSFORGE_BASE_URL="https://vv92gt6j.us-east.insforge.app"` (quotes)
- `VITE_INSFORGE_BASE_URL= https://vv92gt6j.us-east.insforge.app` (leading space)

✅ **Correct:**
- `VITE_INSFORGE_BASE_URL=https://vv92gt6j.us-east.insforge.app` (no quotes, no trailing slash, no spaces)

