# Verify GitHub Secrets Setup

## Current Configuration

**Base URL:** `https://vv92gt6j.us-east.insforge.app`

**Anon Key:** You need to get a fresh one (see below)

## Step 1: Get Fresh Anon Key

The anon key in BACKEND_SETUP.md might be outdated. Get a fresh one:

1. Use the InsForge MCP tool: `get-anon-key`
2. Or get it from your InsForge dashboard

## Step 2: Verify GitHub Secrets

Go to: https://github.com/aidandaniel/fitness-logbook/settings/secrets/actions

**Verify these secrets exist:**
- [ ] `VITE_INSFORGE_BASE_URL` = `https://vv92gt6j.us-east.insforge.app`
- [ ] `VITE_INSFORGE_ANON_KEY` = (your current anon key)

## Step 3: Check Secret Values

**Important:** Make sure:
- No extra spaces before/after the values
- No quotes around the values
- Base URL is exactly: `https://vv92gt6j.us-east.insforge.app` (no trailing slash)
- Anon key is the complete JWT token

## Step 4: Test Locally First

Before deploying, test locally:

1. Create/update `.env` file:
```env
VITE_INSFORGE_BASE_URL=https://vv92gt6j.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=your-fresh-anon-key-here
```

2. Run `npm run dev`
3. Test authentication - does it work locally?
4. If yes, the issue is with GitHub Secrets
5. If no, the issue is with the values themselves

## Step 5: Update GitHub Secrets

If local works but deployed doesn't:
1. Copy the exact values from your working `.env` file
2. Update GitHub Secrets with those exact values
3. Trigger a new deployment

## Common Issues

### Secret Not Set
- Error: "VITE_INSFORGE_BASE_URL is not defined"
- Fix: Add the secret in GitHub

### Wrong Value
- Error: Authentication fails
- Fix: Verify the values match exactly

### Trailing Slash
- Base URL should NOT have trailing slash: `https://vv92gt6j.us-east.insforge.app` ✅
- NOT: `https://vv92gt6j.us-east.insforge.app/` ❌

### Extra Spaces
- Make sure there are no spaces in the secret values

