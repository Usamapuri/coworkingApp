import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('👑 Creating admin user with proper password...');
  
  try {
    // Hash the password properly
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('🔐 Password hashed successfully');
    
    // Update existing admin user's password
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('email', 'admin@calmkaaj.com')
      .select()
      .single();

    if (updateError) {
      console.log('❌ Error updating admin user:', updateError.message);
    } else {
      console.log('✅ Admin user password updated:', updatedUser);
    }

    console.log('\n🎯 Admin Login credentials:');
    console.log('Email: admin@calmkaaj.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error during admin user creation:', error);
  }
}

createAdminUser()
  .then(() => {
    console.log('\n🎯 Admin user setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Admin user setup failed:', error);
    process.exit(1);
  }); 