// Map database user to frontend user
export function mapUser(dbUser: any) {
  return {
    ...dbUser,
    credits: 100, // Default credits
    used_credits: 0,
    is_active: true,
    can_charge_cafe_to_org: true,
    can_charge_room_to_org: true,
    role: dbUser.role === 'user' ? 'member_individual' : dbUser.role
  };
}

// Map database menu item to frontend menu item
export function mapMenuItem(dbItem: any) {
  return {
    ...dbItem,
    is_available: dbItem.is_active,
    price: dbItem.price.toString()
  };
}

// Map database room to frontend room
export function mapRoom(dbRoom: any) {
  return {
    ...dbRoom,
    is_available: dbRoom.is_active,
    credit_cost_per_hour: Math.ceil(dbRoom.hourly_rate / 100),
    amenities: ["Whiteboard", "TV Screen"] // Default amenities
  };
}

// Map database order to frontend order
export function mapOrder(dbOrder: any) {
  return {
    ...dbOrder,
    total_amount: dbOrder.total_amount.toString(),
    items: dbOrder.items?.map((item: any) => ({
      ...item,
      price: item.price.toString(),
      menu_item: {
        ...item.menu_item,
        is_available: item.menu_item.is_active,
        price: item.menu_item.price.toString()
      }
    }))
  };
}

// Map database booking to frontend booking
export function mapBooking(dbBooking: any) {
  return {
    ...dbBooking,
    room: dbBooking.room ? {
      ...dbBooking.room,
      is_available: dbBooking.room.is_active,
      credit_cost_per_hour: Math.ceil(dbBooking.room.hourly_rate / 100),
      amenities: ["Whiteboard", "TV Screen"] // Default amenities
    } : null
  };
}