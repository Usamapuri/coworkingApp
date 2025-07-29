// Test registration endpoint
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

async function testRegistration() {
  const baseUrl = 'https://coworking-app-ywpo-qwu91dk8e-usamapuri98-2762s-projects.vercel.app';
  
  console.log('🔧 Testing registration endpoint...\n');
  
  const testUser = {
    email: 'testuser2@calmkaaj.com',
    password: 'testpassword123',
    first_name: 'Test',
    last_name: 'User',
    role: 'user',
    site: 'blue_area'
  };
  
  try {
    console.log('📝 Attempting registration...');
    console.log('User data:', JSON.stringify(testUser, null, 2));
    
    const register = await makeRequest(`${baseUrl}/api/auth/register`, 'POST', testUser);
    
    console.log(`\nStatus: ${register.statusCode}`);
    console.log('Response:', JSON.stringify(register.data, null, 2));
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testRegistration().catch(console.error); 