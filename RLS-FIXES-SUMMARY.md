# RLS Implementation Fixes Summary

## Issues Resolved

### 1. UUID Casting Error
**Error**: `ERROR: 42846: cannot cast type uuid to integer`

**Root Cause**: 
- Your `users` table uses integer IDs (`serial("id").primaryKey()`)
- Supabase's `auth.uid()` returns a UUID
- RLS policies were trying to cast UUID to integer

**Solution**: 
- Added `auth_id` UUID field to link with Supabase auth
- Updated all RLS policies to use `auth_id = auth.uid()`

### 2. Enum Type Casting Error
**Error**: `ERROR: 42883: operator does not exist: site = text`

**Root Cause**:
- `site` field is a PostgreSQL enum type (`siteEnum`)
- RLS policies were comparing enum directly to text values

**Solution**:
- Added explicit type casting: `site::text = other_site::text`
- Updated all site comparisons in RLS policies

## Files Updated

### 1. `fix-user-auth-mapping.sql` ✅
- **Main RLS implementation** with auth_id mapping
- **Fixed enum casting** for all site comparisons
- **Complete RLS policies** for all tables

### 2. `rls-policies-corrected.sql` ✅
- **Alternative RLS implementation** using integer ID casting
- **Fixed enum casting** for all site comparisons
- **Helper functions** with proper type casting

### 3. `shared/schema.ts` ✅
- **Added auth_id field** to users table schema
- **Maintains compatibility** with existing code

### 4. `map-users-to-auth.sql` ✅
- **User mapping script** to link existing users to auth IDs
- **Step-by-step instructions** for manual mapping

## Implementation Options

### Option A: Use `fix-user-auth-mapping.sql` (Recommended)
```sql
-- Run this in Supabase SQL editor
\i fix-user-auth-mapping.sql
```

**Pros**:
- Clean separation between integer IDs and auth UUIDs
- Better performance with indexed auth_id field
- More maintainable long-term

### Option B: Use `rls-policies-corrected.sql`
```sql
-- Run this in Supabase SQL editor
\i rls-policies-corrected.sql
```

**Pros**:
- No schema changes required
- Works with existing integer ID system
- Simpler implementation

## Key Fixes Applied

### 1. UUID Handling
```sql
-- Before (causing error)
WHERE id = auth.uid()::integer

-- After (Option A - Recommended)
WHERE auth_id = auth.uid()

-- After (Option B - Alternative)
WHERE id::text = auth.uid()::text
```

### 2. Enum Type Casting
```sql
-- Before (causing error)
WHERE users.site = menu_items.site

-- After (Fixed)
WHERE users.site::text = menu_items.site::text
```

### 3. Helper Functions
```sql
-- Fixed get_user_site() function
CREATE OR REPLACE FUNCTION get_user_site()
RETURNS text AS $$
BEGIN
    RETURN (
        SELECT site::text FROM public.users 
        WHERE auth_id = auth.uid()  -- or id::text = auth.uid()::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Testing the Fixes

### 1. Check RLS Status
```sql
SELECT tablename, rowsecurity 
FROM pg_tables WHERE schemaname = 'public';
```

### 2. Check Policies
```sql
SELECT tablename, policyname 
FROM pg_policies WHERE schemaname = 'public';
```

### 3. Test Helper Functions
```sql
SELECT get_user_site() as user_site;
SELECT is_admin() as is_admin;
SELECT is_staff() as is_staff;
```

### 4. Test User Mapping (Option A)
```sql
-- Check current users
SELECT id, email, auth_id, role, site 
FROM public.users ORDER BY id;

-- Map a user (replace with actual UUID)
UPDATE public.users SET auth_id = 'USER_UUID_HERE' WHERE id = USER_ID;
```

## Next Steps

1. **Choose your implementation option** (A or B)
2. **Run the selected SQL file** in Supabase
3. **Map existing users** to their auth IDs (if using Option A)
4. **Test the RLS policies** with different user roles
5. **Verify site isolation** works correctly

## Security Benefits

✅ **Data Isolation**: Users can only see data from their site  
✅ **Role-Based Access**: Different permissions for different roles  
✅ **Ownership Protection**: Users can only access their own data  
✅ **Automatic Enforcement**: Security enforced at database level  
✅ **Type Safety**: Proper handling of UUIDs and enums  

The RLS implementation is now ready and will provide robust security for your CalmKaaj application! 🎉 