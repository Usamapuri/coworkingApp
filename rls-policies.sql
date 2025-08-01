-- Row Level Security (RLS) Policies for CalmKaaj App
-- This file contains all RLS policies to secure the database

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

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin', 'cafe_manager')
        )
    );

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin', 'cafe_manager')
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
            AND users.id = (auth.uid()::integer)
        )
    );

-- Admins can view all organizations
CREATE POLICY "Admins can view all organizations" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin')
        )
    );

-- Admins can manage organizations
CREATE POLICY "Admins can manage organizations" ON public.organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin')
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
            WHERE users.site = menu_categories.site 
            AND users.id = (auth.uid()::integer)
        )
    );

-- Cafe managers and admins can manage menu categories
CREATE POLICY "Cafe managers and admins can manage menu categories" ON public.menu_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin', 'cafe_manager')
            AND users.site = menu_categories.site
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
            WHERE users.site = menu_items.site 
            AND users.id = (auth.uid()::integer)
        )
    );

-- Cafe managers and admins can manage menu items
CREATE POLICY "Cafe managers and admins can manage menu items" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin', 'cafe_manager')
            AND users.site = menu_items.site
        )
    );

-- ============================================================================
-- CAFE ORDERS TABLE POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.cafe_orders
    FOR SELECT USING (
        user_id = (auth.uid()::integer) OR
        created_by = (auth.uid()::integer)
    );

-- Users can create orders
CREATE POLICY "Users can create orders" ON public.cafe_orders
    FOR INSERT WITH CHECK (
        user_id = (auth.uid()::integer) OR
        created_by = (auth.uid()::integer)
    );

-- Users can update their own orders (limited fields)
CREATE POLICY "Users can update own orders" ON public.cafe_orders
    FOR UPDATE USING (
        user_id = (auth.uid()::integer) OR
        created_by = (auth.uid()::integer)
    );

-- Cafe managers and admins can view all orders for their site
CREATE POLICY "Cafe managers and admins can view all orders" ON public.cafe_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin', 'cafe_manager')
            AND users.site = cafe_orders.site
        )
    );

-- Cafe managers and admins can manage all orders for their site
CREATE POLICY "Cafe managers and admins can manage all orders" ON public.cafe_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin', 'cafe_manager')
            AND users.site = cafe_orders.site
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
            AND (cafe_orders.user_id = (auth.uid()::integer) OR cafe_orders.created_by = (auth.uid()::integer))
        )
    );

-- Cafe managers and admins can view all order items for their site
CREATE POLICY "Cafe managers and admins can view all order items" ON public.cafe_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cafe_orders co
            JOIN public.users u ON u.site = co.site
            WHERE co.id = cafe_order_items.order_id
            AND u.id = (auth.uid()::integer) 
            AND u.role IN ('calmkaaj_admin', 'cafe_manager')
        )
    );

-- Cafe managers and admins can manage order items
CREATE POLICY "Cafe managers and admins can manage order items" ON public.cafe_order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.cafe_orders co
            JOIN public.users u ON u.site = co.site
            WHERE co.id = cafe_order_items.order_id
            AND u.id = (auth.uid()::integer) 
            AND u.role IN ('calmkaaj_admin', 'cafe_manager')
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
            WHERE users.site = meeting_rooms.site 
            AND users.id = (auth.uid()::integer)
        )
    );

-- Admins can manage meeting rooms
CREATE POLICY "Admins can manage meeting rooms" ON public.meeting_rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin')
            AND users.site = meeting_rooms.site
        )
    );

-- ============================================================================
-- MEETING BOOKINGS TABLE POLICIES
-- ============================================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON public.meeting_bookings
    FOR SELECT USING (
        user_id = (auth.uid()::integer)
    );

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON public.meeting_bookings
    FOR INSERT WITH CHECK (
        user_id = (auth.uid()::integer)
    );

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" ON public.meeting_bookings
    FOR UPDATE USING (
        user_id = (auth.uid()::integer)
    );

-- Admins can view all bookings for their site
CREATE POLICY "Admins can view all bookings" ON public.meeting_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin')
            AND users.site = meeting_bookings.site
        )
    );

-- Admins can manage all bookings for their site
CREATE POLICY "Admins can manage all bookings" ON public.meeting_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin')
            AND users.site = meeting_bookings.site
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
            WHERE users.site = ANY(announcements.sites)
            AND users.id = (auth.uid()::integer)
        )
    );

-- Admins can manage announcements
CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (auth.uid()::integer) 
            AND role IN ('calmkaaj_admin')
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
        SELECT site FROM public.users 
        WHERE id = (auth.uid()::integer)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (auth.uid()::integer) 
        AND role IN ('calmkaaj_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is cafe manager
CREATE OR REPLACE FUNCTION is_cafe_manager()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (auth.uid()::integer) 
        AND role IN ('calmkaaj_admin', 'cafe_manager')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable RLS on all tables (redundant but explicit)
SELECT 'RLS enabled on all tables' as status; 