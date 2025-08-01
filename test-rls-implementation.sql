-- Comprehensive RLS Testing Script for CalmKaaj
-- Run this after implementing RLS to verify everything works

-- ============================================================================
-- STEP 1: VERIFY RLS IS ENABLED
-- ============================================================================

SELECT '=== RLS STATUS CHECK ===' as test_section;

SELECT 
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ ENABLED'
        ELSE '❌ DISABLED'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'organizations', 'menu_categories', 'menu_items',
    'cafe_orders', 'cafe_order_items', 'meeting_rooms', 
    'meeting_bookings', 'announcements'
)
ORDER BY tablename;

-- ============================================================================
-- STEP 2: VERIFY POLICIES ARE CREATED
-- ============================================================================

SELECT '=== RLS POLICIES CHECK ===' as test_section;

SELECT 
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

-- Count policies per table
SELECT 
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ POLICIES EXIST'
        ELSE '❌ NO POLICIES'
    END as status
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- STEP 3: VERIFY HELPER FUNCTIONS
-- ============================================================================

SELECT '=== HELPER FUNCTIONS CHECK ===' as test_section;

-- Check if functions exist
SELECT 
    proname as function_name,
    CASE 
        WHEN proname IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM pg_proc 
WHERE proname IN ('get_user_site', 'is_admin', 'is_staff')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ============================================================================
-- STEP 4: VERIFY AUTH_ID COLUMN (if using Option A)
-- ============================================================================

SELECT '=== AUTH_ID COLUMN CHECK ===' as test_section;

-- Check if auth_id column exists
SELECT 
    column_name,
    data_type,
    is_nullable,
    CASE 
        WHEN column_name = 'auth_id' THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name = 'auth_id';

-- Check auth_id index
SELECT 
    indexname,
    indexdef,
    CASE 
        WHEN indexname LIKE '%auth_id%' THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'users'
AND indexname LIKE '%auth_id%';

-- ============================================================================
-- STEP 5: VERIFY USER DATA STRUCTURE
-- ============================================================================

SELECT '=== USER DATA CHECK ===' as test_section;

-- Check current users and their mapping status
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    site,
    CASE 
        WHEN auth_id IS NOT NULL THEN '✅ MAPPED'
        ELSE '⚠️ NOT MAPPED'
    END as auth_mapping_status
FROM public.users 
ORDER BY id;

-- Count users by role
SELECT 
    role,
    COUNT(*) as user_count,
    COUNT(auth_id) as mapped_count,
    COUNT(*) - COUNT(auth_id) as unmapped_count
FROM public.users 
GROUP BY role
ORDER BY role;

-- ============================================================================
-- STEP 6: TEST AUTHENTICATION CONTEXT
-- ============================================================================

SELECT '=== AUTHENTICATION TEST ===' as test_section;

-- Test if we can get current user (will be NULL if not authenticated)
SELECT 
    auth.uid() as current_user_auth_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN '✅ AUTHENTICATED'
        ELSE '⚠️ NOT AUTHENTICATED'
    END as auth_status;

-- ============================================================================
-- STEP 7: TEST HELPER FUNCTIONS (if authenticated)
-- ============================================================================

SELECT '=== HELPER FUNCTIONS TEST ===' as test_section;

-- Test helper functions (will return NULL if not authenticated)
SELECT 
    get_user_site() as user_site,
    is_admin() as is_admin,
    is_staff() as is_staff;

-- ============================================================================
-- STEP 8: VERIFY SITE ENUM VALUES
-- ============================================================================

SELECT '=== SITE ENUM CHECK ===' as test_section;

-- Check site enum values
SELECT 
    enumlabel as site_value,
    enumsortorder
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid FROM pg_type 
    WHERE typname = 'site' 
    AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
)
ORDER BY enumsortorder;

-- ============================================================================
-- STEP 9: VERIFY ROLE ENUM VALUES
-- ============================================================================

SELECT '=== ROLE ENUM CHECK ===' as test_section;

-- Check role enum values (if using enum)
SELECT DISTINCT role as actual_role_values
FROM public.users
ORDER BY role;

-- ============================================================================
-- STEP 10: COMPREHENSIVE STATUS SUMMARY
-- ============================================================================

SELECT '=== FINAL STATUS SUMMARY ===' as test_section;

-- Overall status check
SELECT 
    'RLS Implementation' as component,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' 
            AND rowsecurity = true
            AND tablename IN ('users', 'organizations')
        ) THEN '✅ READY'
        ELSE '❌ NOT READY'
    END as status,
    'Row Level Security is enabled on tables' as description

UNION ALL

SELECT 
    'RLS Policies' as component,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public'
        ) THEN '✅ READY'
        ELSE '❌ NOT READY'
    END as status,
    'Security policies are created' as description

UNION ALL

SELECT 
    'Helper Functions' as component,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc 
            WHERE proname IN ('get_user_site', 'is_admin', 'is_staff')
            AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ) THEN '✅ READY'
        ELSE '❌ NOT READY'
    END as status,
    'Security helper functions exist' as description

UNION ALL

SELECT 
    'Auth ID Column' as component,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = 'auth_id'
        ) THEN '✅ READY'
        ELSE '⚠️ OPTIONAL'
    END as status,
    'Auth ID mapping column exists' as description

UNION ALL

SELECT 
    'User Mapping' as component,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id IS NOT NULL
        ) THEN '✅ READY'
        ELSE '⚠️ NEEDS MAPPING'
    END as status,
    'Users are mapped to auth IDs' as description;

-- ============================================================================
-- STEP 11: NEXT STEPS RECOMMENDATIONS
-- ============================================================================

SELECT '=== NEXT STEPS ===' as test_section;

SELECT 
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id IS NOT NULL
        ) THEN '🔧 Map existing users to their Supabase auth IDs using map-users-to-auth.sql'
        ELSE '✅ User mapping complete'
    END as next_step

UNION ALL

SELECT 
    CASE 
        WHEN auth.uid() IS NULL THEN '🔧 Test with authenticated user to verify RLS policies work'
        ELSE '✅ Authentication context available'
    END as next_step

UNION ALL

SELECT 
    '🔧 Test data access with different user roles (admin, staff, user)' as next_step

UNION ALL

SELECT 
    '🔧 Verify site isolation works (blue_area vs i_10)' as next_step

UNION ALL

SELECT 
    '🔧 Test your application with RLS enabled' as next_step; 