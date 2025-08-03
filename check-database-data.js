import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database contents...');
  
  try {
    // Check all tables
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
        .select('*');
      
      if (error) {
        console.log(`❌ Error checking ${table}: ${error.message}`);
      } else {
        console.log(`📊 ${table}: ${data?.length || 0} records`);
        if (data && data.length > 0) {
          console.log(`   Sample data:`, data[0]);
        }
      }
    }

    // Create a test user for login
    console.log('\n👤 Creating test user for login...');
    
    // First, let's create an organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: 'Test Organization',
        site: 'blue_area'
      })
      .select()
      .single();

    if (orgError) {
      console.log('❌ Error creating organization:', orgError.message);
    } else {
      console.log('✅ Organization created:', org);
      
      // Now create a user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          password_hash: '$2b$10$example_hash_for_testing',
          role: 'user',
          organization_id: org.id
        })
        .select()
        .single();

      if (userError) {
        console.log('❌ Error creating user:', userError.message);
      } else {
        console.log('✅ User created:', user);
        console.log('\n🎯 Login credentials:');
        console.log('Email: test@example.com');
        console.log('Password: (any password will work for testing)');
      }
    }

  } catch (error) {
    console.error('❌ Error during database check:', error);
  }
}

checkDatabase()
  .then(() => {
    console.log('\n🎯 Database check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database check failed:', error);
    process.exit(1);
  }); 