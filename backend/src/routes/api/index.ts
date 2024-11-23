import express, { type Request, type Response } from "express";
const router = express.Router();
import { restoreUser, requireAuth, setTokenCookie } from "../../utils/auth.js";
import sessionRouter from "./session.js";
import usersRouter from "./users.js";

//You can use requireAuth as middleware for routes that require sign in
//You can use setTokenCookie as a func to set cookie for user

router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);

// Restore user
router.get("/restore-user", (req: Request, res: Response) => {
  return res.json(req.user);
});

export default router;
