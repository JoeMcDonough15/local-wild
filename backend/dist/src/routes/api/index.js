import express from "express";
const router = express.Router();
import sessionRouter from "./session.js";
import usersRouter from "./users.js";
import { restoreUser } from "../../utils/auth.js";
router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
export default router;
