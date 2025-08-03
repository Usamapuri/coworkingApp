import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importCompleteSchema() {
  console.log('🔄 Importing complete schema and data from supabase_migration.sql...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'supabase_migration.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📄 SQL file loaded successfully');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement using Supabase RPC
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
          
          const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: statement
          });
          
          if (error) {
            console.log(`⚠️ Warning on statement ${i + 1}: ${error.message}`);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`⚠️ Warning on statement ${i + 1}: ${err.message}`);
        }
      }
    }
    
    console.log('🎉 Complete schema import finished!');
    
    // Verify the import by checking table counts
    console.log('\n🔍 Verifying data import...');
    const tables = [
      'users',
      'organizations', 
      'menu_categories',
      'menu_items',
      'meeting_rooms',
      'meeting_bookings',
      'cafe_orders',
      'cafe_order_items',
      'announcements'
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

  } catch (error) {
    console.error('❌ Error during schema import:', error);
    throw error;
  }
}

importCompleteSchema()
  .then(() => {
    console.log('\n🎯 Complete schema import process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Schema import failed:', error);
    process.exit(1);
  }); 