import pg from 'pg';

const { Client } = pg;

const databaseUrl = "postgresql://postgres.grrwjmuosgwoayqytodc:calmkaaj7874@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require";

console.log('🔍 Testing database connection with pg client...');
console.log('URL:', databaseUrl.substring(0, 50) + '...');

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined
  }
});

try {
  console.log('📡 Attempting to connect...');
  
  await client.connect();
  console.log('✅ Connection successful!');
  
  const result = await client.query('SELECT 1 as test');
  console.log('Query result:', result.rows);
  
  // Test a real query
  const orgResult = await client.query('SELECT * FROM organizations LIMIT 1');
  console.log('Organizations:', orgResult.rows);
  
  await client.end();
  console.log('✅ Connection closed successfully');
  
} catch (error) {
  console.error('❌ Connection failed:');
  console.error('Error type:', error.constructor.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
} 