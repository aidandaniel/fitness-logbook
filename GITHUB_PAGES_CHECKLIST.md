# GitHub Pages Setup Checklist

## ✅ Step 1: Add GitHub Secrets

Go to: https://github.com/aidandaniel/fitness-logbook/settings/secrets/actions

**Required Secrets:**
- [ ] `VITE_INSFORGE_BASE_URL` = `https://vv92gt6j.us-east.insforge.app`
- [ ] `VITE_INSFORGE_ANON_KEY` = (your anon key)

## ✅ Step 2: Enable GitHub Pages

Go to: https://github.com/aidandaniel/fitness-logbook/settings/pages

**Settings:**
- [ ] Source: **GitHub Actions** (NOT "Deploy from a branch")
- [ ] Click **Save**

## ✅ Step 3: Check Workflow Status

Go to: https://github.com/aidandaniel/fitness-logbook/actions

**Check:**
- [ ] Is there a "Deploy to GitHub Pages" workflow?
- [ ] Has it run? (Look for green checkmark ✅ or red X ❌)
- [ ] If it failed, click on it to see the error

## ✅ Step 4: Trigger Deployment

If workflow hasn't run or failed:

1. Go to: https://github.com/aidandaniel/fitness-logbook/actions
2. Click "Deploy to GitHub Pages" on the left
3. Click "Run workflow" button (top right)
4. Select "main" branch
5. Click "Run workflow"

## ✅ Step 5: Wait for Deployment

- Build usually takes 2-5 minutes
- Watch the workflow run in real-time
- When it shows ✅, your site is live!

## ✅ Step 6: Verify Your Site

Once deployment completes:
- Go to: https://github.com/aidandaniel/fitness-logbook/settings/pages
- You should see: "Your site is live at https://aidandaniel.github.io/fitness-logbook/"

## 🐛 Common Issues

### "404 - There isn't a GitHub Pages site here"
- **Cause:** GitHub Pages not enabled or workflow hasn't run
- **Fix:** Complete Steps 1-4 above

### Workflow Fails with "Secrets not found"
- **Cause:** GitHub Secrets not set up
- **Fix:** Add the two secrets in Step 1

### Workflow Fails with Build Error
- **Cause:** Missing dependencies or build issues
- **Fix:** Check the workflow logs for specific errors

### Site loads but shows blank page
- **Cause:** Base path mismatch
- **Fix:** Verify `vite.config.ts` has `base: '/fitness-logbook/'`

