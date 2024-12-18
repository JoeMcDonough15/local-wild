import express from "express";
import { prisma } from "../../db/database_client.js";
const router = express.Router();
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        return;
    const userId = Number(id);
    const user = await prisma.user.findUnique({
        omit: {
            password: true,
        },
        where: { id: userId },
    });
    if (!user) {
        const userNotFound = {
            name: "Not Found Error",
            message: "User not found.",
            status: 404,
            errors: { userNotFoundError: "This user could not be found." },
        };
        return next(userNotFound);
    }
    res.status(200).json({ user });
});
export default router;
