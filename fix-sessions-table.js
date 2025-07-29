import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔧 Fixing Sessions Table\n');

async function fixSessionsTable() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Check if sessions table exists
    console.log('📊 Checking if sessions table exists...');
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sessions'
      ) as table_exists
    `;
    
    if (tableExists[0]?.table_exists) {
      console.log('✅ Sessions table already exists');
    } else {
      console.log('❌ Sessions table does not exist, creating it...');
      
      // Create sessions table
      await sql`
        CREATE TABLE IF NOT EXISTS "sessions" (
          "sid" varchar NOT NULL COLLATE "default",
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL
        )
      `;
      
      // Add primary key
      await sql`
        ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
      `;
      
      // Create index
      await sql`
        CREATE INDEX IF NOT EXISTS "IDX_sessions_expire" ON "sessions" ("expire")
      `;
      
      console.log('✅ Sessions table created successfully!');
    }
    
    // Test inserting a session
    console.log('\n🧪 Testing session insertion...');
    const testSession = {
      sid: 'test-session-' + Date.now(),
      sess: JSON.stringify({ test: true }),
      expire: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };
    
    await sql`
      INSERT INTO sessions (sid, sess, expire) 
      VALUES (${testSession.sid}, ${testSession.sess}, ${testSession.expire})
    `;
    
    console.log('✅ Session insertion test successful!');
    
    // Clean up test session
    await sql`DELETE FROM sessions WHERE sid = ${testSession.sid}`;
    console.log('✅ Test session cleaned up');
    
    console.log('\n🎉 Sessions table is ready for production!');
    
  } catch (error) {
    console.error('❌ Error fixing sessions table:', error.message);
    
    if (error.message.includes('fetch failed')) {
      console.error('\n💡 Network connectivity issue detected.');
      console.error('This is likely due to firewall/network restrictions.');
      console.error('The sessions table will be created automatically when the app connects.');
    }
  }
}

fixSessionsTable(); 