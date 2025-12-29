# How to Find Your InsForge Anon Key

## ⚠️ Important: Admin Key vs Anon Key

**What you're seeing (ik_...):**
- This is the **Admin API Key**
- Has full access to your project
- **DO NOT use this in frontend code**
- Only use for server-side operations or MCP tools

**What you need:**
- **Anon Key** (starts with `eyJ...` - it's a JWT token)
- Safe to use in frontend
- Limited permissions (read-only for public data)

## Where to Find Anon Key

The anon key might be in a different section of your InsForge dashboard:

### Option 1: Check Other Dashboard Sections
1. Look for tabs like:
   - **"API Keys"** or **"Credentials"**
   - **"Client Keys"** or **"Public Keys"**
   - **"SDK Configuration"**

### Option 2: Check API Documentation
1. Go to: `https://vv92gt6j.us-east.insforge.app/api/docs`
2. Look for authentication/API key information
3. The anon key might be documented there

### Option 3: Use the Anon Key from BACKEND_SETUP.md
The anon key in `BACKEND_SETUP.md` was generated when we set up your backend:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxOTN9.RO1uzmfg3LM0p0J-briZL1C4rEpPoq0I2pZk-3wQxEE
```

**Try this one first** - it should still work if it hasn't been rotated.

### Option 4: Check InsForge Documentation
- Visit https://insforge.dev/docs
- Look for "Getting Started" or "API Keys" documentation
- Find instructions for getting the anon key

## Quick Test

1. Use the anon key from `BACKEND_SETUP.md` in your `.env` file
2. Test locally: `npm run dev`
3. Try to sign in
4. If it works, use that same key in GitHub Secrets

## What to Use Where

**GitHub Secrets (for deployment):**
- `VITE_INSFORGE_BASE_URL` = `https://vv92gt6j.us-east.insforge.app`
- `VITE_INSFORGE_ANON_KEY` = The anon key (JWT token starting with `eyJ...`)

**NOT the Admin Key (ik_...)** - that stays in your dashboard only!

