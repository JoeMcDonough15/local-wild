import express from "express";
import sessionRouter from "./session.js";
import usersRouter from "./users.js";
import postsRouter from "./posts.js";
import commentsRouter from "./comments.js";
import mapsRouter from "./maps.js";
import { restoreUser } from "../../utils/auth.js";
const router = express.Router();

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/maps", mapsRouter);

export default router;
