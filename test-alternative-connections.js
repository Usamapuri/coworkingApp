import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testAlternativeConnections() {
  console.log('🔧 Testing Alternative Connection Methods\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    return;
  }
  
  const originalUrl = process.env.DATABASE_URL;
  console.log('Original connection string:', originalUrl.substring(0, 50) + '...');
  
  // Test 1: Try with different timeout
  console.log('\n🕐 Test 1: Connection with extended timeout...');
  try {
    const sql = neon(originalUrl, {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });
      }
    });
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Extended timeout connection successful!');
    console.log('Result:', result);
    return true;
  } catch (error) {
    console.error('❌ Extended timeout failed:', error.message);
  }
  
  // Test 2: Try with different user agent
  console.log('\n🌐 Test 2: Connection with custom user agent...');
  try {
    const sql = neon(originalUrl, {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      }
    });
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Custom user agent connection successful!');
    console.log('Result:', result);
    return true;
  } catch (error) {
    console.error('❌ Custom user agent failed:', error.message);
  }
  
  // Test 3: Try with different connection parameters
  console.log('\n⚙️ Test 3: Connection with different parameters...');
  try {
    const modifiedUrl = originalUrl + '?sslmode=require&connect_timeout=30';
    const sql = neon(modifiedUrl);
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Modified parameters connection successful!');
    console.log('Result:', result);
    return true;
  } catch (error) {
    console.error('❌ Modified parameters failed:', error.message);
  }
  
  // Test 4: Try direct connection without pooler
  console.log('\n🔗 Test 4: Direct connection (without pooler)...');
  try {
    // Replace pooler with direct connection
    const directUrl = originalUrl.replace('pooler.supabase.com', 'db.dtwrnpoqfvensnrvchkr.supabase.co');
    console.log('Trying direct URL:', directUrl.substring(0, 50) + '...');
    
    const sql = neon(directUrl);
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Direct connection successful!');
    console.log('Result:', result);
    console.log('\n💡 Solution: Use direct connection instead of pooler');
    console.log('Update your DATABASE_URL to use the direct connection string');
    return true;
  } catch (error) {
    console.error('❌ Direct connection failed:', error.message);
  }
  
  console.log('\n💡 Recommendations:');
  console.log('1. Check if your network/firewall is blocking the connection');
  console.log('2. Try using a different network (mobile hotspot, VPN)');
  console.log('3. Contact your network administrator');
  console.log('4. Check if your Supabase project is active');
  console.log('5. Try using the direct connection string instead of pooler');
  
  return false;
}

testAlternativeConnections().then(success => {
  if (success) {
    console.log('\n🎉 Alternative connection method worked!');
  } else {
    console.log('\n💥 All alternative methods failed');
  }
}); 