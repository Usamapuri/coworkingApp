import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSSLBypass() {
  console.log('🔧 Testing different PostgreSQL connection approaches...\n');
  
  // Get the DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  console.log('📋 DATABASE_URL format:', databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'NOT SET');
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not set');
    return;
  }
  
  // Test different connection approaches
  const connectionTests = [
    {
      name: 'Direct connection with SSL disabled',
      config: {
        connectionString: databaseUrl,
        ssl: false
      }
    },
    {
      name: 'Direct connection with minimal SSL',
      config: {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false
        }
      }
    },
    {
      name: 'Direct connection with full SSL bypass',
      config: {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
          checkServerIdentity: () => undefined,
          ca: undefined,
          cert: undefined,
          key: undefined
        }
      }
    },
    {
      name: 'Parsed connection string with SSL disabled',
      config: (() => {
        const url = new URL(databaseUrl);
        return {
          host: url.hostname,
          port: parseInt(url.port),
          database: url.pathname.substring(1),
          user: url.username,
          password: url.password,
          ssl: false
        };
      })()
    }
  ];
  
  for (let i = 0; i < connectionTests.length; i++) {
    const test = connectionTests[i];
    console.log(`🔍 Test ${i + 1}: ${test.name}`);
    
    try {
      const client = new pg.Client(test.config);
      await client.connect();
      const result = await client.query('SELECT NOW() as current_time');
      await client.end();
      
      console.log(`✅ SUCCESS: ${test.name}`);
      console.log(`   Current time: ${result.rows[0].current_time}`);
      console.log(`   Working config:`, JSON.stringify(test.config, null, 2));
      return test.config; // Return the working configuration
      
    } catch (error) {
      console.log(`❌ FAILED: ${test.name}`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('❌ All connection tests failed');
  return null;
}

testSSLBypass(); 