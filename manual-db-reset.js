import { createClient } from '@supabase/supabase-js';

async function resetDatabase() {
  console.log('🔄 Starting manual database reset process...');
  
  // Create Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || 'https://awsqtnvjrdntwgnevqoz.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📡 Connected to Supabase successfully');

    // First, let's clear all existing data
    console.log('🗑️  Clearing existing data...');
    
    const tables = [
      'cafe_order_items',
      'cafe_orders', 
      'meeting_bookings',
      'menu_items',
      'menu_categories',
      'meeting_rooms',
      'users',
      'organizations',
      'announcements'
    ];

    for (const table of tables) {
      console.log(`Deleting from ${table}...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0); // Delete all records
      
      if (error) {
        console.log(`Warning: Could not clear ${table}: ${error.message}`);
      } else {
        console.log(`✅ Cleared ${table}`);
      }
    }

    // Now let's insert the data manually
    console.log('📥 Inserting data...');

    // Insert Announcements
    console.log('Inserting announcements...');
    const announcements = [
      {
        id: 1,
        title: 'Welcome to CalmKaaj',
        body: 'Welcome to your new coworking space! Enjoy our facilities and services.',
        image_url: null,
        show_until: null,
        is_active: true,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.399773',
        sites: ['blue_area']
      },
      {
        id: 5,
        title: 'efwe',
        body: 'rgf3erogfj3refg3r',
        image_url: '',
        show_until: '2025-07-05 19:05:00',
        is_active: true,
        site: 'blue_area',
        created_at: '2025-07-06 11:05:22.950913',
        sites: ['blue_area', 'i_10']
      }
    ];

    const { error: annError } = await supabase
      .from('announcements')
      .insert(announcements);
    
    if (annError) {
      console.log(`Warning: Could not insert announcements: ${annError.message}`);
    } else {
      console.log('✅ Announcements inserted');
    }

    // Insert Menu Categories
    console.log('Inserting menu categories...');
    const menuCategories = [
      { id: 1, name: 'Beverages', description: 'Hot and cold drinks', is_active: true, site: 'blue_area' },
      { id: 2, name: 'Snacks', description: 'Light bites and snacks', is_active: true, site: 'blue_area' },
      { id: 3, name: 'Meals', description: 'Full meals and lunch items', is_active: true, site: 'blue_area' }
    ];

    const { error: catError } = await supabase
      .from('menu_categories')
      .insert(menuCategories);
    
    if (catError) {
      console.log(`Warning: Could not insert menu categories: ${catError.message}`);
    } else {
      console.log('✅ Menu categories inserted');
    }

    // Insert Menu Items
    console.log('Inserting menu items...');
    const menuItems = [
      {
        id: 1,
        name: 'Cappuccino',
        description: 'Freshly brewed cappuccino',
        price: 4.50,
        category_id: 1,
        is_active: true,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.263323'
      },
      {
        id: 2,
        name: 'Green Tea',
        description: 'Organic green tea',
        price: 3.00,
        category_id: 1,
        is_active: true,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.263323'
      },
      {
        id: 3,
        name: 'Chicken Sandwich',
        description: 'Grilled chicken sandwich with fresh vegetables',
        price: 8.50,
        category_id: 3,
        is_active: true,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.263323'
      }
    ];

    const { error: itemError } = await supabase
      .from('menu_items')
      .insert(menuItems);
    
    if (itemError) {
      console.log(`Warning: Could not insert menu items: ${itemError.message}`);
    } else {
      console.log('✅ Menu items inserted');
    }

    // Insert Meeting Rooms
    console.log('Inserting meeting rooms...');
    const meetingRooms = [
      {
        id: 1,
        name: 'Conference Room A',
        capacity: 12,
        hourly_rate: 5.00,
        is_active: true,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.332347'
      },
      {
        id: 2,
        name: 'Meeting Room B',
        capacity: 6,
        hourly_rate: 3.00,
        is_active: true,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.332347'
      }
    ];

    const { error: roomError } = await supabase
      .from('meeting_rooms')
      .insert(meetingRooms);
    
    if (roomError) {
      console.log(`Warning: Could not insert meeting rooms: ${roomError.message}`);
    } else {
      console.log('✅ Meeting rooms inserted');
    }

    // Insert Users
    console.log('Inserting users...');
    const users = [
      {
        id: 1,
        email: 'admin@calmkaaj.com',
        password_hash: '$2b$10$xET24htvRc.gIF/BisGUzuX/ocPVHP.zq/1wardMaEomQbW1lwXEi',
        first_name: 'CalmKaaj',
        last_name: 'Team',
        role: 'admin',
        organization_id: null,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.127274'
      },
      {
        id: 2,
        email: 'manager@calmkaaj.com',
        password_hash: '$2b$10$JXv2QcZ8rR4T7IC6oBxEY.fwB7hstHvfGIGtt5yi4yG2/8KZslZVq',
        first_name: 'Cafe',
        last_name: 'Manager',
        role: 'staff',
        organization_id: null,
        site: 'blue_area',
        created_at: '2025-07-05 16:28:31.127274'
      }
    ];

    const { error: userError } = await supabase
      .from('users')
      .insert(users);
    
    if (userError) {
      console.log(`Warning: Could not insert users: ${userError.message}`);
    } else {
      console.log('✅ Users inserted');
    }

    // Verify the import by checking table counts
    console.log('🔍 Verifying data import...');
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

    console.log('🎉 Manual database reset completed!');

  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('🎯 Manual database reset process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Manual database reset failed:', error);
    process.exit(1);
  }); 