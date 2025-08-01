# RLS Testing Guide for CalmKaaj

## 🎯 Quick Verification Steps

### Step 1: Run the Testing Script
```sql
-- Copy and paste this entire script into your Supabase SQL editor
\i test-rls-implementation.sql
```

This will give you a comprehensive status report of your RLS implementation.

### Step 2: Check the Results
Look for these ✅ indicators in the output:
- **RLS STATUS**: All tables should show "✅ ENABLED"
- **POLICIES**: Each table should have multiple policies
- **HELPER FUNCTIONS**: All three functions should exist
- **AUTH_ID COLUMN**: Should exist if using Option A

## 🔧 Manual Testing Steps

### 1. Test User Mapping (if using Option A)

```sql
-- Check current user mapping status
SELECT id, email, auth_id, role, site 
FROM public.users ORDER BY id;

-- If users are not mapped, you'll see NULL in auth_id column
-- You'll need to map them using the map-users-to-auth.sql script
```

### 2. Test Authentication Context

```sql
-- This should return your UUID if you're logged in
SELECT auth.uid() as current_user_auth_id;

-- Test helper functions
SELECT get_user_site() as user_site;
SELECT is_admin() as is_admin;
SELECT is_staff() as is_staff;
```

### 3. Test Data Access by Role

#### As a Regular User:
```sql
-- Should only see your own data
SELECT * FROM cafe_orders;  -- Only your orders
SELECT * FROM meeting_bookings;  -- Only your bookings
SELECT * FROM users;  -- Only your profile
```

#### As Staff:
```sql
-- Should see all cafe orders for your site
SELECT * FROM cafe_orders;  -- All orders from your site
SELECT * FROM menu_items;   -- All menu items from your site
-- Should NOT see meeting room management
SELECT * FROM meeting_rooms;  -- Should be empty or limited
```

#### As Admin:
```sql
-- Should see all data for your site
SELECT * FROM users;  -- All users from your site
SELECT * FROM cafe_orders;  -- All orders from your site
SELECT * FROM meeting_bookings;  -- All bookings from your site
```

## 🧪 Application Testing

### 1. Test Login Flow
1. **Log in** to your application
2. **Check** if you can see your profile data
3. **Verify** you can only see data from your site
4. **Confirm** role-based access works

### 2. Test Site Isolation
1. **Log in** as a user from `blue_area`
2. **Verify** you only see `blue_area` data
3. **Switch** to a user from `i_10` (if you have one)
4. **Confirm** you only see `i_10` data

### 3. Test Role Permissions
1. **Test as Regular User**:
   - Can view own orders ✅
   - Can create orders ✅
   - Cannot see other users' data ✅
   - Cannot manage menu items ❌

2. **Test as Staff**:
   - Can view all cafe orders for site ✅
   - Can manage menu items ✅
   - Cannot manage meeting rooms ❌
   - Cannot see other sites' data ✅

3. **Test as Admin**:
   - Can view all data for site ✅
   - Can manage everything for site ✅
   - Cannot see other sites' data ✅

## 🚨 Common Issues & Solutions

### Issue 1: "No rows returned"
**Cause**: User not mapped to auth_id or not authenticated
**Solution**: 
```sql
-- Map the user to their auth_id
UPDATE public.users SET auth_id = auth.uid() WHERE email = 'user@example.com';
```

### Issue 2: "Permission denied"
**Cause**: RLS policy blocking access
**Solution**: Check user role and site assignment
```sql
-- Verify user permissions
SELECT id, email, role, site, auth_id 
FROM users WHERE auth_id = auth.uid();
```

### Issue 3: "Function not found"
**Cause**: Helper functions not created
**Solution**: Re-run the RLS implementation script

### Issue 4: "Cannot access data from other site"
**Expected**: This is RLS working correctly! Users should only see their site's data.

## 📊 Expected Results

### For Regular Users:
- ✅ Can see own profile
- ✅ Can see own orders/bookings
- ✅ Can see menu items from their site
- ❌ Cannot see other users' data
- ❌ Cannot see data from other sites

### For Staff:
- ✅ Can see all cafe orders for their site
- ✅ Can manage menu items for their site
- ✅ Can see own profile
- ❌ Cannot manage meeting rooms
- ❌ Cannot see data from other sites

### For Admins:
- ✅ Can see all data for their site
- ✅ Can manage everything for their site
- ✅ Can see all users from their site
- ❌ Cannot see data from other sites

## 🔍 Debugging Commands

### Check Current User Context:
```sql
SELECT 
    auth.uid() as auth_id,
    get_user_site() as site,
    is_admin() as admin,
    is_staff() as staff;
```

### Check RLS Policies:
```sql
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Check User Permissions:
```sql
SELECT 
    u.id,
    u.email,
    u.role,
    u.site,
    u.auth_id,
    CASE WHEN u.auth_id = auth.uid() THEN '✅ CURRENT USER' ELSE '❌ OTHER USER' END as status
FROM users u
ORDER BY u.id;
```

### Test Site Isolation:
```sql
-- This should only return data from your site
SELECT site, COUNT(*) as count 
FROM cafe_orders 
GROUP BY site;
```

## ✅ Success Criteria

Your RLS implementation is working correctly if:

1. **✅ RLS is enabled** on all tables
2. **✅ Policies are created** for all tables
3. **✅ Helper functions exist** and work
4. **✅ Users are mapped** to auth IDs (if using Option A)
5. **✅ Site isolation works** (users only see their site's data)
6. **✅ Role permissions work** (different access levels)
7. **✅ Your application works** without errors

## 🎉 Next Steps

Once testing is complete:

1. **Monitor** your application for any RLS-related issues
2. **Test** with real users and different scenarios
3. **Document** any custom policies you add
4. **Backup** your database regularly
5. **Consider** implementing additional security measures

Your CalmKaaj application is now secured with robust Row Level Security! 🛡️ 