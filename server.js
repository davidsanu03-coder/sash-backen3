import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables FIRST (safe + explicit path)
dotenv.config({ path: "./.env" });

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// =====================
// ENV CHECK (IMPORTANT)
// =====================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1); // stop server immediately
}

// =====================
// DATABASE CONNECTION
// =====================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully 🟢");
  })
  .catch((err) => {
    console.error("MongoDB connection error 🔴:", err.message);
  });

// =====================
// ROUTES
// =====================
app.get("/", (req, res) => {
  res.send("SASH Learning Hub API is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully"
  });
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});