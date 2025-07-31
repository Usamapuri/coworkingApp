// Test Supabase connection
const { neon } = require('@neondatabase/serverless');

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test with a sample connection string format
    const sampleConnectionString = 'postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres';
    console.log('Expected format:', sampleConnectionString);
    
    if (!process.env.POSTGRES_URL) {
      console.error('❌ POSTGRES_URL environment variable is not set!');
      console.log('Please set it in Vercel environment variables');
      return false;
    }
    
    console.log('✅ POSTGRES_URL is set');
    console.log('Connection string starts with:', process.env.POSTGRES_URL.substring(0, 50) + '...');
    
    // Check if it's a valid Supabase connection string
    if (!process.env.POSTGRES_URL.includes('supabase.com')) {
      console.error('❌ Connection string does not contain supabase.com');
      return false;
    }
    
    if (!process.env.POSTGRES_URL.includes('pooler.supabase.com')) {
      console.warn('⚠️  Connection string might not be using the pooler (recommended for Vercel)');
    }
    
    console.log('✅ Connection string format looks correct');
    
    // Try to connect
    const sql = neon(process.env.POSTGRES_URL);
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