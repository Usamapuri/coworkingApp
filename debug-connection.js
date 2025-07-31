// Debug Supabase connection issues
const { neon } = require('@neondatabase/serverless');

async function debugConnection() {
  console.log('🔍 Debugging Supabase connection...\n');
  
  // Check environment variable
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL is not set!');
    console.log('Please set it in Vercel environment variables');
    return;
  }
  
  console.log('✅ POSTGRES_URL is set');
  const connStr = process.env.POSTGRES_URL;
  
  // Analyze connection string
  console.log('\n📋 Connection String Analysis:');
  console.log('Length:', connStr.length);
  console.log('Starts with:', connStr.substring(0, 20) + '...');
  console.log('Contains "supabase.com":', connStr.includes('supabase.com'));
  console.log('Contains "pooler":', connStr.includes('pooler'));
  console.log('Contains "aws-0":', connStr.includes('aws-0'));
  
  // Check for common issues
  console.log('\n🔍 Checking for common issues:');
  
  if (!connStr.includes('supabase.com')) {
    console.error('❌ Not a Supabase connection string');
    return;
  }
  
  if (!connStr.includes('pooler')) {
    console.warn('⚠️  Not using pooler (recommended for Vercel)');
    console.log('   Consider using pooler connection for better reliability');
  }
  
  if (connStr.includes('db.dtwrnpoqfvensnrvchkr.supabase.co')) {
    console.warn('⚠️  Using old direct connection format');
    console.log('   This might be the issue - try using pooler connection');
  }
  
  // Try to connect
  console.log('\n🚀 Attempting connection...');
  try {
    const sql = neon(connStr);
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    console.log('✅ Connection successful!');
    console.log('Test result:', result);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DNS Resolution Issue:');
      console.error('- Check if Supabase project is active');
      console.error('- Verify connection string hostname is correct');
      console.error('- Try using pooler connection instead of direct');
    }
    
    if (error.message.includes('authentication')) {
      console.error('\n🔍 Authentication Issue:');
      console.error('- Check database password');
      console.error('- Verify username is correct');
    }
    
    if (error.message.includes('timeout')) {
      console.error('\n🔍 Timeout Issue:');
      console.error('- Check network connectivity');
      console.error('- Try using pooler connection');
    }
  }
}

debugConnection().catch(console.error); 