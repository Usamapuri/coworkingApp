// Test login validation to see exact error details
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testLoginValidation() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔍 Testing login validation to see exact error details...\n');
  
  // Test 1: Valid format
  console.log('1️⃣ Testing with valid format...');
  try {
    const test1 = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
      email: 'test@example.com',
      password: 'testpassword123'
    });
    console.log(`Status: ${test1.statusCode}`);
    console.log('Response:', JSON.stringify(test1.data, null, 2));
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 2: Missing email
  console.log('2️⃣ Testing with missing email...');
  try {
    const test2 = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
      password: 'testpassword123'
    });
    console.log(`Status: ${test2.statusCode}`);
    console.log('Response:', JSON.stringify(test2.data, null, 2));
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 3: Missing password
  console.log('3️⃣ Testing with missing password...');
  try {
    const test3 = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
      email: 'test@example.com'
    });
    console.log(`Status: ${test3.statusCode}`);
    console.log('Response:', JSON.stringify(test3.data, null, 2));
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 4: Invalid email format
  console.log('4️⃣ Testing with invalid email format...');
  try {
    const test4 = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
      email: 'invalid-email',
      password: 'testpassword123'
    });
    console.log(`Status: ${test4.statusCode}`);
    console.log('Response:', JSON.stringify(test4.data, null, 2));
  } catch (error) {
    console.error('❌ Test 4 failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 5: Empty password
  console.log('5️⃣ Testing with empty password...');
  try {
    const test5 = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
      email: 'test@example.com',
      password: ''
    });
    console.log(`Status: ${test5.statusCode}`);
    console.log('Response:', JSON.stringify(test5.data, null, 2));
  } catch (error) {
    console.error('❌ Test 5 failed:', error.message);
  }
}

testLoginValidation().catch(console.error); 