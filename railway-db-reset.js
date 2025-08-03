import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  console.log('🔄 Starting database reset process on Railway...');
  
  // Use Railway's environment variables
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to database
    console.log('📡 Connecting to Railway database...');
    await client.connect();
    console.log('✅ Connected to Railway database successfully');

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

    // Execute schema (this will drop and recreate everything)
    console.log('🗑️  Dropping existing tables and recreating schema...');
    await client.query(schemaSQL);
    console.log('✅ Schema applied successfully');

    // Execute data import
    console.log('📥 Importing data...');
    await client.query(dataSQL);
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
      const result = await client.query(`SELECT COUNT(*) FROM public.${table}`);
      console.log(`📊 ${table}: ${result.rows[0].count} records`);
    }

    console.log('🎉 Database reset completed successfully on Railway!');
    console.log('✅ All tables dropped and recreated');
    console.log('✅ Schema applied');
    console.log('✅ Data imported');
    console.log('✅ Verification completed');

  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('🎯 Railway database reset process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Railway database reset failed:', error);
    process.exit(1);
  }); 