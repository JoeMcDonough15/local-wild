import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import configurationObj from "../config/index.js";
import type { ApiError, SafeUser } from "../types/index.ts";
import { prisma } from "../db/database_client.js";
const { jwtConfig } = configurationObj;

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
export const setTokenCookie = (res: Response, user: SafeUser): void => {
  // Create the token.
  if (secret && expiresIn) {
    const token = jwt.sign(
      { data: user },
      secret,
      { expiresIn: Number.parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie("token", token, {
      maxAge: Number.parseInt(expiresIn) * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "lax",
    });
  }
};

export const restoreUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  if (!token || !secret) {
    res.clearCookie("token");
    return next();
  }

  const decodeObject = jwt.verify(token, secret);

  if (typeof decodeObject !== "string") {
    const id = decodeObject.data.id;
    const setUserOnReq = async () => {
      const currentUser = await prisma.user.findUnique({
        where: { id },
        select: { email: true, createdAt: true, updatedAt: true },
      });

      return currentUser;
    };

    setUserOnReq().then((currentUser) => {
      req.user = currentUser;
      if (!req.user) res.clearCookie("token");
      return next();
    });
  }
};

// If there is no current user, return an error
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.user) return next();

  const err: ApiError = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = {
    name: "Authentication Error",
    message: "Authentication required",
  };
  err.status = 401;
  return next(err);
};
