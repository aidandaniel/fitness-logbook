# GitHub Pages Deployment Guide

This guide will help you deploy your Fitness Logbook app to GitHub Pages without exposing your API keys.

## Prerequisites

1. A GitHub repository for your project
2. Your InsForge API credentials:
   - `VITE_INSFORGE_BASE_URL` - Your InsForge backend URL
   - `VITE_INSFORGE_ANON_KEY` - Your InsForge anonymous key

## Step 1: Set Up GitHub Secrets

GitHub Secrets allow you to store sensitive information securely that will be used during the build process.

### How to Add Secrets:

1. Go to your GitHub repository
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add the following secrets:

   **Secret 1:**
   - Name: `VITE_INSFORGE_BASE_URL`
   - Value: Your InsForge backend URL (e.g., `https://vv92gt6j.us-east.insforge.app`)

   **Secret 2:**
   - Name: `VITE_INSFORGE_ANON_KEY`
   - Value: Your InsForge anonymous key

6. Click **Add secret** for each one

## Step 2: Enable GitHub Pages

1. Go to your repository **Settings**
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. Save the settings

## Step 3: Push Your Code

1. Make sure all your code is committed:
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   ```

2. Push to your main branch:
   ```bash
   git push origin main
   ```

## Step 4: Deploy

The GitHub Actions workflow will automatically:
1. Build your app using the secrets (API keys are injected during build)
2. Deploy to GitHub Pages
3. Make your app available at: `https://YOUR_USERNAME.github.io/fitness-logbook/`

### Manual Deployment

You can also trigger a manual deployment:
1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## Step 5: Verify Deployment

1. Wait for the workflow to complete (check the **Actions** tab)
2. Go to your repository **Settings** → **Pages**
3. You'll see the deployment URL
4. Visit the URL to see your deployed app

## Important Security Notes

✅ **DO:**
- Keep your `.env` file in `.gitignore` (already done)
- Use GitHub Secrets for sensitive data
- Never commit API keys to your repository

❌ **DON'T:**
- Commit `.env` files
- Hardcode API keys in your source code
- Share your GitHub Secrets publicly

## Troubleshooting

### Build Fails
- Check that both secrets are set correctly
- Verify the secret names match exactly: `VITE_INSFORGE_BASE_URL` and `VITE_INSFORGE_ANON_KEY`
- Check the Actions tab for error messages

### App Doesn't Load
- Verify the `base` path in `vite.config.ts` matches your repository name
- Check that GitHub Pages is enabled and using GitHub Actions as the source
- Clear your browser cache

### API Errors
- Verify your API keys are correct in GitHub Secrets
- Check that your InsForge backend is accessible
- Review the browser console for specific error messages

## Updating Your App

Every time you push to the `main` branch, the app will automatically rebuild and redeploy. Your secrets remain secure and are only used during the build process.

## Local Development

For local development, create a `.env` file (not committed to git):

```env
VITE_INSFORGE_BASE_URL=https://your-backend.insforge.app
VITE_INSFORGE_ANON_KEY=your-anon-key-here
```

This file is already in `.gitignore`, so it won't be committed.

