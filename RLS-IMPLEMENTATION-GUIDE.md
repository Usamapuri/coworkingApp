# Row Level Security (RLS) Implementation Guide for CalmKaaj

## Overview

This guide explains the Row Level Security (RLS) policies implemented for the CalmKaaj coworking space application. RLS ensures that users can only access data they're authorized to see based on their role and site location.

## Quick Start

1. **Run the RLS policies**: Execute `rls-policies-corrected.sql` in your Supabase SQL editor
2. **Test the policies**: Run `test-rls-policies.sql` to verify everything is working
3. **Verify in your app**: Test that users can only see appropriate data

## User Roles

Based on your database, we have these roles:
- **`admin`**: Full access to all data for their site
- **`staff`**: Can manage cafe orders and menu items for their site
- **`user`**: Regular members with limited access

## Site-Based Access

Users are assigned to specific sites:
- **`blue_area`**: Main location
- **`i_10`**: Secondary location

Users can only see data from their assigned site.

## RLS Policies by Table

### 1. Users Table
- **Users**: Can view and update their own profile
- **Admins/Staff**: Can view all users
- **Admins**: Can update all users
- **Everyone**: Can register (INSERT)

### 2. Organizations Table
- **Users**: Can view their own organization
- **Admins**: Can view and manage all organizations

### 3. Menu Categories & Items
- **Users**: Can view items for their site
- **Staff/Admins**: Can manage items for their site

### 4. Cafe Orders
- **Users**: Can view, create, and update their own orders
- **Staff/Admins**: Can view and manage all orders for their site

### 5. Cafe Order Items
- **Users**: Can view items from their own orders
- **Staff/Admins**: Can view and manage all order items for their site

### 6. Meeting Rooms
- **Users**: Can view rooms for their site
- **Admins**: Can manage rooms for their site

### 7. Meeting Bookings
- **Users**: Can view, create, and update their own bookings
- **Admins**: Can view and manage all bookings for their site

### 8. Announcements
- **Users**: Can view announcements for their site
- **Admins**: Can manage all announcements

## Helper Functions

The RLS implementation includes these helper functions:

```sql
-- Get current user's site
SELECT get_user_site();

-- Check if user is admin
SELECT is_admin();

-- Check if user is staff (includes admins)
SELECT is_staff();
```

## Testing RLS Policies

### Test as Different Users

1. **Test as Regular User**:
   ```sql
   -- Should only see their own data
   SELECT * FROM cafe_orders WHERE user_id = [user_id];
   ```

2. **Test as Staff**:
   ```sql
   -- Should see all orders for their site
   SELECT * FROM cafe_orders;
   ```

3. **Test as Admin**:
   ```sql
   -- Should see all data for their site
   SELECT * FROM users;
   ```

### Common Test Scenarios

1. **Site Isolation**: Users from `blue_area` shouldn't see data from `i_10`
2. **Ownership**: Users should only see their own orders/bookings
3. **Role Permissions**: Staff can manage cafe orders but not meeting rooms
4. **Admin Access**: Admins can see and manage everything for their site

## Troubleshooting

### Common Issues

1. **"No rows returned"**: Check if RLS is blocking access
2. **"Permission denied"**: Verify user role and site assignment
3. **"Function not found"**: Ensure helper functions are created

### Debugging Steps

1. Check if RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```

2. Check existing policies:
   ```sql
   SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
   ```

3. Test user authentication:
   ```sql
   SELECT auth.uid(), get_user_site(), is_admin(), is_staff();
   ```

### Fixing Issues

1. **Drop and recreate policies**:
   ```sql
   DROP POLICY IF EXISTS "policy_name" ON table_name;
   -- Then recreate the policy
   ```

2. **Disable RLS temporarily** (for debugging):
   ```sql
   ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
   ```

3. **Check user permissions**:
   ```sql
   SELECT * FROM users WHERE id = auth.uid()::integer;
   ```

## Security Best Practices

1. **Always test policies** before deploying to production
2. **Use specific policies** rather than broad ones
3. **Regularly audit** who has access to what data
4. **Monitor access patterns** for unusual activity
5. **Keep policies simple** and well-documented

## Integration with Your App

### Frontend Considerations

1. **Handle empty results gracefully** - RLS might return no rows
2. **Show appropriate error messages** for permission denied
3. **Cache user role and site** to avoid repeated queries
4. **Implement proper loading states** while checking permissions

### Backend Considerations

1. **Always use authenticated connections** to Supabase
2. **Pass user context** in API calls
3. **Handle RLS errors** appropriately
4. **Log access attempts** for security monitoring

## Migration Notes

If you need to modify existing policies:

1. **Backup current policies**:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

2. **Test changes** in development first
3. **Deploy during low-traffic periods**
4. **Monitor for errors** after deployment

## Support

If you encounter issues:

1. Check the test script output
2. Verify user authentication is working
3. Ensure all policies are created correctly
4. Test with different user roles and sites

## Files Created

- `rls-policies-corrected.sql`: Main RLS implementation
- `test-rls-policies.sql`: Testing and verification script
- `RLS-IMPLEMENTATION-GUIDE.md`: This guide

Run these files in order to implement and test your RLS policies. 