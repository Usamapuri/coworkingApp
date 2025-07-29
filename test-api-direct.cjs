// Test API endpoints directly
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
        'User-Agent': 'API-Test/1.0'
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
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData.substring(0, 500) // Limit response size
        });
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

async function testAPI() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔍 Testing API endpoints directly...\n');
  
  // Test 1: Health check
  console.log('1️⃣ Testing /api/health...');
  try {
    const health = await makeRequest(`${baseUrl}/api/health`);
    console.log(`Status: ${health.statusCode}`);
    console.log('Response type:', health.headers['content-type']);
    console.log('Response preview:', health.data.substring(0, 200));
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 2: Login endpoint
  console.log('2️⃣ Testing /api/auth/login...');
  try {
    const login = await makeRequest(`${baseUrl}/api/auth/login`, 'POST', {
      email: 'test@example.com',
      password: 'test123'
    });
    console.log(`Status: ${login.statusCode}`);
    console.log('Response type:', login.headers['content-type']);
    console.log('Response preview:', login.data.substring(0, 200));
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 3: Check if it's serving the frontend
  console.log('3️⃣ Testing root path (should serve frontend)...');
  try {
    const root = await makeRequest(`${baseUrl}/`);
    console.log(`Status: ${root.statusCode}`);
    console.log('Response type:', root.headers['content-type']);
    console.log('Response preview:', root.data.substring(0, 200));
  } catch (error) {
    console.error('❌ Root test failed:', error.message);
  }
}

testAPI().catch(console.error); 