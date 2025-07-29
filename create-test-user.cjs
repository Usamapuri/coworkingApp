// Create a new test user for login testing
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

async function createTestUser() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔧 Creating a new test user...\n');
  
  const newUser = {
    email: 'testuser@calmkaaj.com',
    password: 'testpassword123',
    first_name: 'Test',
    last_name: 'User',
    role: 'user',
    site: 'blue_area'
  };
  
  try {
    console.log('📝 Registering user:', newUser.email);
    const register = await makeRequest(`${baseUrl}/api/auth/register`, 'POST', newUser);
    
    console.log(`Status: ${register.statusCode}`);
    
    if (register.statusCode === 201) {
      console.log('✅ User created successfully!');
      console.log('User data:', JSON.stringify(register.data, null, 2));
      
      console.log('\n🔐 Now testing login with the new user...');
      const login = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
        email: newUser.email,
        password: newUser.password
      });
      
      console.log(`Login Status: ${login.statusCode}`);
      
      if (login.statusCode === 200) {
        console.log('✅ Login successful!');
        console.log('Login response:', JSON.stringify(login.data, null, 2));
        
        console.log('\n🔍 Testing /api/auth/me...');
        const me = await makeRequest(`${baseUrl}/api/auth/me`);
        console.log(`/api/auth/me Status: ${me.statusCode}`);
        console.log('User data:', JSON.stringify(me.data, null, 2));
        
      } else {
        console.log('❌ Login failed');
        console.log('Response:', JSON.stringify(login.data, null, 2));
      }
      
    } else if (register.statusCode === 400) {
      console.log('❌ Registration failed');
      console.log('Error:', JSON.stringify(register.data, null, 2));
    } else {
      console.log('❌ Unexpected response');
      console.log('Response:', JSON.stringify(register.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 Test credentials:');
  console.log('Email: testuser@calmkaaj.com');
  console.log('Password: testpassword123');
}

createTestUser().catch(console.error); 