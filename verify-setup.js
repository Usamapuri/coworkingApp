// Comprehensive Setup Verification
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
dotenv.config();

console.log('🔍 Comprehensive Setup Verification\n');

// 1. Check Environment Variables
console.log('📋 Environment Variables Check:');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ Set' : '❌ Not set');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ Not set');

// 2. Verify Connection String Format
if (process.env.POSTGRES_URL) {
  console.log('\n🔗 Connection String Analysis:');
  const url = process.env.POSTGRES_URL;
  
  // Check protocol
  if (url.startsWith('postgres://')) {
    console.log('✅ Protocol: postgres:// (correct)');
  } else if (url.startsWith('postgresql://')) {
    console.log('⚠️  Protocol: postgresql:// (will work but postgres:// is preferred)');
  } else {
    console.log('❌ Protocol: Invalid');
  }
  
  // Check hostname
  if (url.includes('aws-0-us-east-1.pooler.supabase.com')) {
    console.log('✅ Hostname: aws-0-us-east-1.pooler.supabase.com (correct)');
  } else if (url.includes('api.pooler.supabase.com')) {
    console.log('❌ Hostname: api.pooler.supabase.com (WRONG - this is causing your error)');
  } else if (url.includes('db.dtwrnpoqfvensnrvchkr.supabase.co')) {
    console.log('⚠️  Hostname: Direct database (will work but slower)');
  } else {
    console.log('❌ Hostname: Unknown');
  }
  
  // Check port
  if (url.includes(':6543/')) {
    console.log('✅ Port: 6543 (pooler - correct)');
  } else if (url.includes(':5432/')) {
    console.log('⚠️  Port: 5432 (direct - will work but slower)');
  } else {
    console.log('❌ Port: Unknown');
  }
  
  // Check SSL
  if (url.includes('sslmode=require')) {
    console.log('✅ SSL: sslmode=require (correct)');
  } else {
    console.log('⚠️  SSL: Not specified (might cause issues)');
  }
  
  // Check pooler
  if (url.includes('supa=base-pooler.x')) {
    console.log('✅ Pooler: supa=base-pooler.x (correct)');
  } else if (url.includes('pgbouncer=true')) {
    console.log('⚠️  Pooler: pgbouncer=true (alternative format)');
  } else {
    console.log('⚠️  Pooler: Not specified');
  }
}

// 3. Test Database Connection
async function testConnection() {
  if (!process.env.POSTGRES_URL) {
    console.log('\n❌ Cannot test connection - POSTGRES_URL not set');
    return false;
  }
  
  console.log('\n🔌 Testing Database Connection...');
  
  try {
    const sql = neon(process.env.POSTGRES_URL);
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    
    console.log('✅ Database connection successful!');
    console.log('🕐 Server time:', result[0].current_time);
    console.log('🗄️  Database:', result[0].db_version.substring(0, 50) + '...');
    
    // Test if users table exists
    try {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log('👥 Users table exists with', userCount[0].count, 'users');
    } catch (tableError) {
      console.log('⚠️  Users table might not exist yet:', tableError.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide specific guidance based on error
    if (error.message.includes('api.pooler.supabase.com')) {
      console.log('\n🎯 SOLUTION: You need to update your Vercel environment variables');
      console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
      console.log('2. Delete any existing POSTGRES_URL or DATABASE_URL variables');
      console.log('3. Add new POSTGRES_URL with this exact value:');
      console.log('   postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x');
      console.log('4. Redeploy your application');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🎯 SOLUTION: Check your Supabase project status');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Ensure your project is active');
      console.log('3. Check if there are any IP restrictions');
    }
    
    return false;
  }
}

// 4. Verify Required Environment Variables for Vercel
console.log('\n📋 Required Vercel Environment Variables:');
console.log('1. POSTGRES_URL (for database connection)');
console.log('2. SESSION_SECRET (for session encryption)');
console.log('3. NODE_ENV=production (for production mode)');

console.log('\n📋 Optional Environment Variables:');
console.log('1. SENDGRID_API_KEY (for email notifications)');
console.log('2. FROM_EMAIL (for email sender)');
console.log('3. VAPID_PUBLIC_KEY (for push notifications)');
console.log('4. VAPID_PRIVATE_KEY (for push notifications)');

// Run the test
testConnection().then(success => {
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('🎉 Setup verification completed successfully!');
    console.log('Your database connection is working correctly.');
  } else {
    console.log('💥 Setup verification failed!');
    console.log('Please fix the issues above before deploying.');
  }
  console.log('='.repeat(50));
}); 