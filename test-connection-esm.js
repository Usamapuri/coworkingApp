// Test Supabase connection - ES Module version
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test with a sample connection string format
    const sampleConnectionString = 'postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres';
    console.log('Expected format:', sampleConnectionString);
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set!');
      console.log('Please set it in Vercel environment variables');
      return false;
    }
    
    console.log('✅ DATABASE_URL is set');
    console.log('Connection string starts with:', process.env.DATABASE_URL.substring(0, 50) + '...');
    
    // Check if it's a valid Supabase connection string
    if (!process.env.DATABASE_URL.includes('supabase.com')) {
      console.error('❌ Connection string does not contain supabase.com');
      return false;
    }
    
    if (!process.env.DATABASE_URL.includes('pooler.supabase.com')) {
      console.warn('⚠️  Connection string might not be using the pooler (recommended for Vercel)');
    }
    
    console.log('✅ Connection string format looks correct');
    
    // Try to connect
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Test query result:', result);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 This suggests a DNS resolution issue or incorrect hostname');
      console.error('Please check your Supabase project is active and connection string is correct');
    }
    
    if (error.message.includes('authentication')) {
      console.error('🔍 This suggests incorrect password or username');
    }
    
    if (error.message.includes('fetch failed')) {
      console.error('🔍 This suggests a network connectivity issue');
      console.error('Check your internet connection and firewall settings');
    }
    
    return false;
  }
}

testSupabaseConnection().then(success => {
  if (success) {
    console.log('🎉 Supabase connection test passed!');
  } else {
    console.log('💥 Supabase connection test failed!');
  }
  process.exit(success ? 0 : 1);
}); 