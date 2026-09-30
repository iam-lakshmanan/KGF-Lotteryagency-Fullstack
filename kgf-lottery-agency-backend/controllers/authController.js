
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

/* ===================== ADMIN LOGIN ===================== */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required",
      });
    }

    // 2️⃣ Find admin
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Create ADMIN JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ SET COOKIE FOR FRONTEND MIDDLEWARE
    // This allows request.cookies.get("admin_token") to work in Next.js
    res.cookie("admin_token", token, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    // 6️⃣ Send response
    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username }
    });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===================== CREATE ADMIN ===================== */
export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required",
      });
    }

    const existing = await Admin.findByUsername(username);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create(username, hashedPassword);

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};