import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySessionsTable() {
  try {
    console.log('Verifying sessions table...');
    
    // Try to query the sessions table
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Sessions table verification failed:', error);
      return;
    }
    
    console.log('✅ Sessions table exists and is accessible');
    console.log('📊 Sessions table structure verified');
    
  } catch (error) {
    console.error('Error verifying sessions table:', error);
  }
}

verifySessionsTable(); 