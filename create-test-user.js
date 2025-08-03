import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  console.log('🔧 Creating test user...');

  // Delete existing test user if exists
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('email', 'test@calmkaaj.com');

  if (deleteError) {
    console.log('❌ Error deleting existing user:', deleteError.message);
  }

  // Create new test user
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
    return;
  }

  console.log('✅ Test user created successfully');

  // Verify the user
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'test@calmkaaj.com')
    .single();

  if (fetchError) {
    console.log('❌ Error fetching user:', fetchError.message);
    return;
  }

  console.log('👤 Test user details:');
  console.log(JSON.stringify(user, null, 2));

  console.log('\n🎯 Test credentials:');
  console.log('Email: test@calmkaaj.com');
  console.log('Password: testpassword123');
}

createTestUser().catch(console.error);