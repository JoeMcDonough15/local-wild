// backend/routes/index.js
import express from "express";
const router = express.Router();
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiRouter from "../routes/api/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("filename: ", __filename);
console.log("dirname: ", __dirname);

router.use("/api", apiRouter);
// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  // Serve the frontend's index.html file at the root route
  router.get("/", (req, res) => {
    console.log("\n\ntrying to serve up the index.html:\n\n");
    console.log("\nfilename: ", __filename);
    console.log("\ndirectory this request was received: ", __dirname);
    console.log(
      "\nresolving to this directory: ",
      path.resolve(__dirname, "../../../frontend", "dist", "index.html")
    );
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, "../../../frontend", "dist", "index.html")
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve(__dirname, "../../../frontend/dist")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    console.log("\n\ntrying to serve up the index.html\n\n");
    console.log("filename: ", __filename);
    console.log("directory this request was received: ", __dirname);
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, "../../../frontend", "dist", "index.html")
    );
  });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token);
    res.status(201).json({ token });
  });
}

export default router;
