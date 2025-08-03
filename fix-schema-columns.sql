-- Rename is_active to is_available in menu_items
ALTER TABLE menu_items 
RENAME COLUMN is_active TO is_available;

-- Rename is_active to is_available in meeting_rooms
ALTER TABLE meeting_rooms 
RENAME COLUMN is_active TO is_available;

-- Add credit_cost_per_hour to meeting_rooms
ALTER TABLE meeting_rooms 
ADD COLUMN credit_cost_per_hour integer;

-- Update credit_cost_per_hour based on hourly_rate
UPDATE meeting_rooms 
SET credit_cost_per_hour = CEIL(hourly_rate / 100)
WHERE hourly_rate IS NOT NULL;

-- Make credit_cost_per_hour NOT NULL
ALTER TABLE meeting_rooms 
ALTER COLUMN credit_cost_per_hour SET NOT NULL;

-- Update all menu items to be available
UPDATE menu_items SET is_available = true;

-- Update all meeting rooms to be available
UPDATE meeting_rooms SET is_available = true;