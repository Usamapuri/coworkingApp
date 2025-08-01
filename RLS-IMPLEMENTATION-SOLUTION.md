# RLS Implementation Solution for CalmKaaj

## Problem Solved

The error `ERROR: 42846: cannot cast type uuid to integer` occurred because:
- Your `users` table uses **integer IDs** (`serial("id").primaryKey()`)
- Supabase's `auth.uid()` returns a **UUID**
- RLS policies were trying to cast UUID to integer

## Solution Overview

We've implemented a **hybrid approach** that maintains your existing integer IDs while adding a UUID field to link with Supabase auth.

## Files Created

1. **`fix-user-auth-mapping.sql`** - Main RLS implementation with auth_id mapping
2. **`map-users-to-auth.sql`** - Script to help map existing users to auth IDs
3. **Updated `shared/schema.ts`** - Added auth_id field to users table

## Implementation Steps

### Step 1: Run the RLS Setup
```sql
-- Execute this in your Supabase SQL editor
-- This adds auth_id field and creates all RLS policies
\i fix-user-auth-mapping.sql
```

### Step 2: Map Existing Users
```sql
-- Run this to see your current users
SELECT id, email, first_name, last_name, role, site, auth_id 
FROM public.users ORDER BY id;

-- Map users one by one (replace with actual UUIDs)
UPDATE public.users SET auth_id = 'USER_UUID_HERE' WHERE id = USER_ID;
```

### Step 3: Test the Implementation
```sql
-- Test helper functions
SELECT get_user_site() as user_site;
SELECT is_admin() as is_admin;
SELECT is_staff() as is_staff;

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

## How It Works

### Database Structure
```sql
users table:
- id (integer, primary key) - Your existing ID system
- auth_id (uuid, unique) - Links to Supabase auth.uid()
- email, role, site, etc. - Your existing fields
```

### RLS Policies
- **User Access**: Users can only see their own data via `auth_id = auth.uid()`
- **Site Isolation**: All data filtered by user's site
- **Role Permissions**: Different access levels for admin/staff/user roles

### Authentication Flow
1. User logs in via Supabase Auth
2. `auth.uid()` returns their UUID
3. RLS policies use `auth_id = auth.uid()` to find their profile
4. User can only access data they're authorized to see

## Mapping Users to Auth IDs

### Option 1: Manual Mapping
```sql
-- Get current user's auth ID (when logged in)
SELECT auth.uid() as current_user_auth_id;

-- Map user to their auth ID
UPDATE public.users SET auth_id = 'UUID_HERE' WHERE email = 'user@example.com';
```

### Option 2: Automatic Mapping on Login
In your app's login handler:
```typescript
// After successful login
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  await supabase
    .from('users')
    .update({ auth_id: user.id })
    .eq('email', user.email);
}
```

### Option 3: Database Trigger
```sql
-- Create trigger to auto-map users on insert
CREATE OR REPLACE FUNCTION map_user_auth_id()
RETURNS TRIGGER AS $$
BEGIN
  -- This would need to be called from your app
  -- when a user registers
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Testing RLS Policies

### Test as Different User Types

1. **Regular User**:
   ```sql
   -- Should only see their own data
   SELECT * FROM cafe_orders;
   SELECT * FROM meeting_bookings;
   ```

2. **Staff Member**:
   ```sql
   -- Should see all cafe orders for their site
   SELECT * FROM cafe_orders;
   -- Should NOT see meeting room management
   SELECT * FROM meeting_rooms;
   ```

3. **Admin**:
   ```sql
   -- Should see all data for their site
   SELECT * FROM users;
   SELECT * FROM cafe_orders;
   SELECT * FROM meeting_bookings;
   ```

### Common Test Scenarios

1. **Site Isolation**: Users from `blue_area` shouldn't see `i_10` data
2. **Ownership**: Users should only see their own orders/bookings
3. **Role Permissions**: Staff can manage cafe orders but not meeting rooms
4. **Admin Access**: Admins can see and manage everything for their site

## Troubleshooting

### Common Issues

1. **"No rows returned"**:
   - Check if user has `auth_id` mapped
   - Verify user is authenticated
   - Check if RLS is blocking access

2. **"Permission denied"**:
   - Verify user role and site assignment
   - Check if policies are created correctly

3. **"Function not found"**:
   - Ensure helper functions are created
   - Check if user is authenticated

### Debugging Steps

1. **Check user mapping**:
   ```sql
   SELECT id, email, auth_id, role, site 
   FROM users WHERE auth_id = auth.uid();
   ```

2. **Check RLS status**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables WHERE schemaname = 'public';
   ```

3. **Check policies**:
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies WHERE schemaname = 'public';
   ```

4. **Test authentication**:
   ```sql
   SELECT auth.uid(), get_user_site(), is_admin(), is_staff();
   ```

## Security Benefits

✅ **Data Isolation**: Users can only see data from their site  
✅ **Role-Based Access**: Different permissions for different roles  
✅ **Ownership Protection**: Users can only access their own data  
✅ **Automatic Enforcement**: Security enforced at database level  
✅ **No Code Changes**: RLS works with existing queries  

## Integration with Your App

### Frontend Considerations
- Handle empty results gracefully (RLS might return no rows)
- Show appropriate error messages for permission denied
- Cache user role and site to avoid repeated queries

### Backend Considerations
- Always use authenticated connections to Supabase
- Pass user context in API calls
- Handle RLS errors appropriately

## Migration Notes

- **Backup**: Always backup your database before implementing RLS
- **Testing**: Test thoroughly in development before production
- **Gradual Rollout**: Consider implementing RLS on one table at a time
- **Monitoring**: Watch for any access issues after implementation

## Support

If you encounter issues:
1. Check the mapping script output
2. Verify user authentication is working
3. Ensure all policies are created correctly
4. Test with different user roles and sites

## Next Steps

1. Run `fix-user-auth-mapping.sql` in Supabase
2. Map your existing users to their auth IDs
3. Test the RLS policies
4. Update your app to handle the new security model

The RLS implementation is now ready and will provide robust security for your CalmKaaj application! 