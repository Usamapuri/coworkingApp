// Script to update all environment variable references
import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'test-connection-esm.js',
  'test-alternative-connections.js',
  'setup-database.js',
  'fix-vercel-database.js',
  'fix-vercel-connection.js',
  'fix-sessions-table.js',
  'fix-production-issues.js',
  'diagnose-connection.js',
  'debug-connection.js',
  'comprehensive-diagnostic.js',
  'check-vercel-env.js'
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace DATABASE_URL with POSTGRES_URL
    content = content.replace(/DATABASE_URL/g, 'POSTGRES_URL');
    
    // Update connection string examples
    content = content.replace(
      /postgresql:\/\/postgres\.dtwrnpoqfvensnrvchkr:8gVOFtb6Fsm7uHyT@aws-0-us-east-1\.pooler\.supabase\.com:6543\/postgres/g,
      'postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x'
    );
    
    // Update other connection string formats
    content = content.replace(
      /postgresql:\/\/postgres\.\[project-ref\]:\[password\]@aws-0-\[region\]\.pooler\.supabase\.com:6543\/postgres/g,
      'postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔄 Updating environment variable references...\n');

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    updateFile(file);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n🎉 Environment variable update complete!');
console.log('\n📋 Next steps:');
console.log('1. Add POSTGRES_URL to your Vercel environment variables');
console.log('2. Redeploy your application');
console.log('3. Test the connection'); 