import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProperUser() {
  console.log('👤 Creating proper user with bcrypt password...');
  
  try {
    // Hash the password properly
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('🔐 Password hashed successfully');
    
    // Create a user with proper password hash
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password_hash: hashedPassword,
        role: 'user',
        organization_id: 1  // Use existing organization
      })
      .select()
      .single();

    if (userError) {
      if (userError.message.includes('duplicate key')) {
        console.log('⚠️ User already exists, updating password...');
        
        // Update existing user's password
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ password_hash: hashedPassword })
          .eq('email', 'test@example.com')
          .select()
          .single();

        if (updateError) {
          console.log('❌ Error updating user:', updateError.message);
        } else {
          console.log('✅ User password updated:', updatedUser);
        }
      } else {
        console.log('❌ Error creating user:', userError.message);
      }
    } else {
      console.log('✅ User created:', user);
    }

    console.log('\n🎯 Login credentials:');
    console.log('Email: test@example.com');
    console.log('Password: test123');

  } catch (error) {
    console.error('❌ Error during user creation:', error);
  }
}

createProperUser()
  .then(() => {
    console.log('\n🎯 User creation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 User creation failed:', error);
    process.exit(1);
  }); 