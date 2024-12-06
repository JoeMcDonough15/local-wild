import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { validateLogin, validateSignup } from "../../utils/validation.js";
import { requireAuth, setTokenCookie } from "../../utils/auth.js";
import type { ApiError } from "../../types/index.js";
import { prisma } from "../../db/database_client.js";
import { singleMulterUpload, singlePublicFileUpload } from "../../aws/index.js";
const router = express.Router();

// Get currently logged in user
router.get("/", (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({
      user,
    });
  }
  return res.json({ user: null });
});

// Log in
router.post(
  "/",
  validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      const err: ApiError = {
        name: "Login failed",
        message: "The provided credentials were invalid.",
        status: 401,
        errors: { "Login failed": "The provided credentials were invalid" },
      };

      return next(err);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    setTokenCookie(res, safeUser);

    const { password: newPassword, ...userDetails } = user;

    return res.json({
      user: userDetails,
    });
  }
);

// Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "You have been logged out." });
});

// Sign up
router.post(
  "/signup",
  validateSignup,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;

    try {
      // first, query the db and see if there's a user with this email or username

      const usersMatched = await prisma.user.findMany({
        where: { email },
      });

      const emailMustBeUnique = "The email address you chose is already taken.";

      const uniqueConstraintErrors = {
        title: "Invalid input",
        errors: {} as { email: string },
        status: 400,
        message: "This email is already in use.",
      };

      usersMatched.forEach((userMatched) => {
        if (userMatched.email === email) {
          uniqueConstraintErrors.errors.email = emailMustBeUnique;
        }
      });

      if (Object.keys(uniqueConstraintErrors.errors).length > 0) {
        return next(uniqueConstraintErrors);
      }

      // then, if no user exists with either of those details, create our new user
      const hashedPassword = bcrypt.hashSync(password);
      const user = await prisma.user.create({
        data: { email, name, password: hashedPassword },
      });

      const { password: newPassword, ...userDetails } = user;

      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      setTokenCookie(res, safeUser);

      return res.status(201).json({
        user: userDetails,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// Update a user's profile/account
router.put(
  "/",
  requireAuth,
  singleMulterUpload("image"),
  async (req, res, next) => {
    const { user } = req;
    const userId = user?.id;
    const { location, aboutMe } = req.body;
    const imgFile = req.file;
    if (!userId) return;
    try {
      let resourceUrl;
      if (imgFile) {
        resourceUrl = await singlePublicFileUpload(imgFile);
      }
      const userToUpdate = await prisma.user.update({
        where: { id: userId },
        data: {
          location: location ?? null,
          profileImageUrl: resourceUrl ?? null,
          aboutMe: aboutMe ?? null,
        },
      });

      if (!userToUpdate) {
        const userNotFound: ApiError = {
          name: "User Not Found Error",
          message: "This user could not be found",
          status: 404,
        };
        return next(userNotFound);
      }

      const { password, ...userDetails } = userToUpdate;
      res.status(200).json({ user: userDetails });
    } catch (err) {
      return next(err);
    }
  }
);

// Delete account
router.delete("/deactivate", requireAuth, async (req, res, next) => {
  try {
    const { user } = req;
    const userId = user?.id;
    if (!userId) return;
    await prisma.user.delete({ where: { id: userId } });
    res.clearCookie("token");
    res.status(200).json({ message: "Your account has been deleted." });
  } catch (err) {
    return next(err);
  }
});

export default router;
