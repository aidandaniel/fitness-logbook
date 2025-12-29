# Quick Deployment Checklist

Follow these steps to deploy your Fitness Logbook to GitHub Pages:

## ✅ Step 1: Add GitHub Secrets

1. Go to: `https://github.com/YOUR_USERNAME/fitness-logbook/settings/secrets/actions`
2. Click **"New repository secret"**
3. Add these two secrets:

   **Secret 1:**
   ```
   Name: VITE_INSFORGE_BASE_URL
   Value: https://vv92gt6j.us-east.insforge.app
   ```

   **Secret 2:**
   ```
   Name: VITE_INSFORGE_ANON_KEY
   Value: [Your anon key from BACKEND_SETUP.md]
   ```

## ✅ Step 2: Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/fitness-logbook/settings/pages`
2. Under **"Source"**, select: **"GitHub Actions"**
3. Save

## ✅ Step 3: Push Your Code

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

## ✅ Step 4: Wait for Deployment

1. Go to: `https://github.com/YOUR_USERNAME/fitness-logbook/actions`
2. Watch the workflow run
3. When it completes, your app will be live at:
   `https://YOUR_USERNAME.github.io/fitness-logbook/`

## 🔒 Security Reminders

- ✅ Your `.env` file is already in `.gitignore` - don't commit it!
- ✅ API keys are only used during build, never stored in the repo
- ✅ Secrets are encrypted by GitHub and only accessible during Actions

## 🐛 Troubleshooting

**Build fails?**
- Check that both secrets are set correctly
- Verify secret names match exactly (case-sensitive)

**App doesn't load?**
- Check GitHub Pages settings (must use "GitHub Actions" source)
- Verify the base path matches your repo name in `vite.config.ts`

**Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

