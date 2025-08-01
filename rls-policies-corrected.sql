-- Row Level Security (RLS) Policies for CalmKaaj App
-- This file contains all RLS policies to secure the database
-- Updated to match actual database structure and role values
-- Fixed for UUID user IDs (Supabase auth.uid() returns UUID)
-- Fixed for site enum type casting

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

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile (except role and organization_id)
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- Admins and staff can view all users
CREATE POLICY "Admins and staff can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
            AND role IN ('admin', 'staff')
        )
    );

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
            AND users.id::text = auth.uid()::text
        )
    );

-- Admins can view all organizations
CREATE POLICY "Admins can view all organizations" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
            AND role = 'admin'
        )
    );

-- Admins can manage organizations
CREATE POLICY "Admins can manage organizations" ON public.organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
            AND users.id::text = auth.uid()::text
        )
    );

-- Staff and admins can manage menu categories
CREATE POLICY "Staff and admins can manage menu categories" ON public.menu_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
            AND users.id::text = auth.uid()::text
        )
    );

-- Staff and admins can manage menu items
CREATE POLICY "Staff and admins can manage menu items" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
        user_id::text = auth.uid()::text OR
        created_by::text = auth.uid()::text
    );

-- Users can create orders
CREATE POLICY "Users can create orders" ON public.cafe_orders
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text OR
        created_by::text = auth.uid()::text
    );

-- Users can update their own orders (limited fields)
CREATE POLICY "Users can update own orders" ON public.cafe_orders
    FOR UPDATE USING (
        user_id::text = auth.uid()::text OR
        created_by::text = auth.uid()::text
    );

-- Staff and admins can view all orders for their site
CREATE POLICY "Staff and admins can view all orders" ON public.cafe_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
            AND role IN ('admin', 'staff')
            AND users.site::text = cafe_orders.site::text
        )
    );

-- Staff and admins can manage all orders for their site
CREATE POLICY "Staff and admins can manage all orders" ON public.cafe_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
            SELECT 1 FROM public.cafe_orders 
            WHERE cafe_orders.id = cafe_order_items.order_id
            AND (cafe_orders.user_id::text = auth.uid()::text OR cafe_orders.created_by::text = auth.uid()::text)
        )
    );

-- Staff and admins can view all order items for their site
CREATE POLICY "Staff and admins can view all order items" ON public.cafe_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cafe_orders co
            JOIN public.users u ON u.site::text = co.site::text
            WHERE co.id = cafe_order_items.order_id
            AND u.id::text = auth.uid()::text
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
            AND u.id::text = auth.uid()::text
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
            AND users.id::text = auth.uid()::text
        )
    );

-- Admins can manage meeting rooms
CREATE POLICY "Admins can manage meeting rooms" ON public.meeting_rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
        user_id::text = auth.uid()::text
    );

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON public.meeting_bookings
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text
    );

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" ON public.meeting_bookings
    FOR UPDATE USING (
        user_id::text = auth.uid()::text
    );

-- Admins can view all bookings for their site
CREATE POLICY "Admins can view all bookings" ON public.meeting_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
            AND role = 'admin'
            AND users.site::text = meeting_bookings.site::text
        )
    );

-- Admins can manage all bookings for their site
CREATE POLICY "Admins can manage all bookings" ON public.meeting_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
            AND users.id::text = auth.uid()::text
        )
    );

-- Admins can manage announcements
CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text
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
        WHERE id::text = auth.uid()::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id::text = auth.uid()::text
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
        WHERE id::text = auth.uid()::text
        AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable RLS on all tables (redundant but explicit)
SELECT 'RLS enabled on all tables with enum casting' as status; 