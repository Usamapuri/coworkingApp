// Test the correct database URL
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const correctUrl = "postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x";

async function testConnection() {
  console.log('🔍 Testing correct database URL...');
  console.log('🔗 URL:', correctUrl.substring(0, 80) + '...');
  
  try {
    const sql = neon(correctUrl);
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful!');
    console.log('🕐 Current time:', result[0].current_time);
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection(); 