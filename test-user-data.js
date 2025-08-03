import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserData() {
  console.log('🔍 Testing User Data...\n');

  try {
    // Test 1: Get all users
    console.log('1️⃣ Testing direct Supabase query for users:');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*');
    
    if (userError) {
      console.error('❌ Error fetching users:', userError);
    } else {
      console.log('✅ Users found:', users?.length || 0);
      if (users && users.length > 0) {
        console.log('📋 Sample user:', {
          id: users[0].id,
          email: users[0].email,
          first_name: users[0].first_name,
          last_name: users[0].last_name,
          role: users[0].role,
          site: users[0].site
        });
      }
    }

    // Test 2: Get specific user by email
    console.log('\n2️⃣ Testing user lookup by email (admin@calmkaaj.com):');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@calmkaaj.com')
      .single();
    
    if (adminError) {
      console.error('❌ Error fetching admin user:', adminError);
    } else {
      console.log('✅ Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        first_name: adminUser.first_name,
        last_name: adminUser.last_name,
        role: adminUser.role,
        site: adminUser.site
      });
    }

    // Test 3: Test the exact same query as the health check
    console.log('\n3️⃣ Testing the exact health check query:');
    const { data: healthUsers, error: healthError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (healthError) {
      console.error('❌ Error in health check query:', healthError);
    } else {
      console.log('✅ Health check query result:', {
        data: healthUsers,
        count: healthUsers?.length || 0
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testUserData(); 