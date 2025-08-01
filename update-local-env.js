// Update local .env file with correct Vercel environment variables
import fs from 'fs';

const correctEnvContent = `POSTGRES_URL=postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
SESSION_SECRET=your-strong-secret-key-here
NODE_ENV=development
SUPABASE_URL=https://awsqtnvjrdntwgnevqoz.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://awsqtnvjrdntwgnevqoz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3c3F0bnZqcmRudHdnbmV2cW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Nzk5OTEsImV4cCI6MjA2OTU1NTk5MX0.YD4EWV98H1auGXjgBUrRSZ3A8q0ZgNblK7H1pOVvAgQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3c3F0bnZqcmRudHdnbmV2cW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3OTk5MSwiZXhwIjoyMDY5NTU1OTkxfQ.qWddGD1PaT3fP1Q9__hMUu3vjaDAYN8G2n7RNOVGrJA
`;

console.log('🔧 Updating local .env file...\n');

try {
  fs.writeFileSync('.env', correctEnvContent);
  console.log('✅ Local .env file updated successfully!');
  console.log('📋 Updated variables:');
  console.log('   - POSTGRES_URL (correct Supabase project)');
  console.log('   - SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  
  console.log('\n🎯 Next steps:');
  console.log('1. Your local .env is now correct');
  console.log('2. Your Vercel environment variables are correct');
  console.log('3. Try redeploying your Vercel app');
  console.log('4. Or test locally with: npm run dev');
  
} catch (error) {
  console.log('❌ Error updating .env file:', error.message);
} 