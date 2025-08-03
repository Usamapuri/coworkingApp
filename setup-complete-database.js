import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCompleteDatabase() {
  console.log('🔄 Setting up complete database with all schema and data...');
  
  try {
    // First, let's check what's currently in the database
    console.log('\n🔍 Checking current database state...');
    const tables = [
      'users',
      'organizations', 
      'menu_categories',
      'menu_items',
      'meeting_rooms',
      'meeting_bookings',
      'cafe_orders',
      'cafe_order_items',
      'announcements'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error checking ${table}: ${error.message}`);
      } else {
        console.log(`📊 ${table}: ${data?.length || 0} records`);
      }
    }

    // Now let's import the complete data from the migration file
    console.log('\n📥 Importing complete data from migration file...');
    
    // Import users from the migration file
    console.log('👥 Importing users...');
    const usersData = [
      {
        id: 1,
        email: 'admin@calmkaaj.com',
        password: '$2b$10$xET24htvRc.gIF/BisGUzuX/ocPVHP.zq/1wardMaEomQbW1lwXEi',
        first_name: 'CalmKaaj',
        last_name: 'Team',
        role: 'calmkaaj_admin',
        site: 'blue_area',
        credits: 100,
        used_credits: 0,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true
      },
      {
        id: 2,
        email: 'manager@calmkaaj.com',
        password: '$2b$10$JXv2QcZ8rR4T7IC6oBxEY.fwB7hstHvfGIGtt5yi4yG2/8KZslZVq',
        first_name: 'Cafe',
        last_name: 'Manager',
        role: 'cafe_manager',
        site: 'blue_area',
        credits: 50,
        used_credits: 10,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true
      },
      {
        id: 36,
        email: 'shayan.qureshi@calmkaaj.org',
        password: '$2b$10$FaXdODOJzwg4YIYs8FiW4OogdiwF8qOM0Uiq3mAXjjMdSPpFnjbBW',
        first_name: 'Shayan',
        last_name: 'Qureshi',
        role: 'calmkaaj_admin',
        site: 'blue_area',
        credits: 420,
        used_credits: 0,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true,
        bio: 'Hi',
        linkedin_url: 'https://www.linkedin.com/in/shayan-qureshi-207b17220/',
        profile_image: 'https://media.licdn.com/dms/image/v2/D4D03AQGnQeD3MGoLjA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724178091705?e=1757548800&v=beta&t=BgUwTjrVTLGfpN-SUOUKTI9V_5DEtVt51uDjBuy0pNQ',
        job_title: 'Chief Growth Officer',
        company: 'CalmKaaj'
      },
      {
        id: 37,
        email: 'zeb.ayaz@calmkaaj.org',
        password: '$2b$10$TPQE3Gspqc6Zh0XFWlytueHLi/tByEvfgk43fAY1.4hEuAvtX99lS',
        first_name: 'Zeb',
        last_name: 'Ayaz',
        role: 'calmkaaj_admin',
        site: 'blue_area',
        credits: 10,
        used_credits: 0,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true,
        linkedin_url: 'https://www.linkedin.com/in/zeb-ayaz-4199b611/',
        job_title: 'Chief Executive Officer',
        company: 'CalmKaaj'
      },
      {
        id: 38,
        email: 'haider.nadeem@calmkaaj.org',
        password: '$2b$10$nj76Dy/agviu7LhUlrfO9O9N1ek7I0xR/Iq9g48VS4QDUIgvlKxNm',
        first_name: 'Haider',
        last_name: 'Nadeem',
        role: 'calmkaaj_admin',
        site: 'blue_area',
        credits: 10,
        used_credits: 0,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true,
        linkedin_url: 'https://www.linkedin.com/in/haider-nadeem-tarar-837847153/'
      },
      {
        id: 39,
        email: 'sana.pirzada@calmkaaj.org',
        password: '$2b$10$mYv44oce6B0B.3zjoZTF2ulTWPXeS/ajkmg3ehPLl6LbXwVm.H5Ga',
        first_name: 'Sana',
        last_name: '',
        role: 'calmkaaj_admin',
        site: 'blue_area',
        credits: 10,
        used_credits: 0,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true,
        linkedin_url: 'https://www.linkedin.com/in/sana-pirzada-81064b264/'
      },
      {
        id: 40,
        email: 'hadia.maryam@calmkaaj.org',
        password: '$2b$10$X5hUZlFBrzZx0kigsXAtAuyaC13kdwVVhlsP2FDo81G4nRpsDYKTy',
        first_name: 'Hadia',
        last_name: '',
        role: 'calmkaaj_admin',
        site: 'blue_area',
        credits: 10,
        used_credits: 13,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true
      },
      {
        id: 41,
        email: 'member@xyz.com',
        password: '$2b$10$Lj.5l/hSHkwm8bNk0CISGuEjYPPagWGEm1A0D16W9WRqSLQCwcILm',
        first_name: 'Member',
        last_name: '',
        role: 'member_individual',
        site: 'blue_area',
        credits: 15,
        used_credits: 8,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true
      },
      {
        id: 42,
        email: 'sameer@faazil.com',
        password: '$2b$10$sWBO.qI6cYeCyWoZiwf8zOmFYEno/6VoB1P0BSpURkeK1EL/lztTi',
        first_name: 'Sameer',
        last_name: 'Shahid',
        role: 'member_individual',
        site: 'blue_area',
        credits: 10,
        used_credits: 0,
        is_active: true,
        can_charge_cafe_to_org: false,
        can_charge_room_to_org: true,
        bio: 'Hey there :)',
        linkedin_url: 'https://www.linkedin.com/in/syedsameershahid/',
        profile_image: '/uploads/profile-1752135313483-353790749.jpeg',
        company: 'Arteryal'
      }
    ];

    // Clear existing users and insert new ones
    await supabase.from('users').delete().neq('id', 0);
    
    for (const user of usersData) {
      const { error } = await supabase.from('users').insert(user);
      if (error) {
        console.log(`⚠️ Warning inserting user ${user.email}: ${error.message}`);
      }
    }
    console.log('✅ Users imported');

    // Import menu categories
    console.log('📋 Importing menu categories...');
    const categoriesData = [
      { id: 1, name: 'Beverages', description: 'Hot and cold drinks', display_order: 0, is_active: true, site: 'blue_area' },
      { id: 2, name: 'Snacks', description: 'Light bites and snacks', display_order: 0, is_active: true, site: 'blue_area' },
      { id: 3, name: 'Meals', description: 'Full meals and lunch items', display_order: 0, is_active: true, site: 'blue_area' },
      { id: 4, name: 'Beverages', description: 'Hot and cold drinks', display_order: 1, is_active: true, site: 'blue_area' },
      { id: 5, name: 'Snacks', description: 'Light snacks and appetizers', display_order: 2, is_active: true, site: 'blue_area' },
      { id: 6, name: 'Meals', description: 'Full meals and main dishes', display_order: 3, is_active: true, site: 'blue_area' },
      { id: 7, name: 'Desserts', description: 'Sweet treats and desserts', display_order: 4, is_active: true, site: 'blue_area' },
      { id: 8, name: 'Coffee & Tea', description: 'Premium coffee and tea selection', display_order: 1, is_active: true, site: 'i_10' },
      { id: 9, name: 'Light Bites', description: 'Quick snacks and finger foods', display_order: 2, is_active: true, site: 'i_10' },
      { id: 10, name: 'Lunch Items', description: 'Hearty lunch options', display_order: 3, is_active: true, site: 'i_10' },
      { id: 11, name: 'Sweets', description: 'Cakes and sweet treats', display_order: 4, is_active: true, site: 'i_10' }
    ];

    await supabase.from('menu_categories').delete().neq('id', 0);
    
    for (const category of categoriesData) {
      const { error } = await supabase.from('menu_categories').insert(category);
      if (error) {
        console.log(`⚠️ Warning inserting category ${category.name}: ${error.message}`);
      }
    }
    console.log('✅ Menu categories imported');

    // Import menu items (simplified version with key items)
    console.log('🍽️ Importing menu items...');
    const menuItemsData = [
      { id: 1, name: 'Cappuccino', description: 'Freshly brewed cappuccino', price: 4.50, category_id: 1, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 2, name: 'Green Tea', description: 'Organic green tea', price: 3.00, category_id: 1, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 3, name: 'Chicken Sandwich', description: 'Grilled chicken sandwich with fresh vegetables', price: 8.50, category_id: 3, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 4, name: 'Fruit Salad', description: 'Fresh seasonal fruit salad', price: 6.00, category_id: 2, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 5, name: 'Espresso', description: 'Double shot espresso', price: 3.50, category_id: 1, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 6, name: 'Lays Slated', description: 'Chips that are nice', price: 200.00, category_id: null, is_available: true, is_daily_special: false, site: 'blue_area', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL0ZK7PMdf3ICXdTHJSEONglKrHabpBGrzsw&s' },
      { id: 7, name: 'LATTE', description: 'FEAFEW', price: 55000.00, category_id: null, is_available: true, is_daily_special: false, site: 'blue_area', image_url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/0e/ec/2f/outdoor-sitting-area.jpg?w=600&h=400&s=1' },
      { id: 8, name: 'Cappuccino', description: 'Rich espresso with steamed milk', price: 250.00, category_id: 1, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 9, name: 'Latte', description: 'Smooth espresso with steamed milk', price: 280.00, category_id: 1, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 10, name: 'Green Tea', description: 'Organic green tea', price: 150.00, category_id: 1, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 11, name: 'Chicken Sandwich', description: 'Grilled chicken with fresh vegetables', price: 450.00, category_id: 2, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 12, name: 'Apple tart', description: 'Fresh seasonal fruit salad', price: 500.00, category_id: 2, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 13, name: 'Samosa', description: 'Crispy vegetable samosa', price: 80.00, category_id: 2, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 14, name: 'Apple tart', description: 'Sweet', price: 500.00, category_id: 2, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 15, name: 'Pasta', description: 'Creamy chicken alfredo pasta', price: 550.00, category_id: 3, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 16, name: 'Chocolate Cake', description: 'Rich chocolate cake slice', price: 350.00, category_id: 4, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 17, name: 'Ice Cream', description: 'Vanilla ice cream scoop', price: 150.00, category_id: 4, is_available: true, is_daily_special: false, site: 'blue_area' },
      { id: 18, name: 'Espresso', description: 'Strong Italian espresso', price: 200.00, category_id: 5, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 19, name: 'Chai Latte', description: 'Spiced chai with steamed milk', price: 220.00, category_id: 5, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 20, name: 'Cold Brew', description: 'Smooth cold brew coffee', price: 280.00, category_id: 5, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 21, name: 'Club Sandwich', description: 'Triple layer club sandwich', price: 480.00, category_id: 6, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 22, name: 'Wrap', description: 'Chicken caesar wrap', price: 350.00, category_id: 6, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 23, name: 'Nachos', description: 'Loaded nachos with cheese', price: 400.00, category_id: 6, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 24, name: 'Karahi', description: 'Chicken karahi with naan', price: 750.00, category_id: 7, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 25, name: 'Burger', description: 'Beef burger with fries', price: 600.00, category_id: 7, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 26, name: 'Cheesecake', description: 'New York style cheesecake', price: 380.00, category_id: 8, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 27, name: 'Brownie', description: 'Fudgy chocolate brownie', price: 250.00, category_id: 8, is_available: true, is_daily_special: false, site: 'i_10' },
      { id: 28, name: 'DeezNuts', description: 'Fresh nuts', price: 60.00, category_id: null, is_available: true, is_daily_special: false, site: 'blue_area', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8H4SZ7hwlCGMx2ANIqWnL2VNAHLwcbPEZrg&s' },
      { id: 29, name: 'waffles', description: '', price: 700.00, category_id: null, is_available: true, is_daily_special: false, site: 'blue_area' }
    ];

    await supabase.from('menu_items').delete().neq('id', 0);
    
    for (const item of menuItemsData) {
      const { error } = await supabase.from('menu_items').insert(item);
      if (error) {
        console.log(`⚠️ Warning inserting menu item ${item.name}: ${error.message}`);
      }
    }
    console.log('✅ Menu items imported');

    // Import meeting rooms
    console.log('🏢 Importing meeting rooms...');
    const roomsData = [
      { id: 1, name: 'Conference Room A', description: 'Large conference room with projector', capacity: 12, credit_cost_per_hour: 5, amenities: ['Projector', 'Whiteboard', 'WiFi'], is_available: true, site: 'blue_area' },
      { id: 2, name: 'Meeting Room B', description: 'Small meeting room for team discussions', capacity: 6, credit_cost_per_hour: 3, amenities: ['Whiteboard', 'WiFi'], is_available: true, site: 'blue_area' },
      { id: 3, name: 'Executive Suite', description: 'Premium meeting space', capacity: 8, credit_cost_per_hour: 8, amenities: ['Projector', 'Whiteboard', 'WiFi', 'Coffee Machine'], is_available: true, site: 'i_10' }
    ];

    await supabase.from('meeting_rooms').delete().neq('id', 0);
    
    for (const room of roomsData) {
      const { error } = await supabase.from('meeting_rooms').insert(room);
      if (error) {
        console.log(`⚠️ Warning inserting room ${room.name}: ${error.message}`);
      }
    }
    console.log('✅ Meeting rooms imported');

    // Import announcements
    console.log('📢 Importing announcements...');
    const announcementsData = [
      { id: 1, title: 'Welcome to CalmKaaj', body: 'Welcome to your new coworking space! Enjoy our facilities and services.', is_active: true, site: 'blue_area', sites: ['blue_area'] },
      { id: 5, title: 'efwe', body: 'rgf3erogfj3refg3r', show_until: '2025-07-05 19:05:00', is_active: true, site: 'blue_area', sites: ['blue_area', 'i_10'] },
      { id: 6, title: 'WORLD BUILDING WASSSSSSSUP', body: 'HHFFWEFEWFWEF', image_url: 'https://t3.ftcdn.net/jpg/02/09/65/14/360_F_209651427_Moux8Hkey15wtMbtLymbPPrdrLhm58fH.jpg', show_until: '2025-07-06 11:00:00', is_active: true, site: 'blue_area', sites: ['blue_area', 'i_10'] },
      { id: 7, title: 'WASSSSUP', body: 'FRIENDS', image_url: 'https://cdn-icons-png.flaticon.com/512/6028/6028690.png', show_until: '2025-07-06 11:30:00', is_active: true, site: 'blue_area', sites: ['blue_area', 'i_10'] },
      { id: 8, title: 'HELLO WORLD', body: 'FRIENDS', image_url: 'https://cdn-icons-png.flaticon.com/512/6028/6028690.png', show_until: '2025-07-06 11:32:00', is_active: true, site: 'blue_area', sites: ['blue_area', 'i_10'] },
      { id: 9, title: 'HELLO', body: 'HELLO', image_url: 'https://cdn-icons-png.flaticon.com/512/6028/6028690.png', show_until: '2025-07-06 16:35:00', is_active: true, site: 'blue_area', sites: ['blue_area', 'i_10'] },
      { id: 10, title: 'WASSSUP GANG', body: 'WADQWDWQD', image_url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/0e/ec/2f/outdoor-sitting-area.jpg?w=600&h=400&s=1', show_until: '2025-07-07 19:57:00', is_active: true, site: 'blue_area', sites: ['i_10'] }
    ];

    await supabase.from('announcements').delete().neq('id', 0);
    
    for (const announcement of announcementsData) {
      const { error } = await supabase.from('announcements').insert(announcement);
      if (error) {
        console.log(`⚠️ Warning inserting announcement ${announcement.title}: ${error.message}`);
      }
    }
    console.log('✅ Announcements imported');

    // Final verification
    console.log('\n🔍 Final verification of imported data...');
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error checking ${table}: ${error.message}`);
      } else {
        console.log(`📊 ${table}: ${data?.length || 0} records`);
      }
    }

    console.log('\n🎉 Complete database setup finished!');
    console.log('\n🎯 Available login credentials:');
    console.log('👑 Admin: admin@calmkaaj.com (password: admin123)');
    console.log('👨‍💼 Manager: manager@calmkaaj.com (password: manager123)');
    console.log('👤 Member: member@xyz.com (password: member123)');

  } catch (error) {
    console.error('❌ Error during database setup:', error);
    throw error;
  }
}

setupCompleteDatabase()
  .then(() => {
    console.log('\n🎯 Database setup process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  }); 