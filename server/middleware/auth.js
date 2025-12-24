import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 🔑 Read token from HttpOnly cookie
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Decode & verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    if (decoded.role === "student") {
      user = await User.findById(decoded.id).select("-password");
    }

    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid user" });
    }

    // Attach to request
    req.user = user;
    req.role = decoded.role;

    next(); // ✅ allow access
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
