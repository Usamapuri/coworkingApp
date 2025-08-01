-- Test RLS Policies for CalmKaaj App
-- This script tests the RLS policies to ensure they work correctly

-- First, let's check if RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'organizations', 'menu_categories', 'menu_items',
    'cafe_orders', 'cafe_order_items', 'meeting_rooms', 
    'meeting_bookings', 'announcements'
)
ORDER BY tablename;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test the helper functions
SELECT 'Testing helper functions...' as test;

-- Test get_user_site function (will return NULL if not authenticated)
SELECT get_user_site() as user_site;

-- Test is_admin function (will return false if not authenticated)
SELECT is_admin() as is_admin;

-- Test is_staff function (will return false if not authenticated)
SELECT is_staff() as is_staff;

-- Check user roles in the database
SELECT 
    id,
    email,
    role,
    site
FROM public.users 
ORDER BY id;

-- Check site distribution
SELECT 
    site,
    COUNT(*) as user_count
FROM public.users 
GROUP BY site
ORDER BY site;

-- Check role distribution
SELECT 
    role,
    COUNT(*) as user_count
FROM public.users 
GROUP BY role
ORDER BY role;

-- Summary of what the RLS policies should do:
SELECT 'RLS Policy Summary:' as summary;

SELECT '1. Users can only see their own profile' as policy_1;
SELECT '2. Users can only see orders they created or are assigned to' as policy_2;
SELECT '3. Users can only see bookings they created' as policy_3;
SELECT '4. Users can only see menu items and categories for their site' as policy_4;
SELECT '5. Users can only see meeting rooms for their site' as policy_5;
SELECT '6. Users can only see announcements for their site' as policy_6;
SELECT '7. Admins can see and manage all data for their site' as policy_7;
SELECT '8. Staff can manage cafe orders and menu items for their site' as policy_8; 