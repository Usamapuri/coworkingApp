import fetch from 'node-fetch';

async function testApiEndpoints() {
  const BASE_URL = 'https://coworkingapp-production.up.railway.app';
  
  console.log('🔍 Testing API endpoints...\n');
  
  // Helper function to make authenticated requests
  async function makeAuthenticatedRequest(endpoint) {
    try {
      // First, login to get session cookie
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@calmkaaj.com',
          password: 'admin123'
        }),
        credentials: 'include'
      });
      
      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
      }
      
      const cookies = loginResponse.headers.raw()['set-cookie'];
      console.log('🔐 Login successful');
      console.log('🍪 Received cookies:', cookies);
      
      // Now make the authenticated request
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Cookie': cookies.join('; ')
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ Error making request to ${endpoint}:`, error.message);
      if (error.response) {
        console.error('Response:', await error.response.text());
      }
      return null;
    }
  }
  
  // Test menu items endpoint
  console.log('📋 Testing /api/menu/items...');
  const menuItems = await makeAuthenticatedRequest('/api/menu/items');
  if (menuItems) {
    console.log(`✅ Found ${menuItems.length} menu items`);
    if (menuItems.length > 0) {
      console.log('Sample menu item:', menuItems[0]);
    }
  }
  
  // Test meeting rooms endpoint
  console.log('\n🏢 Testing /api/rooms/available...');
  const rooms = await makeAuthenticatedRequest('/api/rooms/available');
  if (rooms) {
    console.log(`✅ Found ${rooms.length} available rooms`);
    if (rooms.length > 0) {
      console.log('Sample room:', rooms[0]);
    }
  }
}

testApiEndpoints();