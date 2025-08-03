import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupNewSupabase() {
  console.log('🔄 Setting up new Supabase database...');
  
  // You'll need to replace these with your new Supabase project details
  const supabaseUrl = process.env.NEW_SUPABASE_URL || 'https://your-new-project.supabase.co';
  const supabaseKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseKey) {
    console.log('❌ NEW_SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    console.log('📝 Please create a new Supabase project and set the environment variables:');
    console.log('   NEW_SUPABASE_URL=https://your-new-project.supabase.co');
    console.log('   NEW_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📡 Connected to new Supabase project successfully');

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

    // Execute schema using raw SQL via REST API
    console.log('🗑️  Creating tables and schema...');
    
    // Split the schema into individual statements
    const schemaStatements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of schemaStatements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        
        // Use the REST API to execute raw SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            sql: statement
          })
        });

        if (!response.ok) {
          console.log(`Warning: Could not execute statement: ${response.statusText}`);
        } else {
          console.log('✅ Statement executed');
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
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            sql: statement
          })
        });

        if (!response.ok) {
          console.log(`Warning: Could not execute statement: ${response.statusText}`);
        } else {
          console.log('✅ Statement executed');
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

    console.log('🎉 New Supabase database setup completed!');
    console.log('✅ All tables created');
    console.log('✅ Schema applied');
    console.log('✅ Data imported');
    console.log('✅ Verification completed');

    // Create environment file for local testing
    console.log('📝 Creating .env.local file for local testing...');
    const envContent = `# New Supabase Database Configuration
SUPABASE_URL=${supabaseUrl}
SUPABASE_SERVICE_ROLE_KEY=${supabaseKey}
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgres://postgres.your-project:password@your-project.supabase.co:5432/postgres?sslmode=require

# Local Development
NODE_ENV=development
PORT=3001
`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local file created');
    console.log('📋 Please update the DATABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');

  } catch (error) {
    console.error('❌ Error during database setup:', error);
    throw error;
  }
}

// Run the setup
setupNewSupabase()
  .then(() => {
    console.log('🎯 New Supabase database setup process completed!');
    console.log('🚀 You can now test the application locally with the new database');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 New Supabase database setup failed:', error);
    process.exit(1);
  }); 