import express from "express";
import bcrypt from "bcryptjs";
import { check } from "express-validator";
import handleValidationErrors from "../../utils/validation.js";
import { setTokenCookie } from "../../utils/auth.js";
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
// Restore user
router.get("/", (req, res) => {
    return res.json(req.user);
});
// Log in
router.post("/", validateLogin, async (req, res, next) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        const err = { message: "Login failed" };
        err.status = 401;
        err.title = "Login failed";
        err.errors = { credential: "The provided credentials were invalid." };
        return next(err);
    }
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    await setTokenCookie(res, safeUser);
    return res.json({
        user: safeUser,
    });
});
// Log out
router.delete("/", (_req, res) => {
    res.clearCookie("token");
    return res.json({ message: "You have been logged out." });
});
export default router;
