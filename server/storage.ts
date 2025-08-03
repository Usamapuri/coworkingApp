// ... (keep existing imports)

export class DatabaseStorage implements IStorage {
  // ... (keep existing methods)

  async getMeetingRooms(site?: string): Promise<schema.MeetingRoom[]> {
    console.log('🔍 Fetching meeting rooms...');
    console.log('Site:', site);
    
    let query = db.select().from(schema.meeting_rooms);
    
    if (site && site !== 'all') {
      query = query.where(and(
        eq(schema.meeting_rooms.is_active, true),
        eq(schema.meeting_rooms.site, site as any)
      ));
    } else {
      query = query.where(eq(schema.meeting_rooms.is_active, true));
    }

    const rooms = await query.orderBy(asc(schema.meeting_rooms.name));
    
    // Map database fields to expected schema
    const mappedRooms = rooms.map(room => ({
      ...room,
      is_available: room.is_active,
      credit_cost_per_hour: Math.ceil(room.hourly_rate / 100),
      amenities: ["Whiteboard", "TV Screen"] // Default amenities
    }));
    
    console.log('✅ Found', mappedRooms.length, 'meeting rooms');
    if (mappedRooms.length > 0) {
      console.log('🏢 Sample room:', mappedRooms[0]);
    }
    
    return mappedRooms;
  }

  async getMenuItems(site?: string): Promise<schema.MenuItem[]> {
    console.log('🔍 Fetching menu items...');
    console.log('Site:', site);
    
    let query = db.select().from(schema.menu_items);
    
    if (site && site !== 'all') {
      query = query.where(and(
        eq(schema.menu_items.is_active, true),
        eq(schema.menu_items.site, site as any)
      ));
    } else {
      query = query.where(eq(schema.menu_items.is_active, true));
    }

    const items = await query.orderBy(asc(schema.menu_items.name));
    
    // Map database fields to expected schema
    const mappedItems = items.map(item => ({
      ...item,
      is_available: item.is_active,
      price: item.price.toString()
    }));
    
    console.log('✅ Found', mappedItems.length, 'menu items');
    if (mappedItems.length > 0) {
      console.log('📋 Sample item:', mappedItems[0]);
    }
    
    return mappedItems;
  }

  async createCafeOrder(order: schema.InsertCafeOrder): Promise<schema.CafeOrder> {
    console.log('📝 Creating cafe order:', order);
    
    const [newOrder] = await db.insert(schema.cafe_orders).values({
      ...order,
      status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    
    console.log('✅ Created order:', newOrder);
    return newOrder;
  }

  async createCafeOrderItem(item: schema.InsertCafeOrderItem): Promise<schema.CafeOrderItem> {
    console.log('📝 Creating order item:', item);
    
    const [newItem] = await db.insert(schema.cafe_order_items).values({
      ...item,
      created_at: new Date()
    }).returning();
    
    console.log('✅ Created order item:', newItem);
    return newItem;
  }

  // ... (keep rest of the file)
}