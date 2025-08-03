import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTablesData() {
  console.log('🔍 Checking tables data...\n');
  
  // Check menu_items table
  console.log('📋 Checking menu_items table...');
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('*');
  
  if (menuError) {
    console.error('❌ Error fetching menu items:', menuError);
  } else {
    console.log(`✅ Found ${menuItems?.length || 0} menu items`);
    if (menuItems?.length > 0) {
      console.log('Sample menu items:');
      menuItems.slice(0, 3).forEach(item => {
        console.log(`- ${item.name} ($${item.price}) - ${item.is_active ? 'Active' : 'Inactive'}`);
      });
    }
  }
  
  console.log('\n🏢 Checking meeting_rooms table...');
  const { data: rooms, error: roomsError } = await supabase
    .from('meeting_rooms')
    .select('*');
  
  if (roomsError) {
    console.error('❌ Error fetching meeting rooms:', roomsError);
  } else {
    console.log(`✅ Found ${rooms?.length || 0} meeting rooms`);
    if (rooms?.length > 0) {
      console.log('Sample rooms:');
      rooms.slice(0, 3).forEach(room => {
        console.log(`- ${room.name} (${room.capacity} people) - ${room.is_active ? 'Active' : 'Inactive'}`);
      });
    }
  }
  
  // Check if we have any active items/rooms
  console.log('\n🔍 Checking active items...');
  const { data: activeMenuItems, error: activeMenuError } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true);
  
  if (activeMenuError) {
    console.error('❌ Error fetching active menu items:', activeMenuError);
  } else {
    console.log(`✅ Found ${activeMenuItems?.length || 0} active menu items`);
  }
  
  const { data: activeRooms, error: activeRoomsError } = await supabase
    .from('meeting_rooms')
    .select('*')
    .eq('is_active', true);
  
  if (activeRoomsError) {
    console.error('❌ Error fetching active meeting rooms:', activeRoomsError);
  } else {
    console.log(`✅ Found ${activeRooms?.length || 0} active meeting rooms`);
  }
}

checkTablesData();