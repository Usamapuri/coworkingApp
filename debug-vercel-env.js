// Debug Vercel environment variables
console.log('🔍 Debugging Vercel environment variables...\n');

// Check POSTGRES_URL
if (process.env.POSTGRES_URL) {
  console.log('✅ POSTGRES_URL is set');
  console.log('🔗 Full connection string:', process.env.POSTGRES_URL);
  
  // Check if it contains the correct hostname
  if (process.env.POSTGRES_URL.includes('aws-0-us-east-1.pooler.supabase.com')) {
    console.log('✅ Using correct pooler hostname');
  } else if (process.env.POSTGRES_URL.includes('api.pooler.supabase.com')) {
    console.error('❌ WRONG HOSTNAME: Using api.pooler.supabase.com (should be aws-0-us-east-1.pooler.supabase.com)');
  } else if (process.env.POSTGRES_URL.includes('db.dtwrnpoqfvensnrvchkr.supabase.co')) {
    console.log('⚠️  Using direct connection (might work but slower)');
  } else {
    console.error('❌ Unknown hostname in connection string');
  }
  
  // Check password
  if (process.env.POSTGRES_URL.includes('calmkaaj7874')) {
    console.log('✅ Using correct password');
  } else {
    console.log('⚠️  Password might be different');
  }
} else {
  console.error('❌ POSTGRES_URL is not set');
}

// Check if DATABASE_URL still exists (old variable)
if (process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL still exists - this might be causing conflicts!');
  console.log('🔗 DATABASE_URL value:', process.env.DATABASE_URL);
}

// Check other important variables
console.log('\n📋 Other Environment Variables:');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ Not set');

console.log('\n🎯 If you see "api.pooler.supabase.com", you need to:');
console.log('1. Delete ALL existing POSTGRES_URL variables in Vercel');
console.log('2. Add the correct one with "aws-0-us-east-1.pooler.supabase.com"');
console.log('3. Redeploy your application');

console.log('\n🔧 Quick Fix Steps:');
console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
console.log('2. Delete any existing POSTGRES_URL or DATABASE_URL variables');
console.log('3. Add new POSTGRES_URL with this exact value:');
console.log('   postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x');
console.log('4. Add SESSION_SECRET with a strong random string');
console.log('5. Add NODE_ENV=production');
console.log('6. Redeploy your application'); 