// Test endpoints to debug authentication issues
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

async function testEndpoints() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔍 Testing endpoints...\n');
  
  // Test 1: Health check
  console.log('1️⃣ Testing health check...');
  try {
    const health = await makeRequest(`${baseUrl}/api/health`);
    console.log('✅ Health check response:', health.statusCode);
    console.log('Data:', JSON.stringify(health.data, null, 2));
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Login with test credentials
  console.log('2️⃣ Testing login endpoint...');
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    const login = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', loginData);
    console.log('✅ Login response:', login.statusCode);
    console.log('Data:', JSON.stringify(login.data, null, 2));
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Check auth/me without authentication
  console.log('3️⃣ Testing /api/auth/me (should return 401)...');
  try {
    const me = await makeRequest(`${baseUrl}/api/auth/me`);
    console.log('✅ /api/auth/me response:', me.statusCode);
    console.log('Data:', JSON.stringify(me.data, null, 2));
  } catch (error) {
    console.error('❌ /api/auth/me test failed:', error.message);
  }
}

testEndpoints().catch(console.error); 