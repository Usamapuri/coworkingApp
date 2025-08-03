import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBookingsTable() {
  console.log('🔧 Creating meeting_bookings table...');
  
  const createBookingsTable = `
    CREATE TABLE IF NOT EXISTS public.meeting_bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES public.users(id),
      room_id INTEGER REFERENCES public.meeting_rooms(id),
      start_time TIMESTAMP WITH TIME ZONE NOT NULL,
      end_time TIMESTAMP WITH TIME ZONE NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      org_id INTEGER REFERENCES public.organizations(id),
      billed_to VARCHAR(50) NOT NULL DEFAULT 'user',
      payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
      site VARCHAR(50) NOT NULL DEFAULT 'main',
      credits_used INTEGER NOT NULL DEFAULT 0
    );
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createBookingsTable });
    if (error) {
      console.error('❌ Error creating meeting_bookings table:', error);
    } else {
      console.log('✅ meeting_bookings table created successfully');
    }
    
    // Verify the table exists
    const { data, error: verifyError } = await supabase
      .from('meeting_bookings')
      .select('*')
      .limit(1);
    
    if (verifyError) {
      console.error('❌ Error verifying meeting_bookings table:', verifyError);
    } else {
      console.log('✅ meeting_bookings table verified');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createBookingsTable();