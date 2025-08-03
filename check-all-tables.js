import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllTables() {
  console.log('🔍 Checking all tables in database...');
  
  const tablesToCheck = [
    'users',
    'organizations', 
    'menu_items',
    'meeting_rooms',
    'cafe_orders',
    'cafe_order_items',
    'bookings',
    'announcements',
    'sessions'
  ];
  
  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        const { count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        console.log(`✅ ${tableName}: ${count} records`);
      }
    } catch (error) {
      console.log(`❌ ${tableName}: ${error.message}`);
    }
  }
}

checkAllTables(); 