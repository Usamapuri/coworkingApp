// Fix Vercel Environment Variables
import { execSync } from 'child_process';

const correctUrl = "postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x";

console.log('🔧 Fixing Vercel Environment Variables...\n');

console.log('📋 Manual Steps (if Vercel CLI is not available):');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Select your CalmKaaj project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Find POSTGRES_URL and update it to:');
console.log(`   ${correctUrl}`);
console.log('5. Save and redeploy\n');

console.log('🚀 Automated Steps (if Vercel CLI is available):');
try {
  // Check if vercel CLI is installed
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI found!');
  
  console.log('\n📝 To update environment variable, run:');
  console.log(`vercel env add POSTGRES_URL production`);
  console.log('Then paste the URL when prompted:');
  console.log(correctUrl);
  
  console.log('\n🔄 Then redeploy with:');
  console.log('vercel --prod');
  
} catch (error) {
  console.log('❌ Vercel CLI not found. Please use the manual steps above.');
  console.log('\n💡 To install Vercel CLI: npm install -g vercel');
}

console.log('\n🎯 The key issue is:');
console.log('❌ Current (wrong): api.pooler.supabase.com');
console.log('✅ Correct: aws-0-us-east-1.pooler.supabase.com'); 