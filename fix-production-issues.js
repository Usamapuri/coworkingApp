#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

console.log('🔧 CalmKaaj Production Issues Fix\n');

async function fixProductionIssues() {
  console.log('📋 Checking current configuration...\n');
  
  // Check environment variables
  const issues = [];
  const fixes = [];
  
  if (!process.env.POSTGRES_URL) {
    issues.push('❌ POSTGRES_URL is not set');
    fixes.push('Set POSTGRES_URL in your environment variables');
  } else {
    console.log('✅ POSTGRES_URL is configured');
  }
  
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'your-secret-key-here') {
    issues.push('❌ SESSION_SECRET is not properly configured');
    fixes.push('Set a strong SESSION_SECRET in your environment variables');
  } else {
    console.log('✅ SESSION_SECRET is configured');
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ NODE_ENV is not set to production');
    fixes.push('Set NODE_ENV=production for production deployment');
  } else {
    console.log('✅ NODE_ENV is set to production');
  }
  
  // Test database connection
  console.log('\n🗄️ Testing database connection...');
  try {
    const sql = neon(process.env.POSTGRES_URL);
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('Test result:', result);
  } catch (error) {
    issues.push(`❌ Database connection failed: ${error.message}`);
    fixes.push('Check your network connectivity and Supabase project status');
  }
  
  // Check if sessions table exists
  console.log('\n📊 Checking sessions table...');
  try {
    const sql = neon(process.env.POSTGRES_URL);
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sessions'
      ) as table_exists
    `;
    
    if (result[0]?.table_exists) {
      console.log('✅ Sessions table exists');
    } else {
      issues.push('❌ Sessions table does not exist');
      fixes.push('Run the sessions table migration: supabase_migration_sessions.sql');
    }
  } catch (error) {
    issues.push(`❌ Could not check sessions table: ${error.message}`);
  }
  
  // Display issues and fixes
  if (issues.length > 0) {
    console.log('\n🚨 Issues Found:');
    issues.forEach(issue => console.log(issue));
    
    console.log('\n🔧 Fixes Required:');
    fixes.forEach((fix, index) => console.log(`${index + 1}. ${fix}`));
    
    console.log('\n📝 Environment Variables Template:');
    console.log(`
# Required for production
POSTGRES_URL=postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
SESSION_SECRET=your-strong-secret-key-here
NODE_ENV=production

# Optional
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@calmkaaj.com
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
    `);
    
    return false;
  } else {
    console.log('\n🎉 All checks passed! Your application should work correctly in production.');
    return true;
  }
}

// Run the fix
fixProductionIssues().then(success => {
  if (success) {
    console.log('\n✅ Production issues have been resolved!');
    console.log('You can now deploy your application.');
  } else {
    console.log('\n💥 Please fix the issues above before deploying.');
    process.exit(1);
  }
}); 