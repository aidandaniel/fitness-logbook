# OAuth Debugging Guide

## Current Issue
OAuth authentication redirects to wrong URL on GitHub Pages.

## What to Check

### 1. InsForge Dashboard Configuration
In your InsForge dashboard, check:

**Configuration → Redirect URL After Sign In:**
- Should be: `https://aidandaniel.github.io/fitness-logbook/`
- Make sure there's a trailing slash
- Save the configuration

### 2. OAuth Provider Settings (Google/GitHub)
Each OAuth provider might need its own redirect URI configured:

**For Google OAuth:**
- Go to Google Cloud Console
- Check Authorized redirect URIs
- Should include: `https://vv92gt6j.us-east.insforge.app/auth/callback`
- (InsForge handles the callback, not your app directly)

**For GitHub OAuth:**
- Go to GitHub Settings → Developer settings → OAuth Apps
- Check Authorization callback URL
- Should include: `https://vv92gt6j.us-east.insforge.app/auth/callback`

### 3. Test the Flow
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to sign in with OAuth
4. Check what URL it redirects to
5. Look for any error messages in Console tab

### 4. Check Current Redirect Behavior
When you click "Sign In" → "Sign in with Google/GitHub":
- Where does it redirect you?
- What URL shows in the address bar after OAuth?
- Do you see any error messages?

### 5. Possible Solutions

**Option A: Configure Redirect in SDK Client**
The InsForge SDK might need the redirect URI configured in the client:

```typescript
export const insforge = createClient({
  baseUrl,
  anonKey,
  // Maybe needs redirectTo parameter?
});
```

**Option B: Multiple Redirect URLs**
InsForge might need both:
- `https://aidandaniel.github.io/fitness-logbook/` (with trailing slash)
- `https://aidandaniel.github.io/fitness-logbook` (without trailing slash)

**Option C: Use Custom Domain**
If possible, use a custom domain without a base path to avoid this issue.

## Next Steps
Please provide:
1. What exact URL does OAuth redirect to?
2. Any error messages in browser console?
3. What did you set in InsForge dashboard for "Redirect URL After Sign In"?

