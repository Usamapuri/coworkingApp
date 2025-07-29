// Simple database connection test
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set!');
      return false;
    }
    
    console.log('✅ DATABASE_URL is set');
    console.log('Connection string:', process.env.DATABASE_URL.substring(0, 50) + '...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test simple query
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Test query result:', result);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('🎉 Database connection test passed!');
  } else {
    console.log('💥 Database connection test failed!');
  }
  process.exit(success ? 0 : 1);
}); 