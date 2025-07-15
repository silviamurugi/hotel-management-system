import { Request, Response } from 'express';
import {
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService
} from "./user.service";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const user = await getUserByIdService(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existingUser = await getUserByIdService(id);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const updatedUser = await updateUserService(id, req.body);
    if (!updatedUser) return res.status(400).json({ message: "User not updated" });

    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    //  1. Check existence
    const existingUser = await getUserByIdService(id);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    //  2. Perform deletion once
    const deleted = await deleteUserService(id);
    if (!deleted) return res.status(400).json({ message: "User not deleted" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
