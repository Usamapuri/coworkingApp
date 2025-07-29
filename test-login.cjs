// Test login with actual user data
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

async function testLogin() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔍 Testing login with actual user data...\n');
  
  // Test with a user that should exist in the database
  // Based on the data we imported, let's try some common emails
  const testUsers = [
    { email: 'admin@calmkaaj.com', password: 'admin123' },
    { email: 'user@example.com', password: 'password123' },
    { email: 'test@calmkaaj.com', password: 'test123' },
    { email: 'manager@calmkaaj.com', password: 'manager123' }
  ];
  
  for (const user of testUsers) {
    console.log(`\n🔐 Trying login with: ${user.email}`);
    try {
      const login = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', user);
      console.log(`Status: ${login.statusCode}`);
      
      if (login.statusCode === 200) {
        console.log('✅ Login successful!');
        console.log('User data:', JSON.stringify(login.data, null, 2));
        break;
      } else if (login.statusCode === 401) {
        console.log('❌ Invalid credentials');
        console.log('Error:', login.data.message);
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
  console.log('💡 If all logins fail, we need to check what users exist in the database');
  console.log('💡 You can check your Supabase dashboard to see the actual user emails');
}

testLogin().catch(console.error); 