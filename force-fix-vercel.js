// Force Vercel to use correct environment variables
// This script will be called during deployment to ensure we're using the right database URL

console.log('🚀 FORCE FIXING VERCEL ENVIRONMENT VARIABLES');
console.log('==========================================');

// Get the correct Supabase URL from your environment
const correctSupabaseUrl = 'https://awsqtnvjrdntwgnevqoz.supabase.co';
const correctDatabaseUrl = `postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x`;

console.log('✅ Correct Supabase URL:', correctSupabaseUrl);
console.log('✅ Correct Database URL:', correctDatabaseUrl.substring(0, 50) + '...');

// Check what we're actually getting
const actualDatabaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
console.log('🔍 Actual Database URL:', actualDatabaseUrl ? actualDatabaseUrl.substring(0, 50) + '...' : 'NOT SET');

if (actualDatabaseUrl && actualDatabaseUrl.includes('api.pooler.supabase.com')) {
  console.log('❌ ERROR: Still using OLD hostname!');
  console.log('🚨 Vercel is not using your environment variables!');
  
  // Force exit with error to make deployment fail
  process.exit(1);
} else if (actualDatabaseUrl && actualDatabaseUrl.includes('aws-0-us-east-1.pooler.supabase.com')) {
  console.log('✅ SUCCESS: Using correct hostname!');
} else {
  console.log('⚠️ WARNING: No database URL found or unexpected format');
}

console.log('\n📋 NEXT STEPS:');
console.log('==============');
console.log('1. If you see "Still using OLD hostname" above:');
console.log('   - Go to Vercel dashboard');
console.log('   - Delete ALL environment variables');
console.log('   - Add ONLY: DATABASE_URL=' + correctDatabaseUrl);
console.log('   - Redeploy');
console.log('');
console.log('2. If you see "Using correct hostname" above:');
console.log('   - Your environment variables are correct');
console.log('   - The issue might be elsewhere'); 