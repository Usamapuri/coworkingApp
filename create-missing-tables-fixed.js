import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMissingTablesFixed() {
  console.log('🔧 Creating missing tables with correct data types...');
  
  // Create cafe_orders table with INTEGER org_id
  const createCafeOrdersTable = `
    CREATE TABLE IF NOT EXISTS public.cafe_orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES public.users(id),
      total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      billed_to VARCHAR(50) NOT NULL DEFAULT 'user',
      org_id INTEGER REFERENCES public.organizations(id),
      handled_by INTEGER REFERENCES public.users(id),
      notes TEXT,
      site VARCHAR(50) NOT NULL DEFAULT 'main',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      delivery_location VARCHAR(255),
      created_by INTEGER REFERENCES public.users(id),
      payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
      payment_updated_by INTEGER REFERENCES public.users(id),
      payment_updated_at TIMESTAMP WITH TIME ZONE
    );
  `;
  
  // Create bookings table with INTEGER org_id
  const createBookingsTable = `
    CREATE TABLE IF NOT EXISTS public.bookings (
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
      site VARCHAR(50) NOT NULL DEFAULT 'main'
    );
  `;
  
  try {
    console.log('📋 Creating cafe_orders table...');
    const { error: cafeOrdersError } = await supabase.rpc('exec_sql', { sql: createCafeOrdersTable });
    if (cafeOrdersError) {
      console.error('❌ Error creating cafe_orders table:', cafeOrdersError);
    } else {
      console.log('✅ cafe_orders table created successfully');
    }
    
    console.log('📋 Creating bookings table...');
    const { error: bookingsError } = await supabase.rpc('exec_sql', { sql: createBookingsTable });
    if (bookingsError) {
      console.error('❌ Error creating bookings table:', bookingsError);
    } else {
      console.log('✅ bookings table created successfully');
    }
    
    console.log('\n🎉 All missing tables created!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createMissingTablesFixed(); 