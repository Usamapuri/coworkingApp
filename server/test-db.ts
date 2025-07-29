import { db } from './db';
import { schema } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Simple query to check connection
    const result = await db.select().from(schema.users).limit(1);
    console.log('✅ Database connection successful!');
    console.log('Sample user data:', result);
    
    // Test 2: Check if we can query users table
    const userCount = await db.select({ count: sql`count(*)` }).from(schema.users);
    console.log('✅ Users table accessible!');
    console.log('Total users:', userCount[0]?.count);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Run the test
testDatabaseConnection().then(success => {
  if (success) {
    console.log('🎉 All database tests passed!');
  } else {
    console.log('💥 Database tests failed!');
  }
  process.exit(success ? 0 : 1);
}); 