// Trigger Vercel Redeployment via API
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

async function getLatestDeployment() {
  const url = `${API_BASE}/projects/${PROJECT_ID}/deployments${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`;
  
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
  console.log('🚀 Triggering Vercel Redeployment...\n');
  
  // Get the latest deployment
  console.log('📋 Fetching latest deployment...');
  const latestDeployment = await getLatestDeployment();
  
  if (!latestDeployment) {
    console.error('❌ Could not find any deployments');
    return false;
  }
  
  console.log(`📦 Latest deployment: ${latestDeployment.url} (${latestDeployment.state})`);
  
  // Trigger redeployment
  const url = `${API_BASE}/projects/${PROJECT_ID}/deployments${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`;
  
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
      
      console.log('\n📋 Monitoring deployment...');
      console.log('You can monitor the deployment at:');
      console.log(`https://vercel.com/dashboard/project/${PROJECT_ID}/deployments`);
      
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

// Run the redeployment
triggerRedeploy().catch(console.error); 