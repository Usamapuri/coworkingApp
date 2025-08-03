import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCafeOrdersTables() {
  console.log('🔧 Fixing cafe orders tables...\n');
  
  try {
    // Drop existing tables
    console.log('🗑️ Dropping existing tables...');
    const dropTables = `
      DROP TABLE IF EXISTS public.cafe_order_items CASCADE;
      DROP TABLE IF EXISTS public.cafe_orders CASCADE;
    `;
    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropTables });
    if (dropError) {
      console.error('❌ Error dropping tables:', dropError);
      return;
    }
    console.log('✅ Tables dropped');
    
    // Create tables with proper foreign key constraints
    console.log('\n📝 Creating tables with proper constraints...');
    const createTables = `
      -- Create cafe_orders table
      CREATE TABLE public.cafe_orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        billed_to VARCHAR(50) NOT NULL DEFAULT 'personal',
        org_id INTEGER,
        notes TEXT,
        delivery_location TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        handled_by INTEGER,
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        site VARCHAR(50) NOT NULL DEFAULT 'main',
        CONSTRAINT cafe_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
        CONSTRAINT cafe_orders_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE SET NULL,
        CONSTRAINT cafe_orders_handled_by_fkey FOREIGN KEY (handled_by) REFERENCES public.users(id) ON DELETE SET NULL
      );
      
      -- Create cafe_order_items table
      CREATE TABLE public.cafe_order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER,
        menu_item_id INTEGER,
        quantity INTEGER NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT cafe_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.cafe_orders(id) ON DELETE CASCADE,
        CONSTRAINT cafe_order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTables });
    if (createError) {
      console.error('❌ Error creating tables:', createError);
      return;
    }
    console.log('✅ Tables created with proper constraints');
    
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
        AND tc.table_name IN ('cafe_orders', 'cafe_order_items');
    `;
    
    const { data: constraints, error: checkError } = await supabase.rpc('exec_sql', { sql: checkConstraints });
    if (checkError) {
      console.error('❌ Error checking constraints:', checkError);
      return;
    }
    console.log('✅ Foreign key constraints verified:', constraints);
    
    // Test queries with joins
    console.log('\n🔍 Testing queries with joins...');
    
    // Test cafe_orders query
    const { data: orders, error: ordersError } = await supabase
      .from('cafe_orders')
      .select(`
        *,
        users!cafe_orders_user_id_fkey(id, first_name, last_name, email),
        organizations!cafe_orders_org_id_fkey(id, name)
      `);
    
    if (ordersError) {
      console.error('❌ Error testing cafe_orders query:', ordersError);
    } else {
      console.log('✅ cafe_orders query successful');
      console.log(`Found ${orders?.length || 0} orders`);
    }
    
    // Test cafe_order_items query
    const { data: items, error: itemsError } = await supabase
      .from('cafe_order_items')
      .select(`
        *,
        cafe_orders!cafe_order_items_order_id_fkey(id, user_id, total_amount),
        menu_items!cafe_order_items_menu_item_id_fkey(id, name, price)
      `);
    
    if (itemsError) {
      console.error('❌ Error testing cafe_order_items query:', itemsError);
    } else {
      console.log('✅ cafe_order_items query successful');
      console.log(`Found ${items?.length || 0} order items`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixCafeOrdersTables();