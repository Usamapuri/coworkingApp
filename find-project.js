// Find Vercel Project
import fetch from 'node-fetch';

const VERCEL_TOKEN = 'Jaczwo8wZC9kXEzfW32QTET8';
const API_BASE = 'https://api.vercel.com/v1';

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

async function getTeams() {
  try {
    const response = await fetch(`${API_BASE}/teams`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const teams = await response.json();
      return teams.teams || [];
    } else {
      console.error('❌ Failed to fetch teams');
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching teams:', error.message);
    return [];
  }
}

async function getTeamProjects(teamId) {
  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}/projects`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const projects = await response.json();
      return projects.projects || [];
    } else {
      console.error(`❌ Failed to fetch team projects for team ${teamId}`);
      return [];
    }
  } catch (error) {
    console.error(`❌ Error fetching team projects for team ${teamId}:`, error.message);
    return [];
  }
}

async function findProject() {
  console.log('🔍 Finding Vercel Project...\n');
  
  // Step 1: Test token
  const tokenValid = await testToken();
  if (!tokenValid) {
    console.log('\n❌ Cannot proceed - token is invalid');
    return;
  }
  
  // Step 2: Get personal projects
  console.log('📋 Step 1: Checking personal projects...');
  const personalProjects = await getProjects();
  
  if (personalProjects.length > 0) {
    console.log(`✅ Found ${personalProjects.length} personal projects:`);
    personalProjects.forEach(p => {
      console.log(`- ${p.name} (${p.id}) - ${p.framework || 'Unknown framework'}`);
    });
  } else {
    console.log('❌ No personal projects found');
  }
  
  // Step 3: Get teams
  console.log('\n📋 Step 2: Checking team projects...');
  const teams = await getTeams();
  
  if (teams.length > 0) {
    console.log(`✅ Found ${teams.length} teams:`);
    for (const team of teams) {
      console.log(`\n👥 Team: ${team.name} (${team.id})`);
      const teamProjects = await getTeamProjects(team.id);
      
      if (teamProjects.length > 0) {
        console.log(`  📁 Projects in this team:`);
        teamProjects.forEach(p => {
          console.log(`  - ${p.name} (${p.id}) - ${p.framework || 'Unknown framework'}`);
        });
      } else {
        console.log(`  ❌ No projects in this team`);
      }
    }
  } else {
    console.log('❌ No teams found');
  }
  
  // Step 4: Look for CalmKaaj project
  console.log('\n🔍 Step 3: Looking for CalmKaaj project...');
  const allProjects = [...personalProjects];
  
  for (const team of teams) {
    const teamProjects = await getTeamProjects(team.id);
    allProjects.push(...teamProjects.map(p => ({ ...p, teamId: team.id, teamName: team.name })));
  }
  
  const calmkaajProject = allProjects.find(p => 
    p.name.toLowerCase().includes('calmkaaj') || 
    p.name.toLowerCase().includes('calm') ||
    p.name.toLowerCase().includes('kaaj')
  );
  
  if (calmkaajProject) {
    console.log('🎯 Found CalmKaaj project!');
    console.log(`📁 Project: ${calmkaajProject.name}`);
    console.log(`🆔 Project ID: ${calmkaajProject.id}`);
    if (calmkaajProject.teamId) {
      console.log(`👥 Team: ${calmkaajProject.teamName} (${calmkaajProject.teamId})`);
    }
    console.log(`🔗 URL: ${calmkaajProject.url || 'N/A'}`);
    console.log(`📊 Framework: ${calmkaajProject.framework || 'Unknown'}`);
    
    console.log('\n💡 To use this project, update the PROJECT_ID in your scripts to:');
    console.log(`PROJECT_ID = '${calmkaajProject.id}'`);
    
    if (calmkaajProject.teamId) {
      console.log('\n💡 And add the team ID:');
      console.log(`TEAM_ID = '${calmkaajProject.teamId}'`);
    }
  } else {
    console.log('❌ CalmKaaj project not found');
    console.log('\n📋 All available projects:');
    allProjects.forEach(p => {
      const teamInfo = p.teamId ? ` (Team: ${p.teamName})` : '';
      console.log(`- ${p.name} (${p.id})${teamInfo}`);
    });
  }
}

// Run the find project
findProject().catch(console.error); 