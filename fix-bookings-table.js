import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBookingsTable() {
  console.log('🔧 Fixing meeting_bookings table...\n');
  
  try {
    // Drop existing table
    console.log('🗑️ Dropping existing table...');
    const dropTable = `DROP TABLE IF EXISTS public.meeting_bookings;`;
    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropTable });
    if (dropError) {
      console.error('❌ Error dropping table:', dropError);
      return;
    }
    console.log('✅ Table dropped');
    
    // Create table with proper foreign key constraints
    console.log('\n📝 Creating table with proper constraints...');
    const createTable = `
      CREATE TABLE public.meeting_bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
        room_id INTEGER REFERENCES public.meeting_rooms(id) ON DELETE CASCADE,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        org_id INTEGER REFERENCES public.organizations(id) ON DELETE SET NULL,
        billed_to VARCHAR(50) NOT NULL DEFAULT 'user',
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        site VARCHAR(50) NOT NULL DEFAULT 'main',
        credits_used INTEGER NOT NULL DEFAULT 0
      );
      
      -- Add foreign key constraint names
      ALTER TABLE public.meeting_bookings
        RENAME CONSTRAINT meeting_bookings_user_id_fkey TO meeting_bookings_user_id_fkey;
      
      ALTER TABLE public.meeting_bookings
        RENAME CONSTRAINT meeting_bookings_room_id_fkey TO meeting_bookings_room_id_fkey;
      
      ALTER TABLE public.meeting_bookings
        RENAME CONSTRAINT meeting_bookings_org_id_fkey TO meeting_bookings_org_id_fkey;
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTable });
    if (createError) {
      console.error('❌ Error creating table:', createError);
      return;
    }
    console.log('✅ Table created with proper constraints');
    
    // Verify foreign key constraints
    console.log('\n🔍 Verifying foreign key constraints...');
    const checkConstraints = `
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
    `;
    
    const { data: constraints, error: checkError } = await supabase.rpc('exec_sql', { sql: checkConstraints });
    if (checkError) {
      console.error('❌ Error checking constraints:', checkError);
      return;
    }
    console.log('✅ Foreign key constraints verified:', constraints);
    
    // Test a query with joins
    console.log('\n🔍 Testing query with joins...');
    const { data: bookings, error: queryError } = await supabase
      .from('meeting_bookings')
      .select(`
        *,
        users!meeting_bookings_user_id_fkey(id, first_name, last_name, email),
        meeting_rooms!meeting_bookings_room_id_fkey(id, name, capacity),
        organizations!meeting_bookings_org_id_fkey(id, name)
      `);
    
    if (queryError) {
      console.error('❌ Error testing query:', queryError);
    } else {
      console.log('✅ Query successful');
      console.log(`Found ${bookings?.length || 0} bookings`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixBookingsTable();