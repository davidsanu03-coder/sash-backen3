import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// =====================
// TRUST PROXY (IMPORTANT FOR RENDER)
// =====================
app.set("trust proxy", 1);

// =====================
// CORS CONFIG (FIXED PRODUCTION SAFE)
// =====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://sash-learning-hu.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman or server-to-server calls
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);

// handle preflight requests explicitly
app.options("*", cors());

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

// =====================
// DATABASE
// =====================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected 🟢"))
  .catch((err) => console.error("MongoDB error 🔴:", err.message));

// =====================
// ROUTES
// =====================
app.get("/", (req, res) => {
  res.send("SASH Learning Hub API running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ success: true });
});

// =====================
// AUTH (TEMP)
// =====================
app.post("/api/auth/register", (req, res) => {
  const { fullName, email } = req.body;

  res.json({
    success: true,
    message: "User registered",
    user: { fullName, email, role: "student" },
    token: "demo_token",
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;

  res.json({
    success: true,
    message: "Login success",
    user: { email, role: "student" },
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