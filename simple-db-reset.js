import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  console.log('🔄 Starting simple database reset process...');
  
  // Create Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || 'https://awsqtnvjrdntwgnevqoz.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📡 Connected to Supabase successfully');

    // First, let's clear all existing data
    console.log('🗑️  Clearing existing data...');
    
    const tables = [
      'cafe_order_items',
      'cafe_orders', 
      'meeting_bookings',
      'menu_items',
      'menu_categories',
      'meeting_rooms',
      'users',
      'organizations',
      'announcements'
    ];

    for (const table of tables) {
      console.log(`Deleting from ${table}...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0); // Delete all records
      
      if (error) {
        console.log(`Warning: Could not clear ${table}: ${error.message}`);
      } else {
        console.log(`✅ Cleared ${table}`);
      }
    }

    // Now let's insert the data from the data file
    console.log('📥 Reading data file...');
    const dataPath = path.join(__dirname, 'supabase_data_import_final.sql');
    const dataSQL = fs.readFileSync(dataPath, 'utf8');
    console.log('✅ Data file loaded');

    // Extract INSERT statements
    const insertStatements = dataSQL
      .split('\n')
      .filter(line => line.trim().startsWith('INSERT INTO'))
      .map(line => line.trim());

    console.log(`Found ${insertStatements.length} INSERT statements`);

    // Execute each INSERT statement using raw SQL
    for (const statement of insertStatements) {
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

    // Verify the import by checking table counts
    console.log('🔍 Verifying data import...');
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

    console.log('🎉 Simple database reset completed!');

  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('🎯 Simple database reset process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Simple database reset failed:', error);
    process.exit(1);
  }); 