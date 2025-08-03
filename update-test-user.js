import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTestUser() {
  console.log('🔧 Updating test user...');

  // First, let's check if the test user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'test@calmkaaj.com');

  if (fetchError) {
    console.log('❌ Error fetching user:', fetchError.message);
    return;
  }

  if (!existingUser || existingUser.length === 0) {
    console.log('❌ Test user not found. Creating new user...');
    
    // Create new test user
    const { error: createError } = await supabase
      .from('users')
      .insert([{
        email: 'test@calmkaaj.com',
        password_hash: '$2b$10$PASDxKCXcJEU35J0jyUOa.RSfXCOfrO5bOANiBPRUx4P0jt0n4E6O', // This is 'testpassword123'
        first_name: 'Test',
        last_name: 'User',
        role: 'member_individual',
        site: 'blue_area',
        is_active: true
      }]);

    if (createError) {
      console.log('❌ Error creating test user:', createError.message);
      return;
    }
    console.log('✅ Test user created successfully');
  }

  // Update test user
  const { error: updateError } = await supabase
    .from('users')
    .update({
      role: 'member_individual',
      is_active: true
    })
    .eq('email', 'test@calmkaaj.com');

  if (updateError) {
    console.log('❌ Error updating test user:', updateError.message);
  } else {
    console.log('✅ Test user updated successfully');
  }

  // Verify the update
  const { data: user, error: verifyError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'test@calmkaaj.com');

  if (verifyError) {
    console.log('❌ Error fetching updated user:', verifyError.message);
  } else {
    console.log('\n👤 Updated user data:');
    console.log(JSON.stringify(user[0], null, 2));
  }
}

updateTestUser().catch(console.error);