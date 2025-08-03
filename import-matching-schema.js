import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importMatchingSchema() {
  console.log('🔄 Importing data that matches current database schema...');
  
  try {
    // Import users with correct schema
    console.log('👥 Importing users...');
    const usersData = [
      {
        id: 1,
        email: 'admin@calmkaaj.com',
        password_hash: await bcrypt.hash('admin123', 10),
        first_name: 'CalmKaaj',
        last_name: 'Team',
        role: 'admin',
        site: 'blue_area'
      },
      {
        id: 2,
        email: 'manager@calmkaaj.com',
        password_hash: await bcrypt.hash('manager123', 10),
        first_name: 'Cafe',
        last_name: 'Manager',
        role: 'manager',
        site: 'blue_area'
      },
      {
        id: 3,
        email: 'member@xyz.com',
        password_hash: await bcrypt.hash('member123', 10),
        first_name: 'Member',
        last_name: 'User',
        role: 'user',
        site: 'blue_area'
      },
      {
        id: 4,
        email: 'test@example.com',
        password_hash: await bcrypt.hash('test123', 10),
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        site: 'blue_area'
      }
    ];

    // Clear existing users and insert new ones
    await supabase.from('users').delete().neq('id', 0);
    
    for (const user of usersData) {
      const { error } = await supabase.from('users').insert(user);
      if (error) {
        console.log(`⚠️ Warning inserting user ${user.email}: ${error.message}`);
      }
    }
    console.log('✅ Users imported');

    // Import menu categories (already have data, just verify)
    console.log('📋 Menu categories already exist');

    // Import menu items with correct schema
    console.log('🍽️ Importing menu items...');
    const menuItemsData = [
      { id: 1, name: 'Cappuccino', description: 'Freshly brewed cappuccino', price: 4.50, category_id: 1, site: 'blue_area' },
      { id: 2, name: 'Green Tea', description: 'Organic green tea', price: 3.00, category_id: 1, site: 'blue_area' },
      { id: 3, name: 'Chicken Sandwich', description: 'Grilled chicken sandwich with fresh vegetables', price: 8.50, category_id: 3, site: 'blue_area' },
      { id: 4, name: 'Fruit Salad', description: 'Fresh seasonal fruit salad', price: 6.00, category_id: 2, site: 'blue_area' },
      { id: 5, name: 'Espresso', description: 'Double shot espresso', price: 3.50, category_id: 1, site: 'i_10' },
      { id: 6, name: 'Latte', description: 'Smooth espresso with steamed milk', price: 280.00, category_id: 1, site: 'blue_area' },
      { id: 7, name: 'Chocolate Cake', description: 'Rich chocolate cake slice', price: 350.00, category_id: 4, site: 'blue_area' },
      { id: 8, name: 'Ice Cream', description: 'Vanilla ice cream scoop', price: 150.00, category_id: 4, site: 'blue_area' },
      { id: 9, name: 'Samosa', description: 'Crispy vegetable samosa', price: 80.00, category_id: 2, site: 'blue_area' },
      { id: 10, name: 'Pasta', description: 'Creamy chicken alfredo pasta', price: 550.00, category_id: 3, site: 'blue_area' }
    ];

    await supabase.from('menu_items').delete().neq('id', 0);
    
    for (const item of menuItemsData) {
      const { error } = await supabase.from('menu_items').insert(item);
      if (error) {
        console.log(`⚠️ Warning inserting menu item ${item.name}: ${error.message}`);
      }
    }
    console.log('✅ Menu items imported');

    // Import meeting rooms with correct schema
    console.log('🏢 Importing meeting rooms...');
    const roomsData = [
      { id: 1, name: 'Conference Room A', description: 'Large conference room with projector', capacity: 12, hourly_rate: 1000, site: 'blue_area' },
      { id: 2, name: 'Meeting Room B', description: 'Small meeting room for team discussions', capacity: 6, hourly_rate: 800, site: 'blue_area' },
      { id: 3, name: 'Executive Suite', description: 'Premium meeting space', capacity: 8, hourly_rate: 1500, site: 'i_10' }
    ];

    await supabase.from('meeting_rooms').delete().neq('id', 0);
    
    for (const room of roomsData) {
      const { error } = await supabase.from('meeting_rooms').insert(room);
      if (error) {
        console.log(`⚠️ Warning inserting room ${room.name}: ${error.message}`);
      }
    }
    console.log('✅ Meeting rooms imported');

    // Final verification
    console.log('\n🔍 Final verification of imported data...');
    const tables = [
      'users',
      'organizations', 
      'menu_categories',
      'menu_items',
      'meeting_rooms'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error checking ${table}: ${error.message}`);
      } else {
        console.log(`📊 ${table}: ${data?.length || 0} records`);
      }
    }

    console.log('\n🎉 Database import finished!');
    console.log('\n🎯 Available login credentials:');
    console.log('👑 Admin: admin@calmkaaj.com (password: admin123)');
    console.log('👨‍💼 Manager: manager@calmkaaj.com (password: manager123)');
    console.log('👤 Member: member@xyz.com (password: member123)');
    console.log('🧪 Test: test@example.com (password: test123)');

  } catch (error) {
    console.error('❌ Error during database import:', error);
    throw error;
  }
}

importMatchingSchema()
  .then(() => {
    console.log('\n🎯 Database import process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database import failed:', error);
    process.exit(1);
  }); 