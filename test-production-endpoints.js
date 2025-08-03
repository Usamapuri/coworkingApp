const BASE_URL = 'https://coworkingapp-production.up.railway.app';

async function testEndpoints() {
  console.log('🧪 Testing production endpoints...\n');
  
  try {
    // Test menu items endpoint
    console.log('📋 Testing /api/menu...');
    const menuResponse = await fetch(`${BASE_URL}/api/menu`);
    const menuData = await menuResponse.json();
    console.log(`✅ Menu items: ${menuData.length} items found`);
    if (menuData.length > 0) {
      console.log(`   Sample item: ${menuData[0].name} - $${menuData[0].price}`);
    }
    
    // Test meeting rooms endpoint
    console.log('\n🏢 Testing /api/rooms...');
    const roomsResponse = await fetch(`${BASE_URL}/api/rooms`);
    const roomsData = await roomsResponse.json();
    console.log(`✅ Meeting rooms: ${roomsData.length} rooms found`);
    if (roomsData.length > 0) {
      console.log(`   Sample room: ${roomsData[0].name} - $${roomsData[0].hourly_rate}/hour`);
    }
    
    // Test available rooms endpoint
    console.log('\n🔍 Testing /api/rooms/available...');
    const availableResponse = await fetch(`${BASE_URL}/api/rooms/available`);
    const availableData = await availableResponse.json();
    console.log(`✅ Available rooms: ${availableData.length} rooms available`);
    
    // Test health endpoint
    console.log('\n💚 Testing /api/health...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Health check: ${healthData.status}`);
    console.log(`   Database: ${healthData.database}`);
    console.log(`   Users: ${healthData.userCount}`);
    
    console.log('\n🎉 All endpoints are working!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

testEndpoints(); 