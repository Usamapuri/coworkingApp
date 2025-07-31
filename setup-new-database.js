// Setup New Database - Complete Schema and Sample Data
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

// Updated with your new Supabase connection string
const DATABASE_URL = process.env.POSTGRES_URL || 'postgres://postgres.awsqtnvjrdntwgnevqoz:1pmrws0fbIJr2tUV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x';

const sql = neon(DATABASE_URL);

async function setupDatabase() {
  console.log('🔧 Setting up new CalmKaaj database...\n');
  
  try {
    // Test connection
    console.log('📋 Step 1: Testing database connection...');
    const testResult = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log(`🕐 Server time: ${testResult[0].current_time}\n`);
    
    // Create enums
    console.log('📋 Step 2: Creating enums...');
    await sql`
      CREATE TYPE IF NOT EXISTS user_role AS ENUM (
        'member_individual', 
        'member_organization', 
        'member_organization_admin', 
        'cafe_manager', 
        'calmkaaj_admin'
      );
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS billing_type AS ENUM ('personal', 'organization');
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS order_status AS ENUM (
        'pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'
      );
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS booking_status AS ENUM ('confirmed', 'cancelled', 'completed');
    `;
    
    await sql`
      CREATE TYPE IF NOT EXISTS site AS ENUM ('blue_area', 'i_10');
    `;
    
    console.log('✅ Enums created successfully!\n');
    
    // Create tables
    console.log('📋 Step 3: Creating tables...');
    
    // Organizations table
    await sql`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        site site NOT NULL DEFAULT 'blue_area',
        start_date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        role user_role NOT NULL,
        organization_id UUID REFERENCES organizations(id),
        site site NOT NULL DEFAULT 'blue_area',
        credits INTEGER DEFAULT 30,
        used_credits INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        can_charge_cafe_to_org BOOLEAN DEFAULT false,
        can_charge_room_to_org BOOLEAN DEFAULT true,
        start_date TIMESTAMP DEFAULT NOW(),
        bio TEXT,
        linkedin_url TEXT,
        profile_image TEXT,
        job_title TEXT,
        company TEXT,
        community_visible BOOLEAN DEFAULT true,
        email_visible BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Menu categories table
    await sql`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        site site NOT NULL DEFAULT 'blue_area'
      );
    `;
    
    // Menu items table
    await sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INTEGER REFERENCES menu_categories(id),
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        is_daily_special BOOLEAN DEFAULT false,
        site site NOT NULL DEFAULT 'blue_area',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Cafe orders table
    await sql`
      CREATE TABLE IF NOT EXISTS cafe_orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status order_status DEFAULT 'pending',
        billed_to billing_type DEFAULT 'personal',
        org_id UUID REFERENCES organizations(id),
        handled_by INTEGER REFERENCES users(id),
        created_by INTEGER REFERENCES users(id),
        payment_status TEXT DEFAULT 'unpaid',
        payment_updated_by INTEGER REFERENCES users(id),
        payment_updated_at TIMESTAMP,
        notes TEXT,
        delivery_location TEXT,
        site site NOT NULL DEFAULT 'blue_area',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Cafe order items table
    await sql`
      CREATE TABLE IF NOT EXISTS cafe_order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES cafe_orders(id) NOT NULL,
        menu_item_id INTEGER REFERENCES menu_items(id) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        special_instructions TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Meeting rooms table
    await sql`
      CREATE TABLE IF NOT EXISTS meeting_rooms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        capacity INTEGER NOT NULL,
        hourly_rate DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        site site NOT NULL DEFAULT 'blue_area',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Meeting bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS meeting_bookings (
        id SERIAL PRIMARY KEY,
        room_id INTEGER REFERENCES meeting_rooms(id) NOT NULL,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status booking_status DEFAULT 'confirmed',
        total_cost DECIMAL(10,2) NOT NULL,
        billed_to billing_type DEFAULT 'personal',
        org_id UUID REFERENCES organizations(id),
        notes TEXT,
        site site NOT NULL DEFAULT 'blue_area',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Announcements table
    await sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        priority INTEGER DEFAULT 0,
        site site NOT NULL DEFAULT 'blue_area',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    console.log('✅ All tables created successfully!\n');
    
    // Insert sample data
    console.log('📋 Step 4: Inserting sample data...');
    
    // Create sample organization
    const [org] = await sql`
      INSERT INTO organizations (name, email, phone, address, site)
      VALUES ('CalmKaaj HQ', 'admin@calmkaaj.com', '+1234567890', '123 Main St, Blue Area', 'blue_area')
      RETURNING id;
    `;
    console.log('✅ Sample organization created');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [adminUser] = await sql`
      INSERT INTO users (email, password, first_name, last_name, role, organization_id, site)
      VALUES ('admin@calmkaaj.com', ${hashedPassword}, 'Admin', 'User', 'calmkaaj_admin', ${org.id}, 'blue_area')
      RETURNING id;
    `;
    console.log('✅ Admin user created (admin@calmkaaj.com / admin123)');
    
    // Create sample menu categories
    const categories = [
      { name: 'Coffee & Tea', description: 'Hot and cold beverages', display_order: 1 },
      { name: 'Snacks', description: 'Light snacks and treats', display_order: 2 },
      { name: 'Lunch', description: 'Main course meals', display_order: 3 }
    ];
    
    for (const category of categories) {
      await sql`
        INSERT INTO menu_categories (name, description, display_order)
        VALUES (${category.name}, ${category.description}, ${category.display_order});
      `;
    }
    console.log('✅ Sample menu categories created');
    
    // Create sample menu items
    const menuItems = [
      { name: 'Espresso', description: 'Single shot of espresso', price: 3.50, category: 'Coffee & Tea' },
      { name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 4.50, category: 'Coffee & Tea' },
      { name: 'Chocolate Chip Cookie', description: 'Fresh baked cookie', price: 2.50, category: 'Snacks' },
      { name: 'Chicken Sandwich', description: 'Grilled chicken with vegetables', price: 8.99, category: 'Lunch' }
    ];
    
    for (const item of menuItems) {
      await sql`
        INSERT INTO menu_items (name, description, price, category_id)
        SELECT ${item.name}, ${item.description}, ${item.price}, mc.id
        FROM menu_categories mc
        WHERE mc.name = ${item.category};
      `;
    }
    console.log('✅ Sample menu items created');
    
    // Create sample meeting rooms
    const rooms = [
      { name: 'Conference Room A', description: 'Large conference room with projector', capacity: 20, hourly_rate: 50.00 },
      { name: 'Meeting Room B', description: 'Medium meeting room', capacity: 8, hourly_rate: 30.00 },
      { name: 'Huddle Space', description: 'Small meeting space', capacity: 4, hourly_rate: 20.00 }
    ];
    
    for (const room of rooms) {
      await sql`
        INSERT INTO meeting_rooms (name, description, capacity, hourly_rate)
        VALUES (${room.name}, ${room.description}, ${room.capacity}, ${room.hourly_rate});
      `;
    }
    console.log('✅ Sample meeting rooms created');
    
    // Create sample announcement
    await sql`
      INSERT INTO announcements (title, content, author_id, priority)
      VALUES ('Welcome to CalmKaaj!', 'Welcome to our new coworking space. We hope you enjoy your time here!', ${adminUser.id}, 1);
    `;
    console.log('✅ Sample announcement created');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@calmkaaj.com');
    console.log('Password: admin123');
    
    console.log('\n📊 Database Summary:');
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const orgCount = await sql`SELECT COUNT(*) as count FROM organizations`;
    const menuCount = await sql`SELECT COUNT(*) as count FROM menu_items`;
    const roomCount = await sql`SELECT COUNT(*) as count FROM meeting_rooms`;
    
    console.log(`- Users: ${userCount[0].count}`);
    console.log(`- Organizations: ${orgCount[0].count}`);
    console.log(`- Menu Items: ${menuCount[0].count}`);
    console.log(`- Meeting Rooms: ${roomCount[0].count}`);
    
    console.log('\n🔗 Next Steps:');
    console.log('1. Update your Vercel POSTGRES_URL with the new connection string');
    console.log('2. Redeploy your application');
    console.log('3. Test the login with admin@calmkaaj.com / admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the setup
setupDatabase().catch(console.error); 