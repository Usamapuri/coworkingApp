import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔧 Vercel Database Connection Fix\n');

async function fixVercelConnection() {
  console.log('📋 Current Environment Variables:');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
  
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ DATABASE_URL is not set in Vercel environment variables!');
    console.log('\n🔧 To fix this:');
    console.log('1. Go to your Vercel dashboard');
    console.log('2. Select project: coworking-app-ywpo');
    console.log('3. Go to Settings → Environment Variables');
    console.log('4. Add DATABASE_URL with your Supabase connection string');
    console.log('\n📋 Get your connection string from Supabase:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Settings → Database');
    console.log('4. Copy the "Connection string" (URI format)');
    return;
  }

  const currentUrl = process.env.DATABASE_URL;
  console.log('\n🔗 Current connection string format:');
  console.log('Contains "pooler":', currentUrl.includes('pooler'));
  console.log('Contains "aws-0":', currentUrl.includes('aws-0'));
  console.log('Contains "db.dtwrnpoqfvensnrvchkr":', currentUrl.includes('db.dtwrnpoqfvensnrvchkr'));

  // Test current connection
  console.log('\n🧪 Testing current connection...');
  try {
    const sql = neon(currentUrl);
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    console.log('✅ Current connection works!');
    console.log('Result:', result);
    return;
  } catch (error) {
    console.error('❌ Current connection failed:', error.message);
  }

  // Try alternative connection methods
  console.log('\n🔧 Trying alternative connection methods...');

  // Method 1: Try direct connection instead of pooler
  if (currentUrl.includes('pooler')) {
    console.log('\n1️⃣ Trying direct connection (without pooler)...');
    try {
      const directUrl = currentUrl.replace('pooler.supabase.com', 'db.dtwrnpoqfvensnrvchkr.supabase.co');
      console.log('Direct URL:', directUrl.substring(0, 50) + '...');
      
      const sql = neon(directUrl);
      const result = await sql`SELECT 1 as test`;
      console.log('✅ Direct connection successful!');
      console.log('Result:', result);
      
      console.log('\n💡 SOLUTION: Use direct connection instead of pooler');
      console.log('Update your Vercel DATABASE_URL to:');
      console.log(directUrl);
      return;
    } catch (error) {
      console.error('❌ Direct connection failed:', error.message);
    }
  }

  // Method 2: Try pooler connection if using direct
  if (currentUrl.includes('db.dtwrnpoqfvensnrvchkr')) {
    console.log('\n2️⃣ Trying pooler connection...');
    try {
      const poolerUrl = currentUrl.replace('db.dtwrnpoqfvensnrvchkr.supabase.co', 'aws-0-us-east-1.pooler.supabase.com:6543');
      console.log('Pooler URL:', poolerUrl.substring(0, 50) + '...');
      
      const sql = neon(poolerUrl);
      const result = await sql`SELECT 1 as test`;
      console.log('✅ Pooler connection successful!');
      console.log('Result:', result);
      
      console.log('\n💡 SOLUTION: Use pooler connection');
      console.log('Update your Vercel DATABASE_URL to:');
      console.log(poolerUrl);
      return;
    } catch (error) {
      console.error('❌ Pooler connection failed:', error.message);
    }
  }

  // Method 3: Try with different parameters
  console.log('\n3️⃣ Trying with connection parameters...');
  try {
    const paramUrl = currentUrl + '?sslmode=require&connect_timeout=30';
    const sql = neon(paramUrl);
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Connection with parameters successful!');
    console.log('Result:', result);
    
    console.log('\n💡 SOLUTION: Add connection parameters');
    console.log('Update your Vercel DATABASE_URL to:');
    console.log(paramUrl);
    return;
  } catch (error) {
    console.error('❌ Connection with parameters failed:', error.message);
  }

  // If all methods fail
  console.log('\n❌ All connection methods failed');
  console.log('\n🔧 Additional troubleshooting steps:');
  console.log('1. Check if your Supabase project is active');
  console.log('2. Verify your database password is correct');
  console.log('3. Try regenerating your database password in Supabase');
  console.log('4. Check if there are any IP restrictions on your Supabase project');
  console.log('5. Contact Supabase support if the issue persists');
  
  console.log('\n📋 Current recommended connection string format:');
  console.log('postgresql://postgres.dtwrnpoqfvensnrvchkr:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres');
  console.log('\nOr try direct connection:');
  console.log('postgresql://postgres.dtwrnpoqfvensnrvchkr:[password]@db.dtwrnpoqfvensnrvchkr.supabase.co:5432/postgres');
}

fixVercelConnection().catch(console.error); 