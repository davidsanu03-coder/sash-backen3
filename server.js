import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// =====================
// LOAD ENV
// =====================
dotenv.config({ path: "./.env" });

const app = express();

// =====================
// CORS CONFIG
// =====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://sash-learning-iquvop50p-davidsanu03-4141s-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],

    credentials: true,
  })
);

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

// =====================
// ENV CHECK
// =====================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
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
  res.send("SASH Learning Hub API running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully",
  });
});

// =====================
// AUTH ROUTES
// =====================

// Example temporary route
app.post("/api/auth/register", (req, res) => {

  console.log(req.body);

  res.json({
    success: true,
    message: "Signup route working",
    user: req.body,
    token: "sample_token"
  });
});

app.post("/api/auth/login", (req, res) => {

  console.log(req.body);

  res.json({
    success: true,
    message: "Login route working",
    user: {
      email: req.body.email,
      role: "student"
    },
    token: "sample_token"
  });
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});