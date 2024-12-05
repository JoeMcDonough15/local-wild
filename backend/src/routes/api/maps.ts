import express from "express";
import configObj from "../../config/index.js";

const { googleMapsApiKey } = configObj;

const router = express.Router();

router.post("/key", (_req, res) => {
  res.status(200).json({ key: googleMapsApiKey });
});

export default router;
