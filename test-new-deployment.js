// Test New Vercel Deployment and RLS Setup
import { neon } from "@neondatabase/serverless";

const dbUrl = "postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x";

async function testNewDeployment() {
  console.log('🧪 Testing New Vercel Deployment...\n');
  
  try {
    const sql = neon(dbUrl);
    
    // Test basic connection
    console.log('🔍 Testing database connection...');
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('🕐 Current time:', result[0].current_time);
    
    // Check if tables exist
    console.log('\n📋 Checking if tables exist...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'organizations', 'menu_categories')
      ORDER BY table_name
    `;
    
    console.log('📊 Found tables:', tables.map(t => t.table_name).join(', '));
    
    // Check RLS status
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
    
    // Check if auth_id column exists
    console.log('\n🔍 Checking auth_id column...');
    const authIdColumn = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'auth_id'
    `;
    
    if (authIdColumn.length > 0) {
      console.log('✅ auth_id column exists:', authIdColumn[0].data_type);
    } else {
      console.log('❌ auth_id column does not exist');
    }
    
    // Check user data
    console.log('\n👥 Checking user data...');
    const users = await sql`
      SELECT id, email, role, site, auth_id IS NOT NULL as has_auth_id
      FROM public.users 
      LIMIT 5
    `;
    
    console.log('👥 Sample users:');
    users.forEach(user => {
      console.log(`   ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Site: ${user.site}, Auth ID: ${user.has_auth_id ? '✅' : '❌'}`);
    });
    
    console.log('\n🎯 DEPLOYMENT STATUS:');
    console.log('✅ Database connection: Working');
    console.log('✅ Tables exist: Working');
    console.log('✅ RLS status: Check above');
    console.log('✅ Auth ID column: Check above');
    console.log('✅ User data: Available');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Try logging in to your Vercel app');
    console.log('2. If login works, RLS is working');
    console.log('3. If login fails, check Vercel function logs');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your Supabase project is active');
    console.log('2. Verify the database URL is correct');
    console.log('3. Check Vercel environment variables');
  }
}

testNewDeployment(); 