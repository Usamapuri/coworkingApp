import fetch from 'node-fetch';

async function testApiEndpoints() {
  const BASE_URL = 'https://coworkingapp-production.up.railway.app';
  
  console.log('🔍 Testing API endpoints with authentication...\n');
  
  // First, login to get session cookie
  console.log('🔐 Attempting login...');
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      email: 'admin@calmkaaj.com',
      password: 'admin123'
    }),
    credentials: 'include',
    mode: 'cors'
  });
  
  if (!loginResponse.ok) {
    console.error('❌ Login failed:', loginResponse.status, loginResponse.statusText);
    const text = await loginResponse.text();
    console.error('Response:', text);
    return;
  }
  
  const cookies = loginResponse.headers.raw()['set-cookie'];
  console.log('✅ Login successful');
  console.log('🍪 Received cookies:', cookies);
  
  // Helper function to make authenticated requests
  async function makeAuthenticatedRequest(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Cookie': cookies?.join('; '),
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ Error making request to ${endpoint}:`, error.message);
      return null;
    }
  }
  
  // Test menu items endpoint
  console.log('\n📋 Testing /api/menu/items...');
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