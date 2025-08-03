import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl);

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('📡 Attempting to connect...');
  
  // Test a simple query
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Supabase query failed:');
    console.error('Error:', error.message);
  } else {
    console.log('✅ Supabase connection successful!');
    console.log('Data:', data);
  }
  
} catch (error) {
  console.error('❌ Connection failed:');
  console.error('Error type:', error.constructor.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
} 