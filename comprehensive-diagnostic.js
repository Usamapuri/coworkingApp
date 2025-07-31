import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 COMPREHENSIVE DATABASE DIAGNOSTIC\n');

async function runDiagnostic() {
  console.log('📋 Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
  console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
  
  if (!process.env.POSTGRES_URL) {
    console.error('\n❌ CRITICAL: POSTGRES_URL is not set!');
    console.log('This is why login is failing.');
    return;
  }

  const dbUrl = process.env.POSTGRES_URL;
  console.log('\n🔗 POSTGRES_URL Analysis:');
  console.log('URL length:', dbUrl.length);
  console.log('Contains "pooler":', dbUrl.includes('pooler'));
  console.log('Contains "aws-0":', dbUrl.includes('aws-0'));
  console.log('Contains "api.pooler":', dbUrl.includes('api.pooler'));
  console.log('Contains "db.dtwrnpoqfvensnrvchkr":', dbUrl.includes('db.dtwrnpoqfvensnrvchkr'));
  console.log('Port 6543:', dbUrl.includes(':6543'));
  console.log('Port 5432:', dbUrl.includes(':5432'));

  // Extract hostname from URL
  const urlMatch = dbUrl.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    const hostname = urlMatch[1];
    const port = urlMatch[2];
    console.log('\n🌐 Connection Details:');
    console.log('Hostname:', hostname);
    console.log('Port:', port);
    
    if (hostname === 'api.pooler.supabase.com') {
      console.error('\n❌ PROBLEM FOUND: Wrong hostname!');
      console.log('Your POSTGRES_URL is using "api.pooler.supabase.com" which is incorrect.');
      console.log('It should be "aws-0-us-east-1.pooler.supabase.com"');
    }
  }

  console.log('\n🧪 Testing Database Connection...');
  
  try {
    const sql = neon(dbUrl);
    const result = await sql`SELECT 1 as test, NOW() as current_time, current_database() as db_name`;
    console.log('✅ Database connection SUCCESSFUL!');
    console.log('Test result:', result);
    
    // Test user table
    console.log('\n👥 Testing user table...');
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log('Users in database:', userCount[0].count);
    
    // Test specific user
    const adminUser = await sql`SELECT id, email, role FROM users WHERE email = 'admin@calmkaaj.com'`;
    if (adminUser.length > 0) {
      console.log('✅ Admin user found:', adminUser[0]);
    } else {
      console.log('⚠️ Admin user not found in database');
    }
    
  } catch (error) {
    console.error('\n❌ Database connection FAILED:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DNS Resolution Issue:');
      console.error('- The hostname cannot be resolved');
      console.error('- Check if your Supabase project is active');
      console.error('- Verify the connection string format');
    }
    
    if (error.message.includes('fetch failed')) {
      console.error('\n🔍 Network Issue:');
      console.error('- Network connectivity problem');
      console.error('- Could be firewall, DNS, or connection string issue');
    }
    
    if (error.message.includes('authentication')) {
      console.error('\n🔍 Authentication Issue:');
      console.error('- Wrong username or password');
      console.error('- Check your database credentials');
    }
  }

  console.log('\n📋 RECOMMENDATIONS:');
  
  if (dbUrl.includes('api.pooler.supabase.com')) {
    console.log('1. ❌ FIX REQUIRED: Update POSTGRES_URL to use correct hostname');
    console.log('   Current: api.pooler.supabase.com');
    console.log('   Should be: aws-0-us-east-1.pooler.supabase.com');
  }
  
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'your-secret-key-here') {
    console.log('2. ❌ FIX REQUIRED: Set a strong SESSION_SECRET');
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('3. ⚠️ Consider setting NODE_ENV=production for production deployment');
  }
  
  console.log('\n🔧 IMMEDIATE ACTION REQUIRED:');
  console.log('1. Go to your Vercel dashboard');
  console.log('2. Navigate to Settings → Environment Variables');
  console.log('3. Update POSTGRES_URL to use the correct Supabase connection string');
  console.log('4. Ensure SESSION_SECRET is set to a strong value');
  console.log('5. Set NODE_ENV=production');
}

runDiagnostic().catch(console.error); 