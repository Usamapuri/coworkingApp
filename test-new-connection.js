// Test New Database Connection
import { neon } from '@neondatabase/serverless';

// Your new connection string
const DATABASE_URL = 'postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x';

console.log('🔍 Testing new database connection...');
console.log('Connection string:', DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Hide password

const sql = neon(DATABASE_URL);

async function testConnection() {
  try {
    console.log('📋 Attempting to connect...');
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('✅ Connection successful!');
    console.log('🕐 Server time:', result[0].current_time);
    console.log('📊 Database version:', result[0].db_version.split(' ')[0]);
    
    // Test if we can create a simple table
    console.log('\n📋 Testing table creation...');
    await sql`CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT)`;
    console.log('✅ Table creation successful!');
    
    // Clean up
    await sql`DROP TABLE IF EXISTS test_table`;
    console.log('✅ Test table cleaned up');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.cause) {
      console.error('🔍 Root cause:', error.cause.message);
    }
  }
}

testConnection(); 