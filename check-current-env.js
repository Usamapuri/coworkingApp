// Check Current Vercel Environment Variables
import fetch from 'node-fetch';

const VERCEL_TOKEN = 'Jaczwo8wZC9kXEzfW32QTET8';
const PROJECT_ID = 'prj_dEp2U0FLCAE7LNPuf16RFVuDK284';
const API_BASE = 'https://api.vercel.com/v1';

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

async function checkCurrentStatus() {
  console.log('🔍 Checking Current Vercel Status...\n');
  
  // Check environment variables
  console.log('📋 Current Environment Variables:');
  const currentVars = await getCurrentEnvVars();
  
  if (currentVars.length === 0) {
    console.log('❌ No environment variables found');
  } else {
    currentVars.forEach(v => {
      if (v.key.includes('POSTGRES') || v.key.includes('DATABASE')) {
        console.log(`🔍 ${v.key}: ${v.value.substring(0, 80)}...`);
        
        // Check if it contains the wrong hostname
        if (v.value.includes('api.pooler.supabase.com')) {
          console.log(`❌ WRONG HOSTNAME: ${v.key} still contains api.pooler.supabase.com`);
        } else if (v.value.includes('aws-0-us-east-1.pooler.supabase.com')) {
          console.log(`✅ CORRECT HOSTNAME: ${v.key} has aws-0-us-east-1.pooler.supabase.com`);
        }
      } else {
        console.log(`📝 ${v.key}: ${v.value.substring(0, 30)}...`);
      }
    });
  }
  
  // Check latest deployment
  console.log('\n📦 Latest Deployment:');
  const latestDeployment = await getLatestDeployment();
  
  if (latestDeployment) {
    console.log(`🔗 URL: ${latestDeployment.url}`);
    console.log(`📊 Status: ${latestDeployment.state}`);
    console.log(`🕐 Created: ${new Date(latestDeployment.createdAt).toLocaleString()}`);
    console.log(`🆔 ID: ${latestDeployment.id}`);
  } else {
    console.log('❌ No deployments found');
  }
  
  // Check if there are any database-related variables with wrong hostname
  const wrongHostnameVars = currentVars.filter(v => 
    v.value.includes('api.pooler.supabase.com')
  );
  
  if (wrongHostnameVars.length > 0) {
    console.log('\n🚨 PROBLEM DETECTED:');
    console.log('Some environment variables still contain the wrong hostname!');
    console.log('This means the deployment is using old cached variables.');
    
    console.log('\n🔧 SOLUTION:');
    console.log('1. Delete all database-related environment variables');
    console.log('2. Recreate them with the correct hostname');
    console.log('3. Force a new deployment');
  } else {
    console.log('\n✅ Environment variables look correct');
    console.log('The issue might be deployment caching. Try forcing a new deployment.');
  }
}

// Run the check
checkCurrentStatus().catch(console.error); 