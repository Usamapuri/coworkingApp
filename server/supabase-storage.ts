import { createClient } from '@supabase/supabase-js';
import * as schema from "../shared/schema.js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface IStorage {
  // Users
  getUserById(id: number): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  updateUser(id: number, updates: Partial<schema.User>): Promise<schema.User>;
  deleteUser(id: number): Promise<void>;
  
  // Organizations
  getOrganizations(site?: string): Promise<schema.Organization[]>;
  getOrganizationById(id: string): Promise<schema.Organization | undefined>;
  createOrganization(org: schema.InsertOrganization): Promise<schema.Organization>;
  updateOrganization(id: string, updates: Partial<schema.Organization>): Promise<schema.Organization>;
  deleteOrganization(id: string): Promise<void>;
  
  // Menu
  getMenuCategories(site?: string): Promise<schema.MenuCategory[]>;
  getMenuItems(site?: string): Promise<schema.MenuItem[]>;
  getAllMenuItems(site?: string): Promise<schema.MenuItem[]>;
  getMenuItemById(id: number): Promise<schema.MenuItem | undefined>;
  createMenuItem(item: schema.InsertMenuItem): Promise<schema.MenuItem>;
  updateMenuItem(id: number, updates: Partial<schema.MenuItem>): Promise<schema.MenuItem>;
  
  // Cafe Orders
  createCafeOrder(order: schema.InsertCafeOrder): Promise<schema.CafeOrder>;
  createCafeOrderItem(item: schema.InsertCafeOrderItem): Promise<schema.CafeOrderItem>;
  getCafeOrders(userId?: number, orgId?: string, site?: string): Promise<any[]>;
  getCafeOrderById(id: number): Promise<any>;
  updateCafeOrderStatus(id: number, status: string, handledBy?: number): Promise<schema.CafeOrder>;
  updateCafeOrderPaymentStatus(id: number, paymentStatus: string, updatedBy: number): Promise<schema.CafeOrder>;
  createCafeOrderOnBehalf(order: schema.InsertCafeOrder, items: schema.InsertCafeOrderItem[], createdBy: number): Promise<any>;
  
  // Meeting Rooms
  getMeetingRooms(site?: string): Promise<schema.MeetingRoom[]>;
  getMeetingRoomById(id: number): Promise<schema.MeetingRoom | undefined>;
  createMeetingRoom(room: schema.InsertMeetingRoom): Promise<schema.MeetingRoom>;
  updateMeetingRoom(id: number, updates: Partial<schema.MeetingRoom>): Promise<schema.MeetingRoom>;
  
  // Meeting Bookings
  createMeetingBooking(booking: schema.InsertMeetingBooking): Promise<schema.MeetingBooking>;
  getMeetingBookings(userId?: number, orgId?: string, site?: string): Promise<any[]>;
  getMeetingBookingById(id: number): Promise<any>;
  updateMeetingBookingStatus(id: number, status: string): Promise<schema.MeetingBooking>;
  checkRoomAvailability(roomId: number, startTime: Date, endTime: Date): Promise<boolean>;
  
  // Announcements
  getAnnouncements(site?: string): Promise<schema.Announcement[]>;
  createAnnouncement(announcement: schema.InsertAnnouncement): Promise<schema.Announcement>;
  updateAnnouncement(id: number, updates: Partial<schema.Announcement>): Promise<schema.Announcement>;
  deleteAnnouncement(id: number): Promise<void>;
  
  // Organization Management
  getOrganizationEmployees(orgId: string): Promise<schema.User[]>;
  updateEmployeePermissions(userId: number, permissions: { can_charge_cafe_to_org?: boolean; can_charge_room_to_org?: boolean }): Promise<schema.User>;
}

export class SupabaseStorage implements IStorage {
  async getUserById(id: number): Promise<schema.User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return undefined;
    
    // Map password_hash to password for compatibility with schema
    return {
      ...data,
      password: data.password_hash
    };
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    if (!data) return undefined;
    
    // Map password_hash to password for compatibility with schema
    return {
      ...data,
      password: data.password_hash
    };
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: number, updates: Partial<schema.User>): Promise<schema.User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteUser(id: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async getOrganizations(site?: string): Promise<schema.Organization[]> {
    let query = supabase.from('organizations').select('*');
    
    if (site && site !== 'all') {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getOrganizationById(id: string): Promise<schema.Organization | undefined> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data || undefined;
  }

  async createOrganization(org: schema.InsertOrganization): Promise<schema.Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert(org)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOrganization(id: string, updates: Partial<schema.Organization>): Promise<schema.Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteOrganization(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async getMenuCategories(site?: string): Promise<schema.MenuCategory[]> {
    let query = supabase
      .from('menu_categories')
      .select('*')
      .eq('is_active', true);
    
    if (site && site !== 'all') {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getMenuItems(site?: string): Promise<schema.MenuItem[]> {
    console.log('🔍 Fetching menu items...');
    console.log('Site:', site);
    
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true);
    
    if (site) {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('❌ Error fetching menu items:', error);
      throw error;
    }
    
    console.log(`✅ Found ${data?.length || 0} menu items`);
    if (data?.length > 0) {
      console.log('📋 Sample item:', data[0]);
    }
    
    return data || [];
  }

  async getAllMenuItems(site?: string): Promise<schema.MenuItem[]> {
    let query = supabase.from('menu_items').select('*');
    
    if (site) {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getMenuItemById(id: number): Promise<schema.MenuItem | undefined> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data || undefined;
  }

  async createMenuItem(item: schema.InsertMenuItem): Promise<schema.MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMenuItem(id: number, updates: Partial<schema.MenuItem>): Promise<schema.MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteMenuItem(id: number): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async createCafeOrder(order: schema.InsertCafeOrder): Promise<schema.CafeOrder> {
    const { data, error } = await supabase
      .from('cafe_orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async createCafeOrderItem(item: schema.InsertCafeOrderItem): Promise<schema.CafeOrderItem> {
    const { data, error } = await supabase
      .from('cafe_order_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCafeOrders(userId?: number, orgId?: string, site?: string): Promise<any[]> {
    let query = supabase
      .from('cafe_orders')
      .select(`
        *,
        users!cafe_orders_user_id_fkey(id, first_name, last_name, email),
        organizations!cafe_orders_org_id_fkey(id, name)
      `);
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (orgId) {
      query = query.eq('org_id', orgId);
    } else if (site && site !== 'all') {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getCafeOrderById(id: number): Promise<any> {
    const { data, error } = await supabase
      .from('cafe_orders')
      .select(`
        *,
        users!cafe_orders_user_id_fkey(id, first_name, last_name, email),
        organizations!cafe_orders_org_id_fkey(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCafeOrderStatus(id: number, status: string, handledBy?: number): Promise<schema.CafeOrder> {
    const updates: any = { status, updated_at: new Date() };
    if (handledBy) updates.handled_by = handledBy;
    
    const { data, error } = await supabase
      .from('cafe_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCafeOrderPaymentStatus(id: number, paymentStatus: string, updatedBy: number): Promise<schema.CafeOrder> {
    const { data, error } = await supabase
      .from('cafe_orders')
      .update({
        payment_status: paymentStatus,
        payment_updated_by: updatedBy,
        payment_updated_at: new Date(),
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async createCafeOrderOnBehalf(order: schema.InsertCafeOrder, items: schema.InsertCafeOrderItem[], createdBy: number): Promise<any> {
    // Create order with created_by field
    const { data: newOrder, error: orderError } = await supabase
      .from('cafe_orders')
      .insert({
        ...order,
        created_by: createdBy
      })
      .select()
      .single();
    
    if (orderError) throw orderError;

    // Create order items
    const orderItems = [];
    for (const item of items) {
      const { data: orderItem, error: itemError } = await supabase
        .from('cafe_order_items')
        .insert({
          ...item,
          order_id: newOrder.id
        })
        .select()
        .single();
      
      if (itemError) throw itemError;
      orderItems.push(orderItem);
    }

    // Return the complete order with items and user details
    return this.getCafeOrderById(newOrder.id);
  }

  async getMeetingRooms(site?: string): Promise<schema.MeetingRoom[]> {
    console.log('🔍 Fetching meeting rooms...');
    console.log('Site:', site);
    
    let query = supabase
      .from('meeting_rooms')
      .select('*')
      .eq('is_active', true);
    
    if (site) {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('❌ Error fetching meeting rooms:', error);
      throw error;
    }
    
    console.log(`✅ Found ${data?.length || 0} meeting rooms`);
    if (data?.length > 0) {
      console.log('🏢 Sample room:', data[0]);
    }
    
    return data || [];
  }

  async getMeetingRoomById(id: number): Promise<schema.MeetingRoom | undefined> {
    const { data, error } = await supabase
      .from('meeting_rooms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data || undefined;
  }

  async createMeetingRoom(room: schema.InsertMeetingRoom): Promise<schema.MeetingRoom> {
    const { data, error } = await supabase
      .from('meeting_rooms')
      .insert(room)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMeetingRoom(id: number, updates: Partial<schema.MeetingRoom>): Promise<schema.MeetingRoom> {
    const { data, error } = await supabase
      .from('meeting_rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async createMeetingBooking(booking: schema.InsertMeetingBooking): Promise<schema.MeetingBooking> {
    const { data, error } = await supabase
      .from('meeting_bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getMeetingBookings(userId?: number, orgId?: string, site?: string): Promise<any[]> {
    let query = supabase
      .from('meeting_bookings')
      .select(`
        *,
        users!meeting_bookings_user_id_fkey(id, first_name, last_name, email),
        meeting_rooms!meeting_bookings_room_id_fkey(id, name, capacity),
        organizations!meeting_bookings_org_id_fkey(id, name)
      `);
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (orgId) {
      query = query.eq('org_id', orgId);
    } else if (site && site !== 'all') {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getMeetingBookingById(id: number): Promise<any> {
    const { data, error } = await supabase
      .from('meeting_bookings')
      .select(`
        *,
        users!meeting_bookings_user_id_fkey(id, first_name, last_name, email),
        meeting_rooms!meeting_bookings_room_id_fkey(id, name, capacity),
        organizations!meeting_bookings_org_id_fkey(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMeetingBookingStatus(id: number, status: string): Promise<schema.MeetingBooking> {
    const { data, error } = await supabase
      .from('meeting_bookings')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async checkRoomAvailability(roomId: number, startTime: Date, endTime: Date): Promise<boolean> {
    const { data, error } = await supabase
      .from('meeting_bookings')
      .select('*')
      .eq('room_id', roomId)
      .eq('status', 'confirmed')
      .lt('start_time', endTime)
      .gt('end_time', startTime)
      .limit(1);
    
    if (error) throw error;
    return !data || data.length === 0;
  }

  async getAnnouncements(site?: string): Promise<schema.Announcement[]> {
    let query = supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true);
    
    if (site) {
      query = query.eq('site', site);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createAnnouncement(announcement: schema.InsertAnnouncement): Promise<schema.Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAnnouncement(id: number, updates: Partial<schema.Announcement>): Promise<schema.Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async getOrganizationEmployees(orgId: string): Promise<schema.User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', orgId);
    
    if (error) throw error;
    return data || [];
  }

  async updateEmployeePermissions(userId: number, permissions: { can_charge_cafe_to_org?: boolean; can_charge_room_to_org?: boolean }): Promise<schema.User> {
    const { data, error } = await supabase
      .from('users')
      .update(permissions)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const storage = new SupabaseStorage(); 