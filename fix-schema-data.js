import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSchemaData() {
  console.log('🔧 Fixing schema and data...');

  // 1. Create test user if not exists
  console.log('\n1️⃣ Creating/updating test user...');
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'test@calmkaaj.com');

  if (!existingUser || existingUser.length === 0) {
    const { error: createError } = await supabase
      .from('users')
      .insert([{
        email: 'test@calmkaaj.com',
        password_hash: '$2b$10$PASDxKCXcJEU35J0jyUOa.RSfXCOfrO5bOANiBPRUx4P0jt0n4E6O', // testpassword123
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        site: 'blue_area'
      }]);

    if (createError) {
      console.log('❌ Error creating test user:', createError.message);
    } else {
      console.log('✅ Test user created');
    }
  } else {
    const { error: updateError } = await supabase
      .from('users')
      .update({
        role: 'user'
      })
      .eq('email', 'test@calmkaaj.com');

    if (updateError) {
      console.log('❌ Error updating test user:', updateError.message);
    } else {
      console.log('✅ Test user updated');
    }
  }

  // 2. Update menu items
  console.log('\n2️⃣ Updating menu items...');
  const { error: menuError } = await supabase
    .from('menu_items')
    .update({ is_active: true })
    .eq('site', 'blue_area');

  if (menuError) {
    console.log('❌ Error updating menu items:', menuError.message);
  } else {
    console.log('✅ Menu items updated');
  }

  // 3. Update meeting rooms
  console.log('\n3️⃣ Updating meeting rooms...');
  const { data: rooms, error: roomsError } = await supabase
    .from('meeting_rooms')
    .select('*');

  if (roomsError) {
    console.log('❌ Error fetching rooms:', roomsError.message);
  } else {
    for (const room of rooms) {
      const { error: updateError } = await supabase
        .from('meeting_rooms')
        .update({
          is_active: true,
          hourly_rate: room.hourly_rate || 1000
        })
        .eq('id', room.id);

      if (updateError) {
        console.log(`❌ Error updating room ${room.name}:`, updateError.message);
      } else {
        console.log(`✅ Updated room ${room.name}`);
      }
    }
  }

  // 4. Verify changes
  console.log('\n4️⃣ Verifying changes...');

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'test@calmkaaj.com')
    .single();

  console.log('\n👤 Test user:');
  console.log(JSON.stringify(user, null, 2));

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true);

  console.log('\n🍽️ Active menu items:', menuItems?.length || 0);

  const { data: activeRooms } = await supabase
    .from('meeting_rooms')
    .select('*')
    .eq('is_active', true);

  console.log('\n🏢 Active meeting rooms:', activeRooms?.length || 0);
  if (activeRooms?.length > 0) {
    console.log('Sample room:', JSON.stringify(activeRooms[0], null, 2));
  }
}

fixSchemaData().catch(console.error);