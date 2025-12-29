# Fix OAuth Redirect for GitHub Pages

## The Problem
InsForge OAuth redirects to `aidandaniel.github.io/` instead of `aidandaniel.github.io/fitness-logbook/`

## Solution: Configure Redirect URI in InsForge Client

The InsForge SDK might need to know about the base path. Let's try configuring it:

### Option 1: Add redirectTo to createClient

```typescript
export const insforge = createClient({
  baseUrl,
  anonKey,
  redirectTo: window.location.origin + '/fitness-logbook/',
});
```

### Option 2: Use Environment Variable

Add to `.env`:
```env
VITE_APP_BASE_URL=https://aidandaniel.github.io/fitness-logbook
```

Then in `insforge.ts`:
```typescript
const redirectTo = import.meta.env.VITE_APP_BASE_URL || window.location.origin + '/fitness-logbook/';

export const insforge = createClient({
  baseUrl,
  anonKey,
  redirectTo,
});
```

### Option 3: Check InsForge Dashboard

Make sure in InsForge dashboard:
- **Redirect URL After Sign In**: `https://aidandaniel.github.io/fitness-logbook/`
- Save the configuration
- Wait a few minutes for changes to propagate

### Option 4: Multiple Redirect URLs

Some systems need both with and without trailing slash:
- `https://aidandaniel.github.io/fitness-logbook/`
- `https://aidandaniel.github.io/fitness-logbook`

## Testing

After making changes:
1. Clear browser cache
2. Try in incognito mode
3. Test OAuth flow
4. Check browser console for errors

