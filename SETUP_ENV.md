# Setup Environment Variables

## Local .env File

Create or update your `.env` file with these values:

```env
VITE_INSFORGE_BASE_URL=https://vv92gt6j.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxOTN9.RO1uzmfg3LM0p0J-briZL1C4rEpPoq0I2pZk-3wQxEE
```

## GitHub Secrets

Update these in: https://github.com/aidandaniel/fitness-logbook/settings/secrets/actions

**Secret 1: VITE_INSFORGE_BASE_URL**
```
https://vv92gt6j.us-east.insforge.app
```

**Secret 2: VITE_INSFORGE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxOTN9.RO1uzmfg3LM0p0J-briZL1C4rEpPoq0I2pZk-3wQxEE
```

## After Updating

1. **Local:** Restart dev server (`npm run dev`)
2. **GitHub:** Trigger new deployment in Actions tab

