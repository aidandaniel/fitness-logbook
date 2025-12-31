# InsForge Support Report - Critical Issue

## Problem Summary
**All database operations return 404 errors** after SDK upgrade to v1.0.8 and removal of `anonKey` parameter.

## Error Details

### HTTP Status Codes
- **404 (Not Found)** - All database SELECT/INSERT operations
- **400 (Bad Request)** - Some queries with joins

### Affected Endpoints
All requests are going to `/api/database/records/` which doesn't exist:
- `POST https://vv92gt6j.us-east.insforge.app/api/database/records/workout_templates?select=*` → **404**
- `GET https://vv92gt6j.us-east.insforge.app/api/database/records/workout_templates?select=*&user_id=eq.xxx` → **404**
- `GET https://vv92gt6j.us-east.insforge.app/api/database/records/user_settings?select=*&user_id=eq.xxx` → **404**
- Similar 404s for: `workout_logs`, `fitness_goals`, `personal_records`, `progress_photos`

### Full Error Log
```
POST https://vv92gt6j.us-east.insforge.app/api/database/records/workout_templates?select=* 404 (Not Found)
Error creating workout: {}
```

## Configuration

### SDK Versions
- `@insforge/react`: `^1.1.0`
- `@insforge/sdk`: `^1.0.8`

### Client Initialization
```typescript
export const insforge = createClient({
  baseUrl: 'https://vv92gt6j.us-east.insforge.app',
  // anonKey removed per SDK upgrade instructions
});
```

### Backend Metadata
```json
{
  "database": {
    "tables": [],  // ⚠️ Empty - tables may not be visible via this endpoint
    "totalSizeInGB": 0.008457942865788937
  }
}
```

## Questions for Support

1. **API Path Issue**: The SDK v1.0.8 is using `/api/database/records/` but this returns 404. What is the correct API path?
   - Should it be `/api/rest/` (PostgREST standard)?
   - Or `/api/database/`?
   - Or something else?

2. **anonKey Requirement**: The SDK upgrade documentation suggested removing `anonKey`, but is it still required for authenticated database operations?

3. **Backend Changes**: After the OAuth redirect fix, did the API endpoint structure change?

4. **Table Visibility**: Backend metadata shows `"tables": []` - are the tables still accessible, or was there a schema change?

## Expected vs Actual

### Expected
- Database operations should work with authenticated session
- SDK should construct correct API URLs
- Tables should be accessible

### Actual
- All database requests return 404
- API path `/api/database/records/` doesn't exist
- No data can be read or written

## Reproduction Steps

1. User signs in successfully (authentication works)
2. Navigate to Templates page
3. Click "New Template"
4. Enter workout name
5. Click "Create"
6. **Result**: 404 error, no workout created

## Environment

- **Production URL**: https://aidandaniel.github.io/fitness-logbook/
- **Backend URL**: https://vv92gt6j.us-east.insforge.app
- **Browser**: Chrome
- **Authentication**: Working (user can sign in)

## Code Example

```typescript
// This is what we're calling:
const { data, error } = await insforge.database
  .from('workout_templates')
  .insert({ user_id: userId, name: 'Test' })
  .select()
  .single();

// This generates:
// POST https://vv92gt6j.us-east.insforge.app/api/database/records/workout_templates?select=*
// Which returns: 404 Not Found
```

## Request for Help

Please clarify:
1. The correct API endpoint path for SDK v1.0.8
2. Whether `anonKey` is still required
3. If backend API structure changed after OAuth fix
4. How to properly configure the client for authenticated database operations

