import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  applyMessLeave,
  getMyMessLeaves,
  getBlockMessLeaves,
  approveMessLeave,
  rejectMessLeave,
} from "../controllers/messLeave.js";

const router = express.Router();

// Student
router.post("/apply", protectRoute, applyMessLeave);
router.get("/my", protectRoute, getMyMessLeaves);

// Admin
router.get("/admin", protectRoute, getBlockMessLeaves);
router.patch("/:id/approve", protectRoute, approveMessLeave);
router.patch("/:id/reject", protectRoute, rejectMessLeave);

export default router;
