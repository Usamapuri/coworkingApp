-- Corrected Database Schema for CalmKaaj
-- Run this in Supabase SQL Editor

-- Create enums (without IF NOT EXISTS)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'member_individual', 
        'member_organization', 
        'member_organization_admin', 
        'cafe_manager', 
        'calmkaaj_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_type AS ENUM ('personal', 'organization');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE site AS ENUM ('blue_area', 'i_10');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  site site NOT NULL DEFAULT 'blue_area',
  start_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  site site NOT NULL DEFAULT 'blue_area',
  credits INTEGER DEFAULT 30,
  used_credits INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  can_charge_cafe_to_org BOOLEAN DEFAULT false,
  can_charge_room_to_org BOOLEAN DEFAULT true,
  start_date TIMESTAMP DEFAULT NOW(),
  bio TEXT,
  linkedin_url TEXT,
  profile_image TEXT,
  job_title TEXT,
  company TEXT,
  community_visible BOOLEAN DEFAULT true,
  email_visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  site site NOT NULL DEFAULT 'blue_area'
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER REFERENCES menu_categories(id),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_daily_special BOOLEAN DEFAULT false,
  site site NOT NULL DEFAULT 'blue_area',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cafe_orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  billed_to billing_type DEFAULT 'personal',
  org_id UUID REFERENCES organizations(id),
  handled_by INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id),
  payment_status TEXT DEFAULT 'unpaid',
  payment_updated_by INTEGER REFERENCES users(id),
  payment_updated_at TIMESTAMP,
  notes TEXT,
  delivery_location TEXT,
  site site NOT NULL DEFAULT 'blue_area',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cafe_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES cafe_orders(id) NOT NULL,
  menu_item_id INTEGER REFERENCES menu_items(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meeting_rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  site site NOT NULL DEFAULT 'blue_area',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meeting_bookings (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES meeting_rooms(id) NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status booking_status DEFAULT 'confirmed',
  total_cost DECIMAL(10,2) NOT NULL,
  billed_to billing_type DEFAULT 'personal',
  org_id UUID REFERENCES organizations(id),
  notes TEXT,
  site site NOT NULL DEFAULT 'blue_area',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  site site NOT NULL DEFAULT 'blue_area',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
); 