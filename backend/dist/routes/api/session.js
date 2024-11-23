import express from "express";
import { check } from "express-validator";
import handleValidationErrors from "../../utils/validation.js";
// import { ApiError } from "../../../types.ts";
const router = express.Router();
// backend validation for login
const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Please provide a valid email or username."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
    handleValidationErrors,
];
// // Log in
// router.post("/", async (req, res, next) => {
//   const { credential, password } = req.body;
//   console.log(credential, password, "************");
//   const user = await User.unscoped().findOne({
//     where: {
//       username: credential,
//     },
//   });
//   if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
//     const err: ApiError = { message: "Login failed" };
//     err.status = 401;
//     err.title = "Login failed";
//     err.errors = { credential: "The provided credentials were invalid." };
//     return next(err);
//   }
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
// Log out
router.delete("/", (_req, res) => {
    res.clearCookie("token");
    return res.json({ message: "success" });
});
export default router;