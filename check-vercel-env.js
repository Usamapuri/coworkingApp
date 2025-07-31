import dotenv from 'dotenv';

console.log('🔍 Vercel Environment Variables Check\n');

// Load environment variables
dotenv.config();

console.log('📋 Current Environment Variables:');
console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.POSTGRES_URL) {
  const dbUrl = process.env.POSTGRES_URL;
  console.log('\n🔗 POSTGRES_URL Analysis:');
  console.log('URL length:', dbUrl.length);
  
  // Extract hostname from URL
  const urlMatch = dbUrl.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    const hostname = urlMatch[1];
    const port = urlMatch[2];
    console.log('Hostname:', hostname);
    console.log('Port:', port);
    
    if (hostname.includes('api.')) {
      console.error('\n❌ PROBLEM: Hostname contains "api." which is incorrect!');
      console.log('Current hostname:', hostname);
      console.log('Should be: db.dtwrnpoqfvensnrvchkr.supabase.co');
    } else if (hostname.includes('db.dtwrnpoqfvensnrvchkr')) {
      console.log('\n✅ Hostname looks correct!');
    } else {
      console.log('\n⚠️ Hostname format unknown:', hostname);
    }
  }
  
  console.log('\n📋 RECOMMENDED Vercel Environment Variables:');
  console.log('POSTGRES_URL=postgresql://postgres:calmkaaj7874@db.dtwrnpoqfvensnrvchkr.supabase.co:5432/postgres');
  console.log('SESSION_SECRET=d38ba1fd561b6f4f0211c1d72a39630c6b50ded4fda1ad2a9049c0bd81b3cb2781addde868fbf6fe4515d9b7fc6ab0145647c1d6c21b9ed6e96bb7aab23e7015');
  console.log('NODE_ENV=production');
} else {
  console.error('\n❌ POSTGRES_URL is not set!');
  console.log('\n📋 Set these in Vercel:');
  console.log('POSTGRES_URL=postgresql://postgres:calmkaaj7874@db.dtwrnpoqfvensnrvchkr.supabase.co:5432/postgres');
  console.log('SESSION_SECRET=d38ba1fd561b6f4f0211c1d72a39630c6b50ded4fda1ad2a9049c0bd81b3cb2781addde868fbf6fe4515d9b7fc6ab0145647c1d6c21b9ed6e96bb7aab23e7015');
  console.log('NODE_ENV=production');
} 