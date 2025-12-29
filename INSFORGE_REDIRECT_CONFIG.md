# InsForge Redirect URL Configuration

## The Issue
OAuth redirects to `aidandaniel.github.io/` instead of `aidandaniel.github.io/fitness-logbook/`

## Solution: Configure in InsForge Dashboard

The redirect URL must be configured in your InsForge dashboard. Here's what to check:

### Step 1: Go to Configuration
1. Log into your InsForge dashboard
2. Go to your project settings
3. Navigate to **Configuration** or **Auth Settings**

### Step 2: Set Redirect URL
In the **"Redirect URL After Sign In"** field, set:

```
https://aidandaniel.github.io/fitness-logbook/
```

**Important:**
- Include the full URL with `https://`
- Include the trailing slash `/`
- Make sure there are no extra spaces
- Click **Save** after updating

### Step 3: Wait for Propagation
- Changes might take 1-2 minutes to propagate
- Clear your browser cache
- Try in incognito/private mode

### Step 4: Verify OAuth Provider Settings
If you're using Google or GitHub OAuth, you might also need to check:

**For Google OAuth:**
- The redirect URI in Google Cloud Console should be:
  `https://vv92gt6j.us-east.insforge.app/auth/callback`
- (InsForge handles the callback, not your app)

**For GitHub OAuth:**
- The redirect URI in GitHub OAuth App settings should be:
  `https://vv92gt6j.us-east.insforge.app/auth/callback`

### Step 5: Test
1. Go to: https://aidandaniel.github.io/fitness-logbook/
2. Click "Sign In"
3. Try OAuth (Google/GitHub)
4. After authentication, you should be redirected back to:
   `https://aidandaniel.github.io/fitness-logbook/`

## Troubleshooting

### Still redirecting to wrong URL?
1. **Double-check the redirect URL in InsForge dashboard**
   - Make sure it's exactly: `https://aidandaniel.github.io/fitness-logbook/`
   - No typos, no missing slashes

2. **Check if changes were saved**
   - Refresh the InsForge dashboard page
   - Verify the redirect URL is still set correctly

3. **Try both with and without trailing slash**
   - Some systems need: `https://aidandaniel.github.io/fitness-logbook/`
   - Others need: `https://aidandaniel.github.io/fitness-logbook`
   - Try both if one doesn't work

4. **Check browser console for errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for any error messages

5. **Contact InsForge Support**
   - If using shared OAuth keys, InsForge support might need to configure redirect URIs on their end

## Alternative: Use Custom Domain
If the base path continues to cause issues, consider:
- Using a custom domain (e.g., `fitness-logbook.yourdomain.com`)
- This avoids the `/fitness-logbook/` base path entirely

