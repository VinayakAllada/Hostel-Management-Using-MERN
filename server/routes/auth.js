import express from "express";
import {
  registerStudent,
  loginStudent,
  loginAdmin,
  logoutUser,
  getMe,            // ✅ add this
} from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/admin/login", loginAdmin);
router.post("/logout", logoutUser);

// ✅ check logged-in user
router.get("/me", protectRoute, getMe);

export default router;
