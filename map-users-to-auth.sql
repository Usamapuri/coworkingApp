-- Map Users to Supabase Auth IDs
-- This script helps you map existing users to their Supabase auth IDs

-- First, let's see what users we have
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    site,
    auth_id
FROM public.users 
ORDER BY id;

-- To map a user to their Supabase auth ID, run:
-- UPDATE public.users SET auth_id = 'USER_SUPABASE_UUID_HERE' WHERE id = USER_ID;

-- Example mappings (replace with actual UUIDs):
-- UPDATE public.users SET auth_id = '12345678-1234-1234-1234-123456789abc' WHERE id = 1; -- admin@calmkaaj.com
-- UPDATE public.users SET auth_id = '87654321-4321-4321-4321-cba987654321' WHERE id = 2; -- manager@calmkaaj.com

-- Check for users without auth_id mapping
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    site
FROM public.users 
WHERE auth_id IS NULL
ORDER BY id;

-- To get the current user's auth ID (run this when logged in):
SELECT auth.uid() as current_user_auth_id;

-- To map the current user to their profile:
-- UPDATE public.users SET auth_id = auth.uid() WHERE email = 'user_email@example.com';

-- Verify mappings
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    site,
    auth_id,
    CASE 
        WHEN auth_id IS NOT NULL THEN 'Mapped'
        ELSE 'Not Mapped'
    END as status
FROM public.users 
ORDER BY id; 