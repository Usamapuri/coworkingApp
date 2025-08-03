import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database...');

    // 1. Update menu items
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .update({ is_active: true })
      .eq('is_active', false)
      .select();

    if (menuError) {
      console.error('❌ Error updating menu items:', menuError);
    } else {
      console.log('✅ Updated menu items:', menuItems?.length || 0);
    }

    // 2. Update meeting rooms
    const { data: rooms, error: roomError } = await supabase
      .from('meeting_rooms')
      .update({ is_active: true })
      .eq('is_active', false)
      .select();

    if (roomError) {
      console.error('❌ Error updating meeting rooms:', roomError);
    } else {
      console.log('✅ Updated meeting rooms:', rooms?.length || 0);
    }

    // 3. Update test user
    const { data: user, error: userError } = await supabase
      .from('users')
      .update({
        credits: 100,
        used_credits: 0,
        is_active: true,
        can_charge_cafe_to_org: true,
        can_charge_room_to_org: true
      })
      .eq('email', 'test@calmkaaj.com')
      .select();

    if (userError) {
      console.error('❌ Error updating test user:', userError);
    } else {
      console.log('✅ Updated test user:', user);
    }

    console.log('✅ Database fixes completed');
  } catch (error) {
    console.error('❌ Error fixing database:', error);
  }
}

fixDatabase().catch(console.error);