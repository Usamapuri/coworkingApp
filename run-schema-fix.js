import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSchemaMigration() {
  console.log('🔧 Running schema migration...');

  try {
    // Read the SQL file
    const sql = fs.readFileSync('fix-schema.sql', 'utf8');

    // Split into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());

    // Execute each statement
    for (const statement of statements) {
      if (!statement.trim()) continue;

      console.log('\n📝 Executing SQL:');
      console.log(statement.trim());

      const { error } = await supabase.rpc('exec_sql', {
        query: statement.trim()
      });

      if (error) {
        console.log('❌ Error:', error.message);
      } else {
        console.log('✅ Success');
      }
    }

    // Verify the changes
    console.log('\n🔍 Verifying changes...');

    // Check users table
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@calmkaaj.com')
      .single();

    console.log('\n👤 Test user data:');
    console.log(JSON.stringify(user, null, 2));

    // Check menu items
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true);

    console.log('\n🍽️ Active menu items:', menuItems?.length || 0);

    // Check meeting rooms
    const { data: rooms } = await supabase
      .from('meeting_rooms')
      .select('*')
      .eq('is_active', true);

    console.log('\n🏢 Active meeting rooms:', rooms?.length || 0);
    if (rooms?.length > 0) {
      console.log('Sample room:', JSON.stringify(rooms[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

runSchemaMigration().catch(console.error);