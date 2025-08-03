import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentSchema() {
  console.log('🔍 Checking current database schema...');
  
  try {
    const tables = [
      'users',
      'organizations', 
      'menu_categories',
      'menu_items',
      'meeting_rooms',
      'meeting_bookings',
      'cafe_orders',
      'cafe_order_items',
      'announcements'
    ];

    for (const table of tables) {
      console.log(`\n📋 Table: ${table}`);
      
      // Try to get one record to see the structure
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Error checking ${table}: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log(`✅ Columns in ${table}:`, Object.keys(data[0]));
        console.log(`📊 Sample data:`, data[0]);
      } else {
        console.log(`📊 ${table}: No data, but table exists`);
        
        // Try to insert a test record to see what columns are available
        const testData = {};
        if (table === 'users') {
          testData.email = 'test@test.com';
          testData.password = 'test';
          testData.first_name = 'Test';
          testData.last_name = 'User';
          testData.role = 'user';
        } else if (table === 'organizations') {
          testData.name = 'Test Org';
          testData.site = 'blue_area';
        } else if (table === 'menu_categories') {
          testData.name = 'Test Category';
          testData.site = 'blue_area';
        } else if (table === 'menu_items') {
          testData.name = 'Test Item';
          testData.price = 10;
          testData.site = 'blue_area';
        } else if (table === 'meeting_rooms') {
          testData.name = 'Test Room';
          testData.capacity = 5;
          testData.site = 'blue_area';
        } else if (table === 'announcements') {
          testData.title = 'Test Announcement';
          testData.body = 'Test body';
          testData.site = 'blue_area';
        }
        
        if (Object.keys(testData).length > 0) {
          const { error: insertError } = await supabase
            .from(table)
            .insert(testData);
          
          if (insertError) {
            console.log(`❌ Insert error for ${table}: ${insertError.message}`);
          } else {
            console.log(`✅ Successfully inserted test record into ${table}`);
            // Clean up the test record
            await supabase.from(table).delete().eq('name', testData.name || 'Test');
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Error during schema check:', error);
  }
}

checkCurrentSchema()
  .then(() => {
    console.log('\n🎯 Schema check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Schema check failed:', error);
    process.exit(1);
  }); 