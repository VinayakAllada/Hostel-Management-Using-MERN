import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  getDashboardStats,
} from "../controllers/students.js";
const router = express.Router();

// Get dashboard stats
router.get("/dashboard/stats", protectRoute, getDashboardStats);

// Get student profile
router.get("/profile", protectRoute, getStudentProfile);

// Update student profile
router.put("/profile", protectRoute, updateStudentProfile);

// Change password
router.put("/change-password", protectRoute, changeStudentPassword);

export default router;
