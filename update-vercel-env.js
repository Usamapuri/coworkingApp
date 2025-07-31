// Update Vercel Environment Variables via API
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = 'prj_dEp2U0FLCAE7LNPuf16RFVuDK284';
const TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional, for team projects

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN environment variable is required');
  console.log('\n📋 To get your Vercel token:');
  console.log('1. Go to https://vercel.com/account/tokens');
  console.log('2. Create a new token with "Full Account" scope');
  console.log('3. Add it to your .env file as VERCEL_TOKEN=your_token_here');
  process.exit(1);
}

const API_BASE = 'https://api.vercel.com/v1';

// Environment variables to set
const ENV_VARS = {
  POSTGRES_URL: 'postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x',
  SESSION_SECRET: 'calmkaaj-session-secret-2024-secure-key',
  NODE_ENV: 'production'
};

async function getCurrentEnvVars() {
  const url = `${API_BASE}/projects/${PROJECT_ID}/env${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch env vars: ${response.status} ${response.statusText}`);
    }
    
    const envVars = await response.json();
    return envVars.envs || [];
  } catch (error) {
    console.error('❌ Error fetching current environment variables:', error.message);
    return [];
  }
}

async function deleteEnvVar(key) {
  const url = `${API_BASE}/projects/${PROJECT_ID}/env/${key}${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log(`✅ Deleted ${key}`);
      return true;
    } else {
      console.log(`⚠️  Could not delete ${key}: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`⚠️  Error deleting ${key}:`, error.message);
    return false;
  }
}

async function createEnvVar(key, value, environments = ['production', 'preview', 'development']) {
  const url = `${API_BASE}/projects/${PROJECT_ID}/env${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key,
        value,
        target: environments,
        type: 'encrypted'
      })
    });
    
    if (response.ok) {
      console.log(`✅ Created ${key}`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to create ${key}: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error creating ${key}:`, error.message);
    return false;
  }
}

async function updateVercelEnvironment() {
  console.log('🚀 Updating Vercel Environment Variables...\n');
  
  // Get current environment variables
  console.log('📋 Fetching current environment variables...');
  const currentVars = await getCurrentEnvVars();
  
  // Show current database-related variables
  const dbVars = currentVars.filter(v => 
    v.key.includes('DATABASE') || 
    v.key.includes('POSTGRES') || 
    v.key.includes('SUPABASE')
  );
  
  if (dbVars.length > 0) {
    console.log('\n🔍 Current database-related variables:');
    dbVars.forEach(v => {
      console.log(`- ${v.key}: ${v.value.substring(0, 50)}...`);
    });
    
    // Delete old database variables
    console.log('\n🗑️  Deleting old database variables...');
    for (const envVar of dbVars) {
      await deleteEnvVar(envVar.key);
    }
  }
  
  // Create new environment variables
  console.log('\n➕ Creating new environment variables...');
  let successCount = 0;
  
  for (const [key, value] of Object.entries(ENV_VARS)) {
    const success = await createEnvVar(key, value);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Results: ${successCount}/${Object.keys(ENV_VARS)} variables created successfully`);
  
  if (successCount === Object.keys(ENV_VARS).length) {
    console.log('\n🎉 All environment variables updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Vercel dashboard');
    console.log('2. Navigate to Deployments');
    console.log('3. Redeploy your latest deployment');
    console.log('4. Test your application');
  } else {
    console.log('\n⚠️  Some variables failed to update. Please check the errors above.');
  }
}

// Run the update
updateVercelEnvironment().catch(console.error); 