import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrgSchema() {
  console.log('🔍 Checking organizations table schema...');
  
  try {
    const { data: orgs, error } = await supabase
      .from('organizations')
      .select('*')
      .limit(3);
    
    if (error) {
      console.error('❌ Error querying organizations:', error);
      return;
    }
    
    console.log('✅ Organizations table data:');
    console.log(JSON.stringify(orgs, null, 2));
    
    // Check the structure of the first organization
    if (orgs && orgs.length > 0) {
      const firstOrg = orgs[0];
      console.log('\n📋 First organization structure:');
      Object.keys(firstOrg).forEach(key => {
        console.log(`${key}: ${typeof firstOrg[key]} (${firstOrg[key]})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkOrgSchema(); 