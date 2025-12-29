# Google OAuth Troubleshooting Guide

## Common Issues and Solutions

### Issue: Google OAuth doesn't work / Redirect fails

## Solution 1: Check Redirect URI Configuration

InsForge uses hosted auth pages, which means:
1. User clicks "Sign In" → Redirects to InsForge auth page
2. User authenticates with Google → Google redirects back to InsForge
3. InsForge redirects back to your app

The redirect URI should automatically match your app's URL, but there might be issues with:

### For Local Development:
- Your app URL: `http://localhost:5173`
- Redirect should work automatically

### For GitHub Pages:
- Your app URL: `https://aidandaniel.github.io/fitness-logbook/`
- Make sure the base path in `vite.config.ts` matches: `base: '/fitness-logbook/'`

## Solution 2: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to sign in with Google
4. Look for any error messages

Common errors:
- `redirect_uri_mismatch` - Redirect URI not configured
- `CORS error` - Cross-origin issue
- `Network error` - Backend not accessible

## Solution 3: Verify InsForge Backend Configuration

Your backend shows Google OAuth is configured with `useSharedKey: true`, which means:
- InsForge manages the OAuth credentials
- Redirect URIs should be handled automatically
- But you might need to verify the configuration

## Solution 4: Test the Auth Flow

1. Go to your app's landing page
2. Click "Sign In" button
3. You should be redirected to: `https://vv92gt6j.us-east.insforge.app/auth/signin`
4. Click "Sign in with Google"
5. After Google auth, you should be redirected back to your app

If step 5 fails, the redirect URI might not be configured correctly.

## Solution 5: Check Environment Variables

Make sure your `.env` file has:
```env
VITE_INSFORGE_BASE_URL=https://vv92gt6j.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=your-anon-key
```

And restart your dev server after changing `.env`.

## Solution 6: Clear Browser Cache

Sometimes cached redirects can cause issues:
1. Clear browser cache
2. Try in incognito/private mode
3. Try a different browser

## Solution 7: Check Network Tab

1. Open DevTools → Network tab
2. Try to sign in with Google
3. Look for failed requests (red)
4. Check the request/response details

## Still Not Working?

If Google OAuth still doesn't work:

1. **Try GitHub OAuth** - See if that works (helps isolate if it's Google-specific)
2. **Use Email/Password** - As a workaround
3. **Check InsForge Dashboard** - Verify OAuth is enabled
4. **Contact InsForge Support** - If using shared keys, they might need to configure redirect URIs

## Alternative: Use Email/Password Auth

While troubleshooting OAuth, you can use email/password authentication which should work immediately.

