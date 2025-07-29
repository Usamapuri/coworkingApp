// Test different approaches to bypass Vercel authentication
const https = require('https');

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
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
          data: responseData.substring(0, 300)
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

async function testBypassAuth() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔍 Testing different approaches to bypass authentication...\n');
  
  // Test 1: Try with different User-Agent
  console.log('1️⃣ Testing with browser User-Agent...');
  try {
    const test1 = await makeRequest(`${baseUrl}/api/health`, 'GET', null, {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    console.log(`Status: ${test1.statusCode}`);
    console.log('Response preview:', test1.data.substring(0, 100));
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 2: Try with Accept header
  console.log('2️⃣ Testing with Accept header...');
  try {
    const test2 = await makeRequest(`${baseUrl}/api/health`, 'GET', null, {
      'Accept': 'application/json, text/plain, */*'
    });
    console.log(`Status: ${test2.statusCode}`);
    console.log('Response preview:', test2.data.substring(0, 100));
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 3: Try direct IP access (if available)
  console.log('3️⃣ Testing if it\'s a DNS/routing issue...');
  try {
    const test3 = await makeRequest(`${baseUrl}/api/health`, 'GET', null, {
      'Host': 'coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app'
    });
    console.log(`Status: ${test3.statusCode}`);
    console.log('Response preview:', test3.data.substring(0, 100));
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 If all tests still return 401, the authentication is definitely enabled in Vercel');
  console.log('💡 You need to disable it in your Vercel team/project settings');
}

testBypassAuth().catch(console.error); 