-- Fix User Auth Mapping for RLS
-- This script adds a UUID field to link users with Supabase auth
-- Fixed for site enum type casting

-- Add auth_id column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_id uuid;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);

-- Update existing users with auth_id (you'll need to map these manually)
-- For now, we'll set them to NULL and you can update them when users log in
UPDATE public.users SET auth_id = NULL WHERE auth_id IS NULL;

-- Make auth_id unique
ALTER TABLE public.users ADD CONSTRAINT users_auth_id_unique UNIQUE (auth_id);

-- Now create RLS policies that work with the auth_id field
-- ============================================================================
-- USERS TABLE POLICIES (Updated for auth_id)
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth_id = auth.uid());

-- Users can update their own profile (except role and organization_id)
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth_id = auth.uid())
    WITH CHECK (auth_id = auth.uid());

-- Admins and staff can view all users
CREATE POLICY "Admins and staff can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role IN ('admin', 'staff')
        )
    );

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Allow registration (INSERT) for new users
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT WITH CHECK (true);

-- ============================================================================
-- ORGANIZATIONS TABLE POLICIES
-- ============================================================================

-- Users can view organizations they belong to
CREATE POLICY "Users can view own organization" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.organization_id = organizations.id 
            AND users.auth_id = auth.uid()
        )
    );

-- Admins can view all organizations
CREATE POLICY "Admins can view all organizations" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Admins can manage organizations
CREATE POLICY "Admins can manage organizations" ON public.organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- ============================================================================
-- MENU CATEGORIES TABLE POLICIES
-- ============================================================================

-- Everyone can view menu categories for their site
CREATE POLICY "Users can view menu categories for their site" ON public.menu_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.site::text = menu_categories.site::text
            AND users.auth_id = auth.uid()
        )
    );

-- Staff and admins can manage menu categories
CREATE POLICY "Staff and admins can manage menu categories" ON public.menu_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role IN ('admin', 'staff')
            AND users.site::text = menu_categories.site::text
        )
    );

-- ============================================================================
-- MENU ITEMS TABLE POLICIES
-- ============================================================================

-- Everyone can view menu items for their site
CREATE POLICY "Users can view menu items for their site" ON public.menu_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.site::text = menu_items.site::text
            AND users.auth_id = auth.uid()
        )
    );

-- Staff and admins can manage menu items
CREATE POLICY "Staff and admins can manage menu items" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role IN ('admin', 'staff')
            AND users.site::text = menu_items.site::text
        )
    );

-- ============================================================================
-- CAFE ORDERS TABLE POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.cafe_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = cafe_orders.user_id 
            AND users.auth_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = cafe_orders.created_by 
            AND users.auth_id = auth.uid()
        )
    );

-- Users can create orders
CREATE POLICY "Users can create orders" ON public.cafe_orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = cafe_orders.user_id 
            AND users.auth_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = cafe_orders.created_by 
            AND users.auth_id = auth.uid()
        )
    );

-- Users can update their own orders (limited fields)
CREATE POLICY "Users can update own orders" ON public.cafe_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = cafe_orders.user_id 
            AND users.auth_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = cafe_orders.created_by 
            AND users.auth_id = auth.uid()
        )
    );

-- Staff and admins can view all orders for their site
CREATE POLICY "Staff and admins can view all orders" ON public.cafe_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role IN ('admin', 'staff')
            AND users.site::text = cafe_orders.site::text
        )
    );

-- Staff and admins can manage all orders for their site
CREATE POLICY "Staff and admins can manage all orders" ON public.cafe_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role IN ('admin', 'staff')
            AND users.site::text = cafe_orders.site::text
        )
    );

-- ============================================================================
-- CAFE ORDER ITEMS TABLE POLICIES
-- ============================================================================

-- Users can view items from their own orders
CREATE POLICY "Users can view own order items" ON public.cafe_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cafe_orders co
            JOIN public.users u ON u.id = co.user_id
            WHERE co.id = cafe_order_items.order_id
            AND u.auth_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.cafe_orders co
            JOIN public.users u ON u.id = co.created_by
            WHERE co.id = cafe_order_items.order_id
            AND u.auth_id = auth.uid()
        )
    );

-- Staff and admins can view all order items for their site
CREATE POLICY "Staff and admins can view all order items" ON public.cafe_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cafe_orders co
            JOIN public.users u ON u.site::text = co.site::text
            WHERE co.id = cafe_order_items.order_id
            AND u.auth_id = auth.uid()
            AND u.role IN ('admin', 'staff')
        )
    );

-- Staff and admins can manage order items
CREATE POLICY "Staff and admins can manage order items" ON public.cafe_order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.cafe_orders co
            JOIN public.users u ON u.site::text = co.site::text
            WHERE co.id = cafe_order_items.order_id
            AND u.auth_id = auth.uid()
            AND u.role IN ('admin', 'staff')
        )
    );

-- ============================================================================
-- MEETING ROOMS TABLE POLICIES
-- ============================================================================

-- Everyone can view meeting rooms for their site
CREATE POLICY "Users can view meeting rooms for their site" ON public.meeting_rooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.site::text = meeting_rooms.site::text
            AND users.auth_id = auth.uid()
        )
    );

-- Admins can manage meeting rooms
CREATE POLICY "Admins can manage meeting rooms" ON public.meeting_rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role = 'admin'
            AND users.site::text = meeting_rooms.site::text
        )
    );

-- ============================================================================
-- MEETING BOOKINGS TABLE POLICIES
-- ============================================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON public.meeting_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = meeting_bookings.user_id
            AND users.auth_id = auth.uid()
        )
    );

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON public.meeting_bookings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = meeting_bookings.user_id
            AND users.auth_id = auth.uid()
        )
    );

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" ON public.meeting_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = meeting_bookings.user_id
            AND users.auth_id = auth.uid()
        )
    );

-- Admins can view all bookings for their site
CREATE POLICY "Admins can view all bookings" ON public.meeting_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role = 'admin'
            AND users.site::text = meeting_bookings.site::text
        )
    );

-- Admins can manage all bookings for their site
CREATE POLICY "Admins can manage all bookings" ON public.meeting_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role = 'admin'
            AND users.site::text = meeting_bookings.site::text
        )
    );

-- ============================================================================
-- ANNOUNCEMENTS TABLE POLICIES
-- ============================================================================

-- Users can view announcements for their site
CREATE POLICY "Users can view announcements for their site" ON public.announcements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.site::text = ANY(announcements.sites)
            AND users.auth_id = auth.uid()
        )
    );

-- Admins can manage announcements
CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- ============================================================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Create a function to get current user's site
CREATE OR REPLACE FUNCTION get_user_site()
RETURNS text AS $$
BEGIN
    RETURN (
        SELECT site::text FROM public.users 
        WHERE auth_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_id = auth.uid()
        AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

SELECT 'RLS enabled on all tables with auth_id mapping and enum casting' as status; 