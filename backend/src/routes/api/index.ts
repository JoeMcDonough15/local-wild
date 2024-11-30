import express, { type Request, type Response } from "express";
const router = express.Router();
import sessionRouter from "./session.js";
import usersRouter from "./users.js";
import postsRouter from "./posts.js";
import { restoreUser } from "../../utils/auth.js";

router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);

export default router;
