# InsForge Support - Database API 404 Errors

## Problem
All database operations return **404 errors** after upgrading to SDK v1.0.8 and removing `anonKey`.

## Error
```
POST https://vv92gt6j.us-east.insforge.app/api/database/records/workout_templates?select=* 
→ 404 (Not Found)
```

**All database requests fail:**
- `workout_templates` → 404
- `user_settings` → 404  
- `workout_logs` → 404
- `fitness_goals` → 404
- `personal_records` → 404
- `progress_photos` → 404

## Configuration
- **SDK**: `@insforge/sdk@1.0.8`, `@insforge/react@1.1.0`
- **Backend**: `https://vv92gt6j.us-east.insforge.app`
- **Client Setup**:
```typescript
createClient({
  baseUrl: 'https://vv92gt6j.us-east.insforge.app'
  // anonKey removed per upgrade instructions
})
```

## Issue
SDK is calling `/api/database/records/` but this endpoint returns 404.

## Questions
1. What is the correct API path for SDK v1.0.8?
2. Is `anonKey` still required for authenticated operations?
3. Did the API structure change after the OAuth redirect fix?

## Reproduction
1. User signs in (auth works ✅)
2. Try to create a workout
3. **Result**: 404 error, nothing works

---
**Environment**: Production at https://aidandaniel.github.io/fitness-logbook/
