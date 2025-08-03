import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCafeOrdersTables() {
  console.log('🔍 Checking cafe orders tables...\n');
  
  try {
    // Check cafe_orders table
    console.log('📋 Checking cafe_orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('cafe_orders')
      .select(`
        *,
        users!cafe_orders_user_id_fkey(id, first_name, last_name, email),
        organizations!cafe_orders_org_id_fkey(id, name)
      `);
    
    if (ordersError) {
      console.error('❌ Error querying cafe_orders:', ordersError);
    } else {
      console.log('✅ cafe_orders query successful');
      console.log(`Found ${orders?.length || 0} orders`);
      if (orders?.length > 0) {
        console.log('Sample order:', orders[0]);
      }
    }
    
    // Check cafe_order_items table
    console.log('\n📋 Checking cafe_order_items table...');
    const { data: items, error: itemsError } = await supabase
      .from('cafe_order_items')
      .select(`
        *,
        cafe_orders!cafe_order_items_order_id_fkey(id, user_id, total_amount),
        menu_items!cafe_order_items_menu_item_id_fkey(id, name, price)
      `);
    
    if (itemsError) {
      console.error('❌ Error querying cafe_order_items:', itemsError);
    } else {
      console.log('✅ cafe_order_items query successful');
      console.log(`Found ${items?.length || 0} order items`);
      if (items?.length > 0) {
        console.log('Sample order item:', items[0]);
      }
    }
    
    // Check foreign key constraints
    console.log('\n🔍 Checking foreign key constraints...');
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
        AND tc.table_name IN ('cafe_orders', 'cafe_order_items');
    `;
    
    const { data: constraints, error: checkError } = await supabase.rpc('exec_sql', { sql: checkConstraints });
    if (checkError) {
      console.error('❌ Error checking constraints:', checkError);
      return;
    }
    console.log('✅ Foreign key constraints verified:', constraints);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkCafeOrdersTables();