import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTables() {
  console.log('🔧 Fixing cafe and meeting room tables...');

  // 1. Update menu items to be available
  console.log('\n1️⃣ Updating menu items availability...');
  const { error: menuError } = await supabase
    .from('menu_items')
    .update({ is_active: true })
    .eq('site', 'blue_area');

  if (menuError) {
    console.log('❌ Error updating menu items:', menuError.message);
  } else {
    console.log('✅ Menu items updated successfully');
  }

  // 2. Update meeting rooms to use credit_cost_per_hour
  console.log('\n2️⃣ Updating meeting rooms availability...');
  const { data: rooms, error: roomsError } = await supabase
    .from('meeting_rooms')
    .select('*');

  if (roomsError) {
    console.log('❌ Error fetching meeting rooms:', roomsError.message);
  } else {
    for (const room of rooms) {
      const { error: updateError } = await supabase
        .from('meeting_rooms')
        .update({
          is_active: true
        })
        .eq('id', room.id);

      if (updateError) {
        console.log(`❌ Error updating room ${room.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated room ${room.name}`);
      }
    }
  }

  // 4. Verify the changes
  console.log('\n4️⃣ Verifying changes...');
  
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true);
  console.log(`📊 Available menu items: ${menuItems?.length || 0}`);

  const { data: availableRooms } = await supabase
    .from('meeting_rooms')
    .select('*')
    .eq('is_active', true);
  console.log(`📊 Available meeting rooms: ${availableRooms?.length || 0}`);

  console.log('\n🎉 Fix completed!');
}

fixTables().catch(console.error);