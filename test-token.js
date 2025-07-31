// Test Vercel Token and Run Automated Fix
import fetch from 'node-fetch';

const VERCEL_TOKEN = 'Jaczwo8wZC9kXEzfW32QTET8';
const PROJECT_ID = 'prj_dEp2U0FLCAE7LNPuf16RFVuDK284';
const API_BASE = 'https://api.vercel.com/v1';

// Environment variables to set
const ENV_VARS = {
  POSTGRES_URL: 'postgres://postgres.dtwrnpoqfvensnrvchkr:calmkaaj7874@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x',
  SESSION_SECRET: 'calmkaaj-session-secret-2024-secure-key',
  NODE_ENV: 'production'
};

async function testToken() {
  console.log('🔍 Testing Vercel token...');
  
  try {
    const response = await fetch(`${API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ Token is valid!');
      console.log(`👤 User: ${user.user?.name || 'Unknown'}`);
      console.log(`📧 Email: ${user.user?.email || 'Unknown'}`);
      return true;
    } else {
      console.error('❌ Token is invalid or expired');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing token:', error.message);
    return false;
  }
}

async function getCurrentEnvVars() {
  const url = `${API_BASE}/projects/${PROJECT_ID}/env`;
  
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
  const url = `${API_BASE}/projects/${PROJECT_ID}/env/${key}`;
  
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
  const url = `${API_BASE}/projects/${PROJECT_ID}/env`;
  
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

async function getLatestDeployment() {
  const url = `${API_BASE}/projects/${PROJECT_ID}/deployments`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch deployments: ${response.status} ${response.statusText}`);
    }
    
    const deployments = await response.json();
    return deployments.deployments?.[0]; // Latest deployment
  } catch (error) {
    console.error('❌ Error fetching deployments:', error.message);
    return null;
  }
}

async function triggerRedeploy() {
  console.log('\n🚀 Triggering Vercel Redeployment...');
  
  const latestDeployment = await getLatestDeployment();
  
  if (!latestDeployment) {
    console.error('❌ Could not find any deployments');
    return false;
  }
  
  console.log(`📦 Latest deployment: ${latestDeployment.url} (${latestDeployment.state})`);
  
  const url = `${API_BASE}/projects/${PROJECT_ID}/deployments`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: latestDeployment.name,
        gitSource: {
          type: 'github',
          repoId: latestDeployment.gitSource?.repoId,
          ref: latestDeployment.gitSource?.ref || 'main'
        }
      })
    });
    
    if (response.ok) {
      const newDeployment = await response.json();
      console.log('✅ Redeployment triggered successfully!');
      console.log(`🔗 New deployment URL: ${newDeployment.url}`);
      console.log(`🆔 Deployment ID: ${newDeployment.id}`);
      console.log(`📊 Status: ${newDeployment.state}`);
      
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to trigger redeployment: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error triggering redeployment:', error.message);
    return false;
  }
}

async function fixVercelAutomated() {
  console.log('🔧 Automated Vercel Fix - Environment Variables & Redeployment\n');
  
  // Step 1: Test token
  const tokenValid = await testToken();
  if (!tokenValid) {
    console.log('\n❌ Cannot proceed - token is invalid');
    return;
  }
  
  // Step 2: Get current environment variables
  console.log('\n📋 Step 1: Fetching current environment variables...');
  const currentVars = await getCurrentEnvVars();
  
  // Step 3: Show current database-related variables
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
    
    // Step 4: Delete old database variables
    console.log('\n🗑️  Step 2: Deleting old database variables...');
    for (const envVar of dbVars) {
      await deleteEnvVar(envVar.key);
    }
  } else {
    console.log('\n✅ No old database variables found to delete');
  }
  
  // Step 5: Create new environment variables
  console.log('\n➕ Step 3: Creating new environment variables...');
  let successCount = 0;
  
  for (const [key, value] of Object.entries(ENV_VARS)) {
    const success = await createEnvVar(key, value);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Environment Variables: ${successCount}/${Object.keys(ENV_VARS)} created successfully`);
  
  if (successCount === Object.keys(ENV_VARS).length) {
    console.log('✅ All environment variables updated successfully!');
    
    // Step 6: Trigger redeployment
    const redeploySuccess = await triggerRedeploy();
    
    if (redeploySuccess) {
      console.log('\n🎉 COMPLETE SUCCESS!');
      console.log('\n📋 What was fixed:');
      console.log('1. ✅ Deleted old database environment variables');
      console.log('2. ✅ Created correct POSTGRES_URL with aws-0-us-east-1.pooler.supabase.com');
      console.log('3. ✅ Set SESSION_SECRET for secure sessions');
      console.log('4. ✅ Set NODE_ENV=production');
      console.log('5. ✅ Triggered new deployment');
      
      console.log('\n🔗 Monitor your deployment at:');
      console.log(`https://vercel.com/dashboard/project/${PROJECT_ID}/deployments`);
      
      console.log('\n⏳ Your app should be working in 2-3 minutes!');
    } else {
      console.log('\n⚠️  Environment variables updated but redeployment failed');
      console.log('Please manually redeploy from the Vercel dashboard');
    }
  } else {
    console.log('\n❌ Some environment variables failed to update');
    console.log('Please check the errors above and try again');
  }
}

// Run the automated fix
fixVercelAutomated().catch(console.error); 