// Debug Vercel Environment Variables
console.log('🔍 DEBUGGING VERCEL ENVIRONMENT VARIABLES\n');

console.log('🚨 THE PROBLEM:');
console.log('Vercel is still using the OLD environment variables with "api.pooler.supabase.com"');
console.log('Even though we updated them, the deployment is cached.\n');

console.log('🔧 IMMEDIATE FIXES:\n');

console.log('OPTION 1: Force Environment Variable Update');
console.log('1. Go to Vercel Dashboard → Settings → Environment Variables');
console.log('2. DELETE the POSTGRES_URL variable completely');
console.log('3. ADD it back with the correct value:');
console.log('   postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x');
console.log('4. Make sure it\'s set for PRODUCTION environment');
console.log('5. Click SAVE');
console.log('6. Go to Deployments → Redeploy\n');

console.log('OPTION 2: Check for Multiple Environment Variables');
console.log('1. Look for ANY environment variable containing "api.pooler.supabase.com"');
console.log('2. Common names to check:');
console.log('   - POSTGRES_URL');
console.log('   - DATABASE_URL');
console.log('   - SUPABASE_URL');
console.log('   - Any other database-related variables');
console.log('3. Delete ALL of them and add the correct ones\n');

console.log('OPTION 3: Force Complete Redeploy');
console.log('1. Go to Deployments tab');
console.log('2. Click the three dots on the latest deployment');
console.log('3. Select "Redeploy"');
console.log('4. Or create a new deployment from a different branch\n');

console.log('🎯 THE CORRECT ENVIRONMENT VARIABLES SHOULD BE:');
console.log('POSTGRES_URL=postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x');
console.log('SUPABASE_URL=https://awsqtnvjrdntwgnevqoz.supabase.co');
console.log('NEXT_PUBLIC_SUPABASE_URL=https://awsqtnvjrdntwgnevqoz.supabase.co');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3c3F0bnZqcmRudHdnbmV2cW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Nzk5OTEsImV4cCI6MjA2OTU1NTk5MX0.YD4EWV98H1auGXjgBUrRSZ3A8q0ZgNblK7H1pOVvAgQ');
console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3c3F0bnZqcmRudHdnbmV2cW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3OTk5MSwiZXhwIjoyMDY5NTU1OTkxfQ.qWddGD1PaT3fP1Q9__hMUu3vjaDAYN8G2n7RNOVGrJA\n');

console.log('⚠️  CRITICAL: Make sure NO environment variable contains "api.pooler.supabase.com"'); 