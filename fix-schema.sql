-- Add missing columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS used_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS can_charge_cafe_to_org BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS can_charge_room_to_org BOOLEAN DEFAULT true;

-- Add missing columns to menu_items table
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Add missing columns to meeting_rooms table
ALTER TABLE meeting_rooms
ADD COLUMN IF NOT EXISTS credit_cost_per_hour INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT ARRAY['Whiteboard', 'TV Screen']::TEXT[];

-- Update meeting rooms with credit costs based on hourly rates
UPDATE meeting_rooms
SET credit_cost_per_hour = CEIL(hourly_rate / 100)
WHERE credit_cost_per_hour = 10;