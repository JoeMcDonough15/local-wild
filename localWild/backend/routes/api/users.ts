import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { check } from "express-validator";
import handleValidationErrors from "../../utils/validation.js";
import { setTokenCookie, requireAuth } from "../../utils/auth.js";

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

// // Sign up
// router.post("/", validateSignup, async (req: Request, res: Response) => {
//   const { email, password, username } = req.body;

//   const hashedPassword = bcrypt.hashSync(password);
//   const user = await User.create({ email, username, hashedPassword });

//   const safeUser = {
//     id: user.id,
//     email: user.email,
//     username: user.username,
//   };

//   await setTokenCookie(res, safeUser);

//   return res.json({
//     user: safeUser,
//   });
// });

// Restore session user
router.get("/", (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser,
    });
  }
  return res.json({ user: null });
});

export default router;
