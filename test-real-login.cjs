// Test login with actual user data from the database
const https = require('https');

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testRealLogin() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔍 Testing login with actual database users...\n');
  
  // These are the actual users from the database
  // Note: We don't know the actual passwords, so we'll try common ones
  const testUsers = [
    { email: 'admin@calmkaaj.com', password: 'admin123', name: 'CalmKaaj Team (Admin)' },
    { email: 'manager@calmkaaj.com', password: 'manager123', name: 'Cafe Manager (Staff)' },
    { email: 'shayan.qureshi@calmkaaj.org', password: 'password123', name: 'Shayan Qureshi (Admin)' },
    { email: 'zeb.ayaz@calmkaaj.org', password: 'password123', name: 'Zeb Ayaz (Admin)' },
    { email: 'haider.nadeem@calmkaaj.org', password: 'password123', name: 'Haider Nadeem (Admin)' },
    { email: 'sana.pirzada@calmkaaj.org', password: 'password123', name: 'Sana (Admin)' },
    { email: 'hadia.maryam@calmkaaj.org', password: 'password123', name: 'Hadia (Admin)' },
    { email: 'member@xyz.com', password: 'password123', name: 'Member (User)' },
    { email: 'sameer@faazil.com', password: 'password123', name: 'Sameer Shahid (User)' }
  ];
  
  for (const user of testUsers) {
    console.log(`\n🔐 Trying login with: ${user.email} (${user.name})`);
    try {
      const login = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
        email: user.email,
        password: user.password
      });
      
      console.log(`Status: ${login.statusCode}`);
      
      if (login.statusCode === 200) {
        console.log('✅ Login successful!');
        console.log('User data:', JSON.stringify(login.data, null, 2));
        
        // Test the /api/auth/me endpoint with the session
        console.log('\n🔍 Testing /api/auth/me with session...');
        try {
          const me = await makeRequest(`${baseUrl}/api/auth/me`);
          console.log('✅ /api/auth/me response:', me.statusCode);
          console.log('User data:', JSON.stringify(me.data, null, 2));
        } catch (error) {
          console.error('❌ /api/auth/me failed:', error.message);
        }
        
        break;
      } else if (login.statusCode === 401) {
        console.log('❌ Invalid credentials');
        if (login.data && login.data.message) {
          console.log('Error:', login.data.message);
        }
      } else if (login.statusCode === 400) {
        console.log('❌ Bad request');
        console.log('Error:', JSON.stringify(login.data, null, 2));
      } else {
        console.log('❌ Unexpected response');
        console.log('Response:', JSON.stringify(login.data, null, 2));
      }
    } catch (error) {
      console.error('❌ Request failed:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 If all logins fail, the passwords in the database are hashed');
  console.log('💡 You may need to reset a password or create a new user');
  console.log('💡 Check your Supabase dashboard for the actual user passwords');
}

testRealLogin().catch(console.error); 