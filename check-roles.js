import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRoles() {
  console.log('🔍 Checking available roles...');

  // Get all users to see what roles are in use
  const { data: users, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.log('❌ Error fetching users:', error.message);
    return;
  }

  // Extract unique roles
  const roles = new Set(users.map(user => user.role));
  console.log('\n👥 Available roles:');
  console.log(Array.from(roles));

  // Show sample users for each role
  console.log('\n📋 Sample users by role:');
  for (const role of roles) {
    const user = users.find(u => u.role === role);
    console.log(`\n${role}:`);
    console.log(JSON.stringify(user, null, 2));
  }
}

checkRoles().catch(console.error);