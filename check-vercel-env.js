import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Vercel Environment Variables Check\n');

console.log('📋 Current Environment Variables:');
console.log('================================');

// Check required variables
const requiredVars = [
  'DATABASE_URL',
  'SESSION_SECRET', 
  'NODE_ENV'
];

const optionalVars = [
  'SENDGRID_API_KEY',
  'FROM_EMAIL',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY'
];

console.log('✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName === 'DATABASE_URL') {
      console.log(`  ${varName}: ${value.substring(0, 50)}...`);
    } else if (varName === 'SESSION_SECRET') {
      const isPlaceholder = value === 'your-secret-key-here' || value === 'your-strong-secret-key-here';
      console.log(`  ${varName}: ${isPlaceholder ? '❌ PLACEHOLDER VALUE' : '✅ SET'}`);
    } else {
      console.log(`  ${varName}: ${value}`);
    }
  } else {
    console.log(`  ${varName}: ❌ NOT SET`);
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ${varName}: ✅ SET`);
  } else {
    console.log(`  ${varName}: ⚪ NOT SET (optional)`);
  }
});

console.log('\n🔧 Environment Status:');
if (process.env.NODE_ENV === 'production') {
  console.log('✅ NODE_ENV is set to production');
} else {
  console.log('❌ NODE_ENV is not set to production');
  console.log('   Current value:', process.env.NODE_ENV || 'undefined');
}

if (process.env.SESSION_SECRET && 
    process.env.SESSION_SECRET !== 'your-secret-key-here' && 
    process.env.SESSION_SECRET !== 'your-strong-secret-key-here') {
  console.log('✅ SESSION_SECRET is properly configured');
} else {
  console.log('❌ SESSION_SECRET is not properly configured');
}

if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL is set');
} else {
  console.log('❌ DATABASE_URL is not set');
}

console.log('\n📝 Next Steps:');
console.log('1. If any required variables show ❌, set them in Vercel dashboard');
console.log('2. Make sure NODE_ENV=production in Vercel');
console.log('3. Use a strong SESSION_SECRET (not placeholder)');
console.log('4. Redeploy after setting environment variables'); 