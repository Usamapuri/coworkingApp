import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExactSchema() {
  console.log('🔍 Checking exact database schema details...');
  
  try {
    // Check users table structure
    console.log('\n👥 Users table:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.log(`❌ Error: ${usersError.message}`);
    } else if (users && users.length > 0) {
      console.log('✅ Columns:', Object.keys(users[0]));
      console.log('📊 Sample user:', users[0]);
    } else {
      // Try to insert a minimal user to see what's required
      const testUser = {
        email: 'test@test.com',
        password_hash: 'test_hash',
        first_name: 'Test',
        last_name: 'User',
        role: 'user'
      };
      
      const { error: insertError } = await supabase
        .from('users')
        .insert(testUser);
      
      if (insertError) {
        console.log(`❌ Insert error: ${insertError.message}`);
      } else {
        console.log('✅ Successfully inserted test user');
        await supabase.from('users').delete().eq('email', 'test@test.com');
      }
    }

    // Check meeting_rooms table structure
    console.log('\n🏢 Meeting rooms table:');
    const { data: rooms, error: roomsError } = await supabase
      .from('meeting_rooms')
      .select('*')
      .limit(1);
    
    if (roomsError) {
      console.log(`❌ Error: ${roomsError.message}`);
    } else if (rooms && rooms.length > 0) {
      console.log('✅ Columns:', Object.keys(rooms[0]));
      console.log('📊 Sample room:', rooms[0]);
    } else {
      // Try to insert a minimal room to see what's required
      const testRoom = {
        name: 'Test Room',
        capacity: 5,
        hourly_rate: 100
      };
      
      const { error: insertError } = await supabase
        .from('meeting_rooms')
        .insert(testRoom);
      
      if (insertError) {
        console.log(`❌ Insert error: ${insertError.message}`);
      } else {
        console.log('✅ Successfully inserted test room');
        await supabase.from('meeting_rooms').delete().eq('name', 'Test Room');
      }
    }

    // Check menu_items table structure
    console.log('\n🍽️ Menu items table:');
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .limit(1);
    
    if (itemsError) {
      console.log(`❌ Error: ${itemsError.message}`);
    } else if (items && items.length > 0) {
      console.log('✅ Columns:', Object.keys(items[0]));
      console.log('📊 Sample item:', items[0]);
    }

    // Check what user roles are available
    console.log('\n🎭 Checking available user roles...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('role');
    
    if (allUsersError) {
      console.log(`❌ Error: ${allUsersError.message}`);
    } else {
      const roles = [...new Set(allUsers.map(u => u.role))];
      console.log('✅ Available roles:', roles);
    }

  } catch (error) {
    console.error('❌ Error during schema check:', error);
  }
}

checkExactSchema()
  .then(() => {
    console.log('\n🎯 Schema check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Schema check failed:', error);
    process.exit(1);
  }); 