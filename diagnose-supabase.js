// Diagnose Supabase Connection Issues
import { neon } from "@neondatabase/serverless";
import fetch from "node-fetch";

const urls = [
  "postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x",
  "postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require",
  "postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
];

async function testUrl(url, description) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`🔗 URL: ${url.substring(0, 80)}...`);
  
  try {
    const sql = neon(url);
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('✅ SUCCESS!');
    console.log('🕐 Current time:', result[0].current_time);
    console.log('📊 Database version:', result[0].db_version.substring(0, 50) + '...');
    return true;
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    if (error.message.includes('fetch failed')) {
      console.log('💡 This suggests a network/DNS issue');
    } else if (error.message.includes('authentication')) {
      console.log('💡 This suggests a credentials issue');
    } else if (error.message.includes('connection')) {
      console.log('💡 This suggests a connection issue');
    }
    return false;
  }
}

async function checkSupabaseStatus() {
  console.log('🔍 Diagnosing Supabase Connection Issues...\n');
  
  // Test different URL variations
  for (let i = 0; i < urls.length; i++) {
    const success = await testUrl(urls[i], `URL Variation ${i + 1}`);
    if (success) {
      console.log('\n🎉 Found working connection!');
      console.log('Use this URL in your Vercel environment variables:');
      console.log(urls[i]);
      return;
    }
  }
  
  console.log('\n❌ All connection attempts failed.');
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Check if your Supabase project is active (not paused)');
  console.log('2. Verify the database password is correct');
  console.log('3. Check if there are IP restrictions');
  console.log('4. Try accessing your Supabase dashboard');
  console.log('5. Check if the project has been deleted or suspended');
}

checkSupabaseStatus(); 