import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
const prisma = new PrismaClient();

// Log In

// posts a session user

export const loginUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const sessionUser = await prisma.user.findUnique({ where: { email } });
    res.status(200).json(sessionUser);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
