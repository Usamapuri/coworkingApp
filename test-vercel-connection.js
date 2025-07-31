// Test Vercel database connection
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testVercelConnection() {
  console.log('🔍 Testing Vercel database connection...\n');
  
  const dbUrl = process.env.POSTGRES_URL;
  
  if (!dbUrl) {
    console.error('❌ POSTGRES_URL environment variable is not set');
    console.log('\n📋 To fix this:');
    console.log('1. Go to your Vercel dashboard');
    console.log('2. Navigate to Settings → Environment Variables');
    console.log('3. Add POSTGRES_URL with your Supabase connection string');
    return false;
  }
  
  console.log('✅ POSTGRES_URL is set');
  console.log('🔗 Connection string format:', dbUrl.substring(0, 50) + '...');
  
  try {
    const sql = neon(dbUrl);
    
    // Test a simple query
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('🕐 Server time:', result[0].current_time);
    
    // Test if we can access the users table
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log('👥 Users in database:', userCount[0].count);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if your Supabase project is active');
    console.log('2. Verify the connection string format');
    console.log('3. Make sure the password in the connection string is correct');
    console.log('4. Check if there are any IP restrictions on your Supabase project');
    return false;
  }
}

// Run the test
testVercelConnection().then(success => {
  if (success) {
    console.log('\n🎉 Vercel database connection test passed!');
  } else {
    console.log('\n💥 Vercel database connection test failed!');
  }
}); 