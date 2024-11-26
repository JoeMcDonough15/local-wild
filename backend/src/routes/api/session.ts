import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { check } from "express-validator";
import handleValidationErrors from "../../utils/validation.js";
import { requireAuth, setTokenCookie } from "../../utils/auth.js";
import type { ApiError, NewUser, SafeUser } from "../../types/index.js";
import { prisma } from "../../db/database_client.js";
const router = express.Router();

// backend validation for login
const validateLogin = [
  check("email")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

//backend validation for signup
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

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
        message: "The provided credentials were invalid.",
      };
      err.status = 401;
      err.title = "Login failed";
      err.errors = { "Login failed": "The provided credentials were invalid" };
      return next(err);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
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
    const { email, password, username } = req.body;

    try {
      // first, query the db and see if there's a user with this email or username

      const usersMatched = await prisma.user.findMany({
        where: { OR: [email, username] },
      });

      const emailMustBeUnique = "The email address you chose is already taken.";
      const usernameMustBeUnique = "The username you chose is already taken.";

      const uniqueConstraintErrors = {
        title: "Invalid input",
        errors: {} as { email: string; username: string },
        status: 400,
        message: "Email and Username must both be unique",
      };

      usersMatched.forEach((userMatched) => {
        if (userMatched.email === email && userMatched.username === username) {
          uniqueConstraintErrors.errors.email = emailMustBeUnique;
          uniqueConstraintErrors.errors.username = usernameMustBeUnique;
        } else if (userMatched.email === email) {
          uniqueConstraintErrors.errors.email = emailMustBeUnique;
        } else if (userMatched.username === username) {
          uniqueConstraintErrors.errors.username = usernameMustBeUnique;
        }
      });

      if (Object.keys(uniqueConstraintErrors.errors).length > 0) {
        return next(uniqueConstraintErrors);
      }

      // then, if no user exists with either of those details, create our new user
      const hashedPassword = bcrypt.hashSync(password);
      const user = await prisma.user.create({
        data: { email, username, password: hashedPassword },
      });

      const { password: newPassword, ...userDetails } = user;

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
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
