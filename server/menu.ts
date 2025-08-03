import { Request, Response } from "express";
import { storage } from "./storage";

export async function handleGetMenuItems(req: Request, res: Response) {
  try {
    const user = req.user as any;
    const items = await storage.getMenuItems(user?.site);

    // Map database fields to frontend expected fields
    const mappedItems = items.map(item => ({
      ...item,
      is_available: item.is_active,
      price: item.price.toString()
    }));

    res.json(mappedItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
}

export async function handleGetMenuCategories(req: Request, res: Response) {
  try {
    const user = req.user as any;
    const categories = await storage.getMenuCategories(user?.site);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    res.status(500).json({ message: "Failed to fetch menu categories" });
  }
}