import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./server/routes/auth.ts";
import applicationRoutes from "./server/routes/applications.ts";
import paymentRoutes from "./server/routes/payments.ts";
import adminRoutes from "./server/routes/admin.ts";
import notificationRoutes from "./server/routes/notifications.ts";
import fileRoutes from "./server/routes/files.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  // =========================
  // DATABASE CONNECTION
  // =========================
  const MONGODB_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/university_portal";

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }

  // =========================
  // CORS (IMPORTANT - MUST BE FIRST)
  // =========================
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  // =========================
  // BODY PARSERS
  // =========================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // =========================
  // API ROUTES
  // =========================
  app.use("/api/auth", authRoutes);
  app.use("/api/applications", applicationRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/files", fileRoutes);

  // =========================
  // VITE DEV MIDDLEWARE
  // =========================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    // =========================
    // PRODUCTION BUILD
    // =========================
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // =========================
  // START SERVER
  // =========================
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();