import { Request, Response } from "express";
import { storage } from "./storage";
import { schema } from "../shared/schema";

export async function handleGetRooms(req: Request, res: Response) {
  try {
    const { site } = req.query;
    const rooms = await storage.getMeetingRooms(site as string);

    // Map database fields to frontend expected fields
    const mappedRooms = rooms.map(room => ({
      ...room,
      is_available: room.is_active,
      credit_cost_per_hour: Math.ceil(room.hourly_rate / 100),
      amenities: ["Whiteboard", "TV Screen"] // Default amenities
    }));

    res.json(mappedRooms);
  } catch (error) {
    console.error("Error fetching meeting rooms:", error);
    res.status(500).json({ message: "Failed to fetch meeting rooms" });
  }
}

export async function handleCreateBooking(req: Request, res: Response) {
  try {
    const user = req.user as schema.User;
    const { room_id, start_time, end_time, billed_to, notes } = req.body;

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    
    // Check if booking is in the past
    const now = new Date();
    if (startTime < now) {
      return res.status(400).json({ message: "Cannot book a room for a time in the past" });
    }
    
    // Check room availability
    const isAvailable = await storage.checkRoomAvailability(room_id, startTime, endTime);
    if (!isAvailable) {
      return res.status(400).json({ 
        message: "Room is not available for the selected time",
        details: "There is a scheduling conflict with an existing booking. Please select a different time slot."
      });
    }

    // Get room details to calculate credits
    const room = await storage.getMeetingRoomById(room_id);
    if (!room) {
      return res.status(400).json({ message: "Room not found" });
    }

    // Calculate credits needed
    const durationHours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    const creditsNeeded = durationHours * Math.ceil(room.hourly_rate / 100);

    // Create booking
    const booking = await storage.createMeetingBooking({
      user_id: user.id,
      room_id,
      start_time: startTime,
      end_time: endTime,
      credits_used: creditsNeeded,
      status: "confirmed",
      billed_to: billed_to || "personal",
      notes,
      site: user.site
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
}