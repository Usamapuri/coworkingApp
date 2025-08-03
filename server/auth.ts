import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";

export async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set session
    req.session.userId = user.id;

    // Map database fields to frontend expected fields
    const userResponse = {
      ...user,
      credits: 100, // Default credits
      used_credits: 0,
      is_active: true,
      can_charge_cafe_to_org: true,
      can_charge_room_to_org: true
    };
    
    res.json({ user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login" });
  }
}

export async function handleGetMe(req: Request, res: Response) {
  try {
    const user = await storage.getUserById(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Map database fields to frontend expected fields
    const userResponse = {
      ...user,
      credits: 100, // Default credits
      used_credits: 0,
      is_active: true,
      can_charge_cafe_to_org: true,
      can_charge_room_to_org: true
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}