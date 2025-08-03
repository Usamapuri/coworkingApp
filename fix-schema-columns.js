import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSchemaColumns() {
  console.log('🔧 Fixing schema columns...');

  try {
    // 1. Rename is_active to is_available in menu_items
    const { error: menuError } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE menu_items 
        RENAME COLUMN is_active TO is_available;
      `
    });
    if (menuError) {
      console.log('⚠️ Menu items column already renamed:', menuError.message);
    } else {
      console.log('✅ Renamed menu_items.is_active to is_available');
    }

    // 2. Rename is_active to is_available in meeting_rooms
    const { error: roomError } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE meeting_rooms 
        RENAME COLUMN is_active TO is_available;
      `
    });
    if (roomError) {
      console.log('⚠️ Meeting rooms column already renamed:', roomError.message);
    } else {
      console.log('✅ Renamed meeting_rooms.is_active to is_available');
    }

    // 3. Add credit_cost_per_hour to meeting_rooms if it doesn't exist
    const { error: creditError } = await supabase.rpc('exec_sql', {
      query: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'meeting_rooms' 
            AND column_name = 'credit_cost_per_hour'
          ) THEN
            ALTER TABLE meeting_rooms 
            ADD COLUMN credit_cost_per_hour integer;
            
            -- Update credit_cost_per_hour based on hourly_rate
            UPDATE meeting_rooms 
            SET credit_cost_per_hour = CEIL(hourly_rate / 100)
            WHERE hourly_rate IS NOT NULL;
            
            -- Make credit_cost_per_hour NOT NULL after data migration
            ALTER TABLE meeting_rooms 
            ALTER COLUMN credit_cost_per_hour SET NOT NULL;
          END IF;
        END $$;
      `
    });
    if (creditError) {
      console.log('⚠️ Error adding credit_cost_per_hour:', creditError.message);
    } else {
      console.log('✅ Added credit_cost_per_hour to meeting_rooms');
    }

    // 4. Update all menu items to be available
    const { error: updateMenuError } = await supabase
      .from('menu_items')
      .update({ is_available: true })
      .eq('is_available', false);
    
    if (updateMenuError) {
      console.log('⚠️ Error updating menu items:', updateMenuError.message);
    } else {
      console.log('✅ Updated all menu items to be available');
    }

    // 5. Update all meeting rooms to be available
    const { error: updateRoomError } = await supabase
      .from('meeting_rooms')
      .update({ is_available: true })
      .eq('is_available', false);
    
    if (updateRoomError) {
      console.log('⚠️ Error updating meeting rooms:', updateRoomError.message);
    } else {
      console.log('✅ Updated all meeting rooms to be available');
    }

    console.log('✅ Schema fixes completed');
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
  }
}

fixSchemaColumns().catch(console.error);