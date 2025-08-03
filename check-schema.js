import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');

    // 1. Check menu items
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select()
      .limit(1);

    if (menuError) {
      console.error('❌ Error checking menu items:', menuError);
    } else {
      console.log('📋 Menu item columns:', Object.keys(menuItems[0]));
    }

    // 2. Check meeting rooms
    const { data: rooms, error: roomError } = await supabase
      .from('meeting_rooms')
      .select()
      .limit(1);

    if (roomError) {
      console.error('❌ Error checking meeting rooms:', roomError);
    } else {
      console.log('🏢 Meeting room columns:', Object.keys(rooms[0]));
    }

    // 3. Check users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select()
      .limit(1);

    if (userError) {
      console.error('❌ Error checking users:', userError);
    } else {
      console.log('👤 User columns:', Object.keys(users[0]));
    }

    console.log('✅ Schema check completed');
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkSchema().catch(console.error);