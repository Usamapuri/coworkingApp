import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "./db.js";
import * as schema from "../shared/schema.js";

export class DatabaseStorage implements IStorage {
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
      amenities: ["Whiteboard", "TV Screen", "Air Conditioning", "High-Speed Internet"] // Default amenities
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

  async checkRoomAvailability(roomId: number, startTime: Date, endTime: Date): Promise<boolean> {
    console.log('🔍 Checking room availability:', { roomId, startTime, endTime });
    
    // Get all confirmed bookings for this room that overlap with the requested time
    const overlappingBookings = await db.select()
      .from(schema.meeting_bookings)
      .where(
        and(
          eq(schema.meeting_bookings.room_id, roomId),
          eq(schema.meeting_bookings.status, 'confirmed'),
          sql`
            (${schema.meeting_bookings.start_time} < ${endTime} AND 
             ${schema.meeting_bookings.end_time} > ${startTime})
          `
        )
      );
    
    const isAvailable = overlappingBookings.length === 0;
    console.log('✅ Room availability:', isAvailable);
    return isAvailable;
  }

  async getMeetingBookings(userId?: number, orgId?: string, site?: string): Promise<schema.MeetingBooking[]> {
    console.log('🔍 Fetching meeting bookings:', { userId, orgId, site });
    
    let query = db.select()
      .from(schema.meeting_bookings)
      .leftJoin(schema.meeting_rooms, eq(schema.meeting_bookings.room_id, schema.meeting_rooms.id))
      .leftJoin(schema.users, eq(schema.meeting_bookings.user_id, schema.users.id));
    
    if (userId) {
      query = query.where(eq(schema.meeting_bookings.user_id, userId));
    }
    
    if (orgId) {
      query = query.where(eq(schema.meeting_bookings.org_id, orgId));
    }
    
    if (site) {
      query = query.where(eq(schema.meeting_rooms.site, site as any));
    }
    
    const bookings = await query.orderBy(desc(schema.meeting_bookings.created_at));
    
    console.log('✅ Found', bookings.length, 'bookings');
    return bookings;
  }

  async createMeetingBooking(booking: schema.InsertMeetingBooking): Promise<schema.MeetingBooking> {
    console.log('📝 Creating meeting booking:', booking);
    
    const [newBooking] = await db.insert(schema.meeting_bookings).values({
      ...booking,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    
    console.log('✅ Created booking:', newBooking);
    return newBooking;
  }

  async updateMeetingBookingStatus(id: number, status: string): Promise<schema.MeetingBooking> {
    console.log('📝 Updating booking status:', { id, status });
    
    const [updatedBooking] = await db.update(schema.meeting_bookings)
      .set({ 
        status,
        updated_at: new Date()
      })
      .where(eq(schema.meeting_bookings.id, id))
      .returning();
    
    console.log('✅ Updated booking:', updatedBooking);
    return updatedBooking;
  }
}