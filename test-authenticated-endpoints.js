import fetch from 'node-fetch';

const BASE_URL = 'https://coworkingapp-production.up.railway.app';

async function testAuthenticatedEndpoints() {
  console.log('🔍 Testing Authenticated Endpoints...\n');

  try {
    // Step 1: Login to get session
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@calmkaaj.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginResponse.status, loginResponse.statusText);
      const errorData = await loginResponse.json();
      console.error('Error details:', errorData);
      return;
    }

    // Get cookies from login response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('✅ Login successful');
    console.log('🍪 Cookies received:', cookies ? 'Yes' : 'No');

    // Step 2: Test authenticated endpoints with cookies
    const headers = {
      'Cookie': cookies || ''
    };

    console.log('\n2️⃣ Testing menu items with authentication:');
    const menuResponse = await fetch(`${BASE_URL}/api/menu/items`, { headers });
    const menuData = await menuResponse.json();
    console.log('Menu items response:', menuData);

    console.log('\n3️⃣ Testing meeting rooms with authentication:');
    const roomsResponse = await fetch(`${BASE_URL}/api/rooms`, { headers });
    const roomsData = await roomsResponse.json();
    console.log('Meeting rooms response:', roomsData);

    console.log('\n4️⃣ Testing available rooms with authentication:');
    const availableRoomsResponse = await fetch(`${BASE_URL}/api/rooms/available`, { headers });
    const availableRoomsData = await availableRoomsResponse.json();
    console.log('Available rooms response:', availableRoomsData);

    console.log('\n5️⃣ Testing menu categories with authentication:');
    const categoriesResponse = await fetch(`${BASE_URL}/api/menu/categories`, { headers });
    const categoriesData = await categoriesResponse.json();
    console.log('Menu categories response:', categoriesData);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAuthenticatedEndpoints(); 