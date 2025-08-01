// Test the actual database URL from Vercel
import { neon } from "@neondatabase/serverless";

const actualUrl = "postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x";

async function testActualConnection() {
  console.log('🔍 Testing your actual database URL...');
  console.log('🔗 URL:', actualUrl.substring(0, 80) + '...');
  
  try {
    const sql = neon(actualUrl);
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('✅ Connection successful!');
    console.log('🕐 Current time:', result[0].current_time);
    console.log('📊 Database version:', result[0].db_version.substring(0, 50) + '...');
    
    // Test if your tables exist
    console.log('\n🔍 Checking if your tables exist...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'organizations', 'menu_categories')
      ORDER BY table_name
    `;
    
    console.log('📋 Found tables:', tables.map(t => t.table_name).join(', '));
    
    // Check if RLS is enabled
    console.log('\n🔒 Checking RLS status...');
    const rlsStatus = await sql`
      SELECT tablename, rowsecurity as rls_enabled 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'organizations')
    `;
    
    console.log('🔒 RLS Status:');
    rlsStatus.forEach(row => {
      console.log(`   ${row.tablename}: ${row.rls_enabled ? '✅ Enabled' : '❌ Disabled'}`);
    });
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
}

testActualConnection(); 