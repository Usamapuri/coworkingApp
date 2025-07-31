// Test Vercel environment variables
console.log('🔍 Testing Vercel environment variables...\n');

// Check if POSTGRES_URL is set
if (process.env.POSTGRES_URL) {
  console.log('✅ POSTGRES_URL is set');
  console.log('🔗 Connection string format:', process.env.POSTGRES_URL.substring(0, 50) + '...');
  
  // Check if it's using the correct format
  if (process.env.POSTGRES_URL.includes('pooler.supabase.com')) {
    console.log('✅ Using pooler connection (recommended for Vercel)');
  } else if (process.env.POSTGRES_URL.includes('supabase.co')) {
    console.log('⚠️  Using direct connection (might be slower)');
  } else {
    console.log('❌ Not a Supabase connection string');
  }
} else {
  console.error('❌ POSTGRES_URL is not set');
  console.log('\n📋 To fix this:');
  console.log('1. Go to your Vercel dashboard');
  console.log('2. Navigate to Settings → Environment Variables');
  console.log('3. Add POSTGRES_URL with your Supabase connection string');
}

// Check other important variables
console.log('\n📋 Environment Variables Status:');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ Not set');

console.log('\n🎯 Next Steps:');
console.log('1. Add the missing environment variables to Vercel');
console.log('2. Redeploy your application');
console.log('3. Test the connection by visiting your app URL'); 