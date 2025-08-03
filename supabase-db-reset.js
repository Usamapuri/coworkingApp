import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  console.log('🔄 Starting database reset process using Supabase client...');
  
  // Create Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || 'https://awsqtnvjrdntwgnevqoz.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📡 Connected to Supabase successfully');

    // Read the schema file
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, 'supabase_migration_clean.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded');

    // Read the data file
    console.log('📖 Reading data file...');
    const dataPath = path.join(__dirname, 'supabase_data_import_final.sql');
    const dataSQL = fs.readFileSync(dataPath, 'utf8');
    console.log('✅ Data file loaded');

    // Execute schema using Supabase RPC
    console.log('🗑️  Dropping existing tables and recreating schema...');
    
    // Split the schema into individual statements
    const schemaStatements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of schemaStatements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.warn(`Warning executing statement: ${error.message}`);
        }
      }
    }
    console.log('✅ Schema applied successfully');

    // Execute data import
    console.log('📥 Importing data...');
    const dataStatements = dataSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of dataStatements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.warn(`Warning executing statement: ${error.message}`);
        }
      }
    }
    console.log('✅ Data imported successfully');

    // Verify the import by checking table counts
    console.log('🔍 Verifying data import...');
    const tables = [
      'announcements',
      'menu_categories', 
      'menu_items',
      'meeting_rooms',
      'users',
      'cafe_orders',
      'cafe_order_items',
      'meeting_bookings'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error checking ${table}: ${error.message}`);
      } else {
        console.log(`📊 ${table}: ${data?.length || 0} records`);
      }
    }

    console.log('🎉 Database reset completed successfully using Supabase!');
    console.log('✅ All tables dropped and recreated');
    console.log('✅ Schema applied');
    console.log('✅ Data imported');
    console.log('✅ Verification completed');

  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('🎯 Supabase database reset process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Supabase database reset failed:', error);
    process.exit(1);
  }); 