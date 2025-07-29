import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Quick Database Connection Test\n');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

console.log('Testing connection...');

try {
  const sql = neon(process.env.DATABASE_URL);
  const result = await sql`SELECT 1 as test, NOW() as current_time`;
  console.log('✅ SUCCESS! Database connection working!');
  console.log('Result:', result);
  console.log('\n🎉 Your database connection is now working!');
  console.log('You can now run: npm run dev');
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  console.log('\n💡 Try:');
  console.log('1. Different network (mobile hotspot)');
  console.log('2. VPN service');
  console.log('3. Different location');
  console.log('4. Check Supabase project status');
} 