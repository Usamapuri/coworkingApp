import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBookingsEndpoint() {
  console.log('🔍 Testing bookings endpoint...\n');
  
  try {
    // Test direct query
    console.log('📋 Testing direct query...');
    const { data: bookings, error } = await supabase
      .from('meeting_bookings')
      .select(`
        *,
        users!meeting_bookings_user_id_fkey(id, first_name, last_name, email),
        meeting_rooms!meeting_bookings_room_id_fkey(id, name, capacity),
        organizations!meeting_bookings_org_id_fkey(id, name)
      `);
    
    if (error) {
      console.error('❌ Error querying bookings:', error);
    } else {
      console.log('✅ Query successful');
      console.log(`Found ${bookings?.length || 0} bookings`);
      if (bookings?.length > 0) {
        console.log('Sample booking:', bookings[0]);
      }
    }
    
    // Check foreign key constraints
    console.log('\n🔍 Checking foreign key constraints...');
    
    const { data: fkData, error: fkError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          tc.constraint_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'meeting_bookings';
      `
    });
    
    if (fkError) {
      console.error('❌ Error checking foreign key constraints:', fkError);
    } else {
      console.log('✅ Foreign key constraints:');
      console.log(fkData);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testBookingsEndpoint();