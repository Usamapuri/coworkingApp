import fetch from 'node-fetch';

async function testFrontendFlow() {
  const BASE_URL = 'https://coworkingapp-production.up.railway.app';
  let cookies = null;
  
  console.log('🔍 Testing frontend flow...\n');
  
  // Helper function to make authenticated requests
  async function makeRequest(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(cookies ? { 'Cookie': cookies } : {})
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`📡 ${options.method || 'GET'} ${endpoint} - Status: ${response.status} ${response.statusText}`);
    
    if (response.headers.get('set-cookie')) {
      cookies = response.headers.get('set-cookie');
      console.log('🍪 Received cookies:', cookies);
    }
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${response.status} ${response.statusText}\n${text}`);
    }
    
    return response.json();
  }
  
  try {
    // Step 1: Login
    console.log('🔐 Step 1: Login...');
    const loginData = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@calmkaaj.com',
        password: 'admin123'
      })
    });
    console.log('✅ Login successful:', loginData);
    
    // Step 2: Get menu items
    console.log('\n📋 Step 2: Get menu items...');
    const menuItems = await makeRequest('/api/menu/items');
    console.log(`✅ Found ${menuItems.length} menu items`);
    if (menuItems.length > 0) {
      console.log('Sample menu item:', menuItems[0]);
    }
    
    // Step 3: Get meeting rooms
    console.log('\n🏢 Step 3: Get meeting rooms...');
    const rooms = await makeRequest('/api/rooms');
    console.log(`✅ Found ${rooms.length} rooms`);
    if (rooms.length > 0) {
      console.log('Sample room:', rooms[0]);
    }
    
    // Step 4: Get available rooms
    console.log('\n🔍 Step 4: Get available rooms...');
    const availableRooms = await makeRequest('/api/rooms/available');
    console.log(`✅ Found ${availableRooms.length} available rooms`);
    if (availableRooms.length > 0) {
      console.log('Sample available room:', availableRooms[0]);
    }
    
    // Step 5: Get my bookings
    console.log('\n📅 Step 5: Get my bookings...');
    const bookings = await makeRequest('/api/bookings');
    console.log(`✅ Found ${bookings.length} bookings`);
    if (bookings.length > 0) {
      console.log('Sample booking:', bookings[0]);
    }
    
    // Step 6: Get my orders
    console.log('\n🛒 Step 6: Get my orders...');
    const orders = await makeRequest('/api/cafe/orders');
    console.log(`✅ Found ${orders.length} orders`);
    if (orders.length > 0) {
      console.log('Sample order:', orders[0]);
    }
    
    console.log('\n🎉 All frontend flows tested successfully!');
    
  } catch (error) {
    console.error('\n❌ Error during frontend flow test:', error.message);
  }
}

testFrontendFlow();