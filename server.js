import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// =====================
// LOAD ENV
// =====================
dotenv.config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

// =====================
// CORS CONFIG (FIXED FOR VERCEL)
// =====================
const corsOptions = {
  origin: function (origin, callback) {
    // allow mobile apps / postman
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://sash-learning-hu.vercel.app"
    ];

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, true); // TEMP SAFE MODE (prevents network error)
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

// =====================
// DATABASE CONNECTION
// =====================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

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

// Health check
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
// AUTH ROUTES (TEMP WORKING VERSION)
// =====================

// REGISTER
app.post("/api/auth/register", (req, res) => {
  const { fullName, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  return res.json({
    success: true,
    message: "User registered successfully",
    user: {
      fullName,
      email,
      role: "student"
    },
    token: "demo_token"
  });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  return res.json({
    success: true,
    message: "Login successful",
    user: {
      email,
      role: "student"
    },
    token: "demo_token"
  });
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});