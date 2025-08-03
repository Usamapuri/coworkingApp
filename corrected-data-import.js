import { createClient } from '@supabase/supabase-js';

async function importData() {
  console.log('🔄 Importing data into new Supabase database...');
  
  const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📡 Connected to Supabase project');

    // Import organizations
    console.log('📥 Importing organizations...');
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .insert([
        {
          name: 'Blue Area Branch',
          site: 'blue_area'
        },
        {
          name: 'I-10 Branch',
          site: 'i_10'
        }
      ]);

    if (orgError) {
      console.log('❌ Error importing organizations:', orgError.message);
    } else {
      console.log('✅ Organizations imported');
    }

    // Import users
    console.log('📥 Importing users...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .insert([
        {
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@calmkaaj.com',
          password_hash: '$2b$10$example_hash',
          role: 'admin',
          organization_id: 1
        },
        {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@calmkaaj.com',
          password_hash: '$2b$10$example_hash',
          role: 'user',
          organization_id: 1
        }
      ]);

    if (userError) {
      console.log('❌ Error importing users:', userError.message);
    } else {
      console.log('✅ Users imported');
    }

    // Import menu categories
    console.log('📥 Importing menu categories...');
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .insert([
        {
          name: 'Beverages',
          description: 'Hot and cold drinks',
          site: 'blue_area',
          is_active: true
        },
        {
          name: 'Snacks',
          description: 'Light snacks and appetizers',
          site: 'blue_area',
          is_active: true
        }
      ]);

    if (catError) {
      console.log('❌ Error importing menu categories:', catError.message);
    } else {
      console.log('✅ Menu categories imported');
    }

    // Import menu items
    console.log('📥 Importing menu items...');
    const { data: items, error: itemError } = await supabase
      .from('menu_items')
      .insert([
        {
          name: 'Coffee',
          description: 'Fresh brewed coffee',
          price: 150,
          category_id: 1,
          site: 'blue_area',
          is_active: true
        },
        {
          name: 'Tea',
          description: 'Hot tea',
          price: 100,
          category_id: 1,
          site: 'blue_area',
          is_active: true
        },
        {
          name: 'Sandwich',
          description: 'Fresh sandwich',
          price: 250,
          category_id: 2,
          site: 'blue_area',
          is_active: true
        }
      ]);

    if (itemError) {
      console.log('❌ Error importing menu items:', itemError.message);
    } else {
      console.log('✅ Menu items imported');
    }

    // Import meeting rooms
    console.log('📥 Importing meeting rooms...');
    const { data: rooms, error: roomError } = await supabase
      .from('meeting_rooms')
      .insert([
        {
          name: 'Conference Room A',
          capacity: 10,
          hourly_rate: 1000,
          site: 'blue_area',
          is_active: true
        },
        {
          name: 'Meeting Room B',
          capacity: 6,
          hourly_rate: 800,
          site: 'blue_area',
          is_active: true
        }
      ]);

    if (roomError) {
      console.log('❌ Error importing meeting rooms:', roomError.message);
    } else {
      console.log('✅ Meeting rooms imported');
    }

    // Import announcements
    console.log('📥 Importing announcements...');
    const { data: announcements, error: annError } = await supabase
      .from('announcements')
      .insert([
        {
          title: 'Welcome to CalmKaaj',
          body: 'Welcome to our coworking space!',
          site: 'blue_area',
          is_active: true
        }
      ]);

    if (annError) {
      console.log('❌ Error importing announcements:', annError.message);
    } else {
      console.log('✅ Announcements imported');
    }

    // Verify the import
    console.log('🔍 Verifying data import...');
    const tables = [
      'organizations',
      'users', 
      'menu_categories',
      'menu_items',
      'meeting_rooms',
      'announcements'
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

    console.log('🎉 Data import completed!');

  } catch (error) {
    console.error('❌ Error during data import:', error);
    throw error;
  }
}

// Run the import
importData()
  .then(() => {
    console.log('🎯 Data import process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Data import failed:', error);
    process.exit(1);
  }); 