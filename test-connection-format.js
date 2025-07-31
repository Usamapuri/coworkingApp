// Test connection string format
console.log('🔍 Testing connection string format...\n');

// The correct connection string
const correctConnectionString = 'postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x';

console.log('✅ Correct connection string format:');
console.log(correctConnectionString);
console.log('\n🔍 Key components:');
console.log('- Protocol: postgres://');
console.log('- Username: postgres.dtwrnpoqfvensnrvchkr');
console.log('- Password: calmkaaj7874');
console.log('- Host: aws-0-us-east-1.pooler.supabase.com');
console.log('- Port: 6543');
console.log('- Database: postgres');
console.log('- SSL: sslmode=require');
console.log('- Pooler: supa=base-pooler.x');

console.log('\n❌ The error shows it\'s trying to connect to:');
console.log('   api.pooler.supabase.com');
console.log('\n✅ But it should be connecting to:');
console.log('   aws-0-us-east-1.pooler.supabase.com');

console.log('\n🎯 This means Vercel is using an old/cached environment variable.');
console.log('You need to completely remove and re-add the POSTGRES_URL in Vercel.'); 