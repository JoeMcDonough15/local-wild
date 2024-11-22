import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import configurationObj from "../config";
import { SafeUser, User as UserType } from "../../types";
const { jwtConfig } = configurationObj;
// const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
export const setTokenCookie = (
  res: Response,
  user: UserType | SafeUser
): string | undefined => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  let token;
  if (secret && expiresIn) {
    token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (expiresIn) {
    // Set the token cookie
    res.cookie("token", token, {
      maxAge: parseInt(expiresIn) * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "lax",
    });
  }

  return token;
};

export const restoreUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  if (!secret) return;

  return jwt.verify(
    token,
    secret,
    undefined,
    async (err: Error | null, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        let id;
        if (typeof jwtPayload !== "string" && jwtPayload?.data) {
          id = jwtPayload?.data?.id;
        }
        // @ts-ignore // ! fix this once I am using prisma client
        req.user = await User.findByPk(id, {
          attributes: {
            include: ["email", "createdAt", "updatedAt"],
          },
        });
      } catch (e) {
        res.clearCookie("token");
        return next();
      }

      if (!req.user) res.clearCookie("token");

      return next();
    }
  );
};

// If there is no current user, return an error
export const requireAuth = function (
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = {
    name: "Authentication Error",
    message: "Authentication required",
  };
  err.status = 401;
  return next(err);
};
