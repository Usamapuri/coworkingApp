// Test database connection with corrected format
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Use the environment variable or fallback to the correct connection string
  const dbUrl = process.env.POSTGRES_URL || 'postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x';
  
  console.log('🔗 Using connection string:', dbUrl.substring(0, 50) + '...');
  
  try {
    const sql = neon(dbUrl);
    
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('🕐 Server time:', result[0].current_time);
    
    // Test if users table exists
    try {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log('👥 Users in database:', userCount[0].count);
    } catch (tableError) {
      console.log('⚠️  Users table might not exist yet:', tableError.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Common issues:');
    console.log('1. Check if your Supabase project is active');
    console.log('2. Verify the password is correct');
    console.log('3. Check if there are IP restrictions');
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Connection test passed! Ready to deploy to Vercel.');
  } else {
    console.log('\n💥 Connection test failed! Check your Supabase settings.');
  }
}); 