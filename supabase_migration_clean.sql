-- Cleaned Supabase Migration File
-- This version replaces COPY statements with INSERT statements for better Supabase compatibility

-- Drop existing tables and types if they exist
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.cafe_order_items CASCADE;
DROP TABLE IF EXISTS public.cafe_orders CASCADE;
DROP TABLE IF EXISTS public.meeting_bookings CASCADE;
DROP TABLE IF EXISTS public.meeting_rooms CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.menu_categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

DROP TYPE IF EXISTS public.billing_type CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.site CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Create types
CREATE TYPE public.billing_type AS ENUM (
    'personal',
    'organization'
);

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'completed'
);

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'accepted',
    'preparing',
    'ready',
    'delivered',
    'cancelled'
);

CREATE TYPE public.site AS ENUM (
    'blue_area',
    'i_10'
);

CREATE TYPE public.user_role AS ENUM (
    'user',
    'admin',
    'staff'
);

-- Create tables
CREATE TABLE public.announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    image_url TEXT,
    show_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sites TEXT[] DEFAULT ARRAY['blue_area']
);

CREATE TABLE public.cafe_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE public.cafe_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status public.order_status DEFAULT 'pending',
    billed_to public.billing_type DEFAULT 'personal',
    org_id INTEGER,
    handled_by INTEGER,
    notes TEXT,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_location VARCHAR(255),
    created_by INTEGER,
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    payment_updated_by INTEGER,
    payment_updated_at TIMESTAMP
);

CREATE TABLE public.meeting_bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status public.booking_status DEFAULT 'pending',
    org_id INTEGER,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE public.meeting_rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.menu_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role public.user_role DEFAULT 'user',
    organization_id INTEGER,
    site public.site DEFAULT 'blue_area',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE public.users ADD CONSTRAINT users_organization_id_organizations_id_fk 
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

ALTER TABLE public.menu_items ADD CONSTRAINT menu_items_category_id_menu_categories_id_fk 
    FOREIGN KEY (category_id) REFERENCES public.menu_categories(id);

ALTER TABLE public.meeting_bookings ADD CONSTRAINT meeting_bookings_user_id_users_id_fk 
    FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.meeting_bookings ADD CONSTRAINT meeting_bookings_room_id_meeting_rooms_id_fk 
    FOREIGN KEY (room_id) REFERENCES public.meeting_rooms(id);

ALTER TABLE public.meeting_bookings ADD CONSTRAINT meeting_bookings_org_id_organizations_id_fk 
    FOREIGN KEY (org_id) REFERENCES public.organizations(id);

ALTER TABLE public.cafe_orders ADD CONSTRAINT cafe_orders_user_id_users_id_fk 
    FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.cafe_orders ADD CONSTRAINT cafe_orders_payment_updated_by_users_id_fk 
    FOREIGN KEY (payment_updated_by) REFERENCES public.users(id);

ALTER TABLE public.cafe_orders ADD CONSTRAINT cafe_orders_org_id_organizations_id_fk 
    FOREIGN KEY (org_id) REFERENCES public.organizations(id);

ALTER TABLE public.cafe_orders ADD CONSTRAINT cafe_orders_handled_by_users_id_fk 
    FOREIGN KEY (handled_by) REFERENCES public.users(id);

ALTER TABLE public.cafe_orders ADD CONSTRAINT cafe_orders_created_by_users_id_fk 
    FOREIGN KEY (created_by) REFERENCES public.users(id);

ALTER TABLE public.cafe_order_items ADD CONSTRAINT cafe_order_items_order_id_cafe_orders_id_fk 
    FOREIGN KEY (order_id) REFERENCES public.cafe_orders(id);

ALTER TABLE public.cafe_order_items ADD CONSTRAINT cafe_order_items_menu_item_id_menu_items_id_fk 
    FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id); 