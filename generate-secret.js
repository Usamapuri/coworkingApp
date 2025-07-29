import crypto from 'crypto';

// Generate a secure random session secret
const sessionSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 Generated Secure Session Secret\n');
console.log('Copy this to your Vercel environment variables:');
console.log('==============================================');
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log('==============================================');
console.log('\n📝 Instructions:');
console.log('1. Go to your Vercel dashboard');
console.log('2. Select your project: coworking-app-ywpo');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add SESSION_SECRET with the value above');
console.log('5. Set NODE_ENV=production');
console.log('6. Redeploy your application'); 