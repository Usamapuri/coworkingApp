import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMenuAPI() {
  console.log('🔍 Testing Menu API...\n');

  try {
    // Test 1: Get all menu items directly from Supabase
    console.log('1️⃣ Testing direct Supabase query for menu items:');
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true);
    
    if (menuError) {
      console.error('❌ Error fetching menu items:', menuError);
    } else {
      console.log('✅ Menu items found:', menuItems?.length || 0);
      if (menuItems && menuItems.length > 0) {
        console.log('📋 Sample menu item:', menuItems[0]);
      }
    }

    // Test 2: Get all menu items without is_active filter
    console.log('\n2️⃣ Testing Supabase query without is_active filter:');
    const { data: allMenuItems, error: allMenuError } = await supabase
      .from('menu_items')
      .select('*');
    
    if (allMenuError) {
      console.error('❌ Error fetching all menu items:', allMenuError);
    } else {
      console.log('✅ All menu items found:', allMenuItems?.length || 0);
      if (allMenuItems && allMenuItems.length > 0) {
        console.log('📋 Sample menu item:', allMenuItems[0]);
      }
    }

    // Test 3: Get meeting rooms
    console.log('\n3️⃣ Testing direct Supabase query for meeting rooms:');
    const { data: meetingRooms, error: roomError } = await supabase
      .from('meeting_rooms')
      .select('*')
      .eq('is_active', true);
    
    if (roomError) {
      console.error('❌ Error fetching meeting rooms:', roomError);
    } else {
      console.log('✅ Meeting rooms found:', meetingRooms?.length || 0);
      if (meetingRooms && meetingRooms.length > 0) {
        console.log('📋 Sample meeting room:', meetingRooms[0]);
      }
    }

    // Test 4: Get all meeting rooms without is_active filter
    console.log('\n4️⃣ Testing Supabase query for all meeting rooms:');
    const { data: allMeetingRooms, error: allRoomError } = await supabase
      .from('meeting_rooms')
      .select('*');
    
    if (allRoomError) {
      console.error('❌ Error fetching all meeting rooms:', allRoomError);
    } else {
      console.log('✅ All meeting rooms found:', allMeetingRooms?.length || 0);
      if (allMeetingRooms && allMeetingRooms.length > 0) {
        console.log('📋 Sample meeting room:', allMeetingRooms[0]);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testMenuAPI(); 