// Debug deployment environment variables
console.log('🔍 DEBUGGING DEPLOYMENT ENVIRONMENT VARIABLES');
console.log('============================================');

// Log all environment variables
console.log('\n📋 ALL ENVIRONMENT VARIABLES:');
Object.keys(process.env).forEach(key => {
  const value = process.env[key];
  if (value && (key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('SUPABASE'))) {
    console.log(`${key}: ${value.substring(0, 50)}...`);
  }
});

// Check specific database URLs
console.log('\n🔗 DATABASE URLS:');
const databaseUrl = process.env.DATABASE_URL;
const postgresUrl = process.env.POSTGRES_URL;

console.log('DATABASE_URL:', databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'NOT SET');
console.log('POSTGRES_URL:', postgresUrl ? postgresUrl.substring(0, 50) + '...' : 'NOT SET');

// Check which one is being used
const usedUrl = databaseUrl || postgresUrl;
console.log('\n🎯 URL BEING USED:', usedUrl ? usedUrl.substring(0, 50) + '...' : 'NONE');

if (usedUrl && usedUrl.includes('api.pooler.supabase.com')) {
  console.log('❌ ERROR: Still using OLD hostname!');
  console.log('🔍 This means there is a hardcoded fallback somewhere!');
} else if (usedUrl && usedUrl.includes('aws-0-us-east-1.pooler.supabase.com')) {
  console.log('✅ SUCCESS: Using correct hostname!');
} else {
  console.log('⚠️ WARNING: No database URL found or unexpected format');
}

console.log('\n🚨 IMMEDIATE ACTION:');
console.log('If you see "Still using OLD hostname" above, there is a hardcoded fallback URL in the code!'); 