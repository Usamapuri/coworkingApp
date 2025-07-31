// Test Direct Database Connection (Non-Pooler)
import { neon } from '@neondatabase/serverless';

// Your direct connection string (non-pooler)
const DATABASE_URL = 'postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require';

console.log('🔍 Testing direct database connection...');
console.log('Connection string:', DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Hide password

const sql = neon(DATABASE_URL);

async function testConnection() {
  try {
    console.log('📋 Attempting to connect...');
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('✅ Connection successful!');
    console.log('🕐 Server time:', result[0].current_time);
    console.log('📊 Database version:', result[0].db_version.split(' ')[0]);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.cause) {
      console.error('🔍 Root cause:', error.cause.message);
    }
  }
}

testConnection(); 