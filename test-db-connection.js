import { neon } from "@neondatabase/serverless";

const databaseUrl = "postgresql://postgres.grrwjmuosgwoayqytodc:calmkaaj7874@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require";

console.log('🔍 Testing database connection...');
console.log('URL:', databaseUrl.substring(0, 50) + '...');

try {
  const sql = neon(databaseUrl);
  
  console.log('📡 Attempting to connect...');
  
  const result = await sql`SELECT 1 as test`;
  console.log('✅ Connection successful!');
  console.log('Result:', result);
  
} catch (error) {
  console.error('❌ Connection failed:');
  console.error('Error type:', error.constructor.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
} 