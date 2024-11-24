import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import bcrypt from "bcryptjs";
import { check } from "express-validator";
import handleValidationErrors from "../../utils/validation.js";
import { setTokenCookie, requireAuth } from "../../utils/auth.js";
import { prisma } from "../../db/database_client.js";

const router = express.Router();

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

// Sign up
router.post(
  "/",
  validateSignup,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;

    try {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await prisma.user.create({
        data: { email, username, password: hashedPassword },
      });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      setTokenCookie(res, safeUser);

      return res.status(201).json({
        user: safeUser,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// Delete account

router.delete("/", requireAuth, async (req, res, next) => {
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
