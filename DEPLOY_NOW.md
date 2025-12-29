# Deploy with Working Authentication ✅

Since authentication works locally, your values are correct! Now update GitHub Secrets and deploy.

## Step 1: Update GitHub Secrets

Go to: https://github.com/aidandaniel/fitness-logbook/settings/secrets/actions

### Update/Create Secret 1: VITE_INSFORGE_BASE_URL
- Value: `https://vv92gt6j.us-east.insforge.app`
- No trailing slash, no quotes

### Update/Create Secret 2: VITE_INSFORGE_ANON_KEY  
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxOTN9.RO1uzmfg3LM0p0J-briZL1C4rEpPoq0I2pZk-3wQxEE`
- Copy the ENTIRE token (it's long)
- No spaces, no quotes

## Step 2: Trigger Deployment

After updating secrets:

1. Go to: https://github.com/aidandaniel/fitness-logbook/actions
2. Click "Deploy to GitHub Pages" (left sidebar)
3. Click "Run workflow" (top right)
4. Select "main" branch
5. Click "Run workflow"

## Step 3: Wait & Test

- Deployment takes 2-5 minutes
- When complete, test at: https://aidandaniel.github.io/fitness-logbook/
- Authentication should now work! 🎉

