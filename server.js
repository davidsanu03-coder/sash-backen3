import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// =====================
// TRUST PROXY
// =====================
app.set("trust proxy", 1);

// =====================
// ALLOWED ORIGINS
// =====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://sash-learning-hu.vercel.app",
];

// =====================
// CORS CONFIG
// =====================
app.use(
  cors({
    origin: (origin, callback) => {

      // Allow Postman / mobile apps / server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost + Vercel
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],

    credentials: true,
  })
);

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

// =====================
// DATABASE CONNECTION
// =====================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
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
  res.send("SASH Learning Hub API running 🚀");
});

// API test
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully",
  });
});

// =====================
// AUTH ROUTES (TEMP)
// =====================

// REGISTER
app.post("/api/auth/register", (req, res) => {

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  return res.json({
    success: true,
    message: "User registered successfully",
    user: {
      fullName,
      email,
      role: "student",
    },
    token: "demo_token",
  });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  return res.json({
    success: true,
    message: "Login successful",
    user: {
      email,
      role: "student",
    },
    token: "demo_token",
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});