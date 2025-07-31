import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import https from 'https';
import { URL } from 'url';

// Load environment variables
dotenv.config();

async function diagnoseConnection() {
  console.log('🔍 CalmKaaj Database Connection Diagnostics\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
  if (process.env.POSTGRES_URL) {
    console.log('Connection string starts with:', process.env.POSTGRES_URL.substring(0, 50) + '...');
  }
  
  // Parse connection string
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL is not set');
    return;
  }
  
  try {
    const url = new URL(process.env.POSTGRES_URL);
    console.log('\n🔗 Connection String Analysis:');
    console.log('Protocol:', url.protocol);
    console.log('Hostname:', url.hostname);
    console.log('Port:', url.port);
    console.log('Database:', url.pathname);
    console.log('Username:', url.username);
    console.log('Password length:', url.password ? url.password.length : 0);
    
    // Test basic network connectivity
    console.log('\n🌐 Network Connectivity Tests:');
    
    // Test DNS resolution
    console.log('Testing DNS resolution for:', url.hostname);
    try {
      const dns = await import('dns/promises');
      const addresses = await dns.lookup(url.hostname);
      console.log('✅ DNS resolution successful:', addresses.address);
    } catch (error) {
      console.error('❌ DNS resolution failed:', error.message);
    }
    
    // Test HTTPS connectivity to Supabase
    console.log('\nTesting HTTPS connectivity to Supabase...');
    try {
      const response = await fetch('https://supabase.com');
      console.log('✅ Supabase website accessible (status:', response.status, ')');
    } catch (error) {
      console.error('❌ Cannot reach Supabase website:', error.message);
    }
    
    // Test direct connection to the database host
    console.log('\nTesting direct connection to database host...');
    try {
      const response = await fetch(`https://${url.hostname}:${url.port || 443}`);
      console.log('✅ Direct connection to database host successful (status:', response.status, ')');
    } catch (error) {
      console.error('❌ Direct connection to database host failed:', error.message);
    }
    
    // Test actual database connection
    console.log('\n🗄️ Testing actual database connection...');
    try {
      const sql = neon(process.env.POSTGRES_URL);
      const result = await sql`SELECT 1 as test, NOW() as current_time, version() as pg_version`;
      console.log('✅ Database connection successful!');
      console.log('Test result:', result);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      
      if (error.message.includes('fetch failed')) {
        console.error('\n🔍 Fetch failed - Possible causes:');
        console.error('1. Network connectivity issues');
        console.error('2. Firewall blocking the connection');
        console.error('3. Supabase project is paused or inactive');
        console.error('4. Connection string format issues');
        console.error('5. Rate limiting or IP restrictions');
      }
      
      if (error.message.includes('ENOTFOUND')) {
        console.error('\n🔍 DNS Resolution Issue:');
        console.error('- Check if your internet connection is working');
        console.error('- Try using a different DNS server');
        console.error('- Check if Supabase is accessible from your location');
      }
      
      if (error.message.includes('timeout')) {
        console.error('\n🔍 Timeout Issue:');
        console.error('- Network is slow or congested');
        console.error('- Firewall might be blocking the connection');
        console.error('- Try using a different network');
      }
      
      if (error.message.includes('authentication')) {
        console.error('\n🔍 Authentication Issue:');
        console.error('- Check your database password');
        console.error('- Verify the username is correct');
        console.error('- Check if your credentials have expired');
      }
    }
    
  } catch (error) {
    console.error('❌ Error parsing connection string:', error.message);
  }
}

diagnoseConnection().catch(console.error); 