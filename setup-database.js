#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CalmKaaj Database Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Database Configuration
# Replace with your actual Supabase connection string
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Session Configuration
SESSION_SECRET=your-secret-key-here

# Email Configuration (Optional)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@calmkaaj.com

# Push Notifications (Optional)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Environment
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please update the DATABASE_URL with your actual Supabase connection string\n');
} else {
  console.log('✅ .env file already exists');
}

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Test database connection
async function testConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    console.log('\n📋 To fix this:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Settings > Database');
    console.log('3. Copy the connection string (use the pooler connection for better reliability)');
    console.log('4. Update the DATABASE_URL in your .env file');
    console.log('\nExample format:');
    console.log('DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
    return false;
  }

  console.log('🔍 Testing database connection...');
  
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('Test result:', result);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DNS Resolution Issue:');
      console.error('- Check if your Supabase project is active');
      console.error('- Verify the connection string hostname is correct');
      console.error('- Try using the pooler connection instead of direct connection');
    }
    
    if (error.message.includes('authentication')) {
      console.error('\n🔍 Authentication Issue:');
      console.error('- Check your database password');
      console.error('- Verify the username is correct');
    }
    
    if (error.message.includes('fetch failed')) {
      console.error('\n🔍 Network Issue:');
      console.error('- Check your internet connection');
      console.error('- Verify firewall settings');
      console.error('- Try using the pooler connection');
    }
    
    return false;
  }
}

// Run setup
async function runSetup() {
  const success = await testConnection();
  
  if (success) {
    console.log('\n🎉 Setup completed successfully!');
    console.log('You can now run: npm run dev');
  } else {
    console.log('\n💥 Setup incomplete. Please fix the issues above and run again.');
    process.exit(1);
  }
}

runSetup().catch(console.error); 