import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createSessionsTable() {
  try {
    console.log('Creating sessions table...');
    
    // SQL to create the sessions table
    const createSessionsTableSQL = `
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      )
      WITH (OIDS=FALSE);
      
      ALTER TABLE sessions ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
      
      CREATE INDEX IF NOT EXISTS IDX_sessions_expire ON sessions (expire);
    `;
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: createSessionsTableSQL });
    
    if (error) {
      console.error('Error creating sessions table:', error);
      return;
    }
    
    console.log('✅ Sessions table created successfully');
    
    // Verify the table exists
    const { data: tables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'sessions');
    
    if (listError) {
      console.error('Error checking sessions table:', listError);
      return;
    }
    
    if (tables && tables.length > 0) {
      console.log('✅ Sessions table verified in database');
    } else {
      console.log('⚠️ Sessions table not found in database');
    }
    
  } catch (error) {
    console.error('Error creating sessions table:', error);
  }
}

createSessionsTable(); 