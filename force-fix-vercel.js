// Force Fix Vercel - Complete Environment Reset
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

async function getProjects() {
  try {
    const response = await fetch(`${API_BASE}/projects`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const projects = await response.json();
      return projects.projects || [];
    } else {
      console.error('❌ Failed to fetch projects');
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    return [];
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

async function forceFixVercel() {
  console.log('🔧 Force Fix Vercel - Complete Environment Reset\n');
  
  // Step 1: Test token
  const tokenValid = await testToken();
  if (!tokenValid) {
    console.log('\n❌ Cannot proceed - token is invalid');
    return;
  }
  
  // Step 2: List projects to verify project ID
  console.log('\n📋 Step 1: Verifying project access...');
  const projects = await getProjects();
  
  if (projects.length === 0) {
    console.log('❌ No projects found or access denied');
    return;
  }
  
  console.log(`✅ Found ${projects.length} projects`);
  const targetProject = projects.find(p => p.id === PROJECT_ID);
  
  if (!targetProject) {
    console.log('❌ Project not found. Available projects:');
    projects.forEach(p => {
      console.log(`- ${p.name} (${p.id})`);
    });
    return;
  }
  
  console.log(`✅ Project found: ${targetProject.name}`);
  
  // Step 3: Get current environment variables
  console.log('\n📋 Step 2: Fetching current environment variables...');
  const currentVars = await getCurrentEnvVars();
  
  if (currentVars.length === 0) {
    console.log('✅ No existing environment variables found');
  } else {
    console.log(`📝 Found ${currentVars.length} existing environment variables`);
    currentVars.forEach(v => {
      console.log(`- ${v.key}: ${v.value.substring(0, 50)}...`);
    });
  }
  
  // Step 4: Delete ALL environment variables (clean slate)
  console.log('\n🗑️  Step 3: Deleting ALL environment variables...');
  for (const envVar of currentVars) {
    await deleteEnvVar(envVar.key);
  }
  
  // Step 5: Create new environment variables
  console.log('\n➕ Step 4: Creating new environment variables...');
  let successCount = 0;
  
  for (const [key, value] of Object.entries(ENV_VARS)) {
    const success = await createEnvVar(key, value);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Environment Variables: ${successCount}/${Object.keys(ENV_VARS)} created successfully`);
  
  if (successCount === Object.keys(ENV_VARS).length) {
    console.log('✅ All environment variables created successfully!');
    
    console.log('\n🎉 FORCE FIX COMPLETED!');
    console.log('\n📋 What was done:');
    console.log('1. ✅ Verified project access');
    console.log('2. ✅ Deleted ALL existing environment variables');
    console.log('3. ✅ Created correct POSTGRES_URL with aws-0-us-east-1.pooler.supabase.com');
    console.log('4. ✅ Set SESSION_SECRET for secure sessions');
    console.log('5. ✅ Set NODE_ENV=production');
    
    console.log('\n🔗 Next steps:');
    console.log('1. Go to your Vercel dashboard');
    console.log('2. Navigate to Deployments');
    console.log('3. Click "Redeploy" on your latest deployment');
    console.log('4. Or make a small change to trigger a new deployment');
    
    console.log('\n⏳ Your app should work after the next deployment!');
  } else {
    console.log('\n❌ Some environment variables failed to create');
    console.log('Please check the errors above and try again');
  }
}

// Run the force fix
forceFixVercel().catch(console.error); 