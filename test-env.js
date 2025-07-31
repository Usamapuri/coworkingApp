import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

console.log('🔍 Testing .env loading...');

// Load environment variables
dotenv.config();

console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.POSTGRES_URL) {
  console.log('Testing database connection...');
  try {
    const sql = neon(process.env.POSTGRES_URL);
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
} else {
  console.error('❌ POSTGRES_URL not found in .env file');
} 