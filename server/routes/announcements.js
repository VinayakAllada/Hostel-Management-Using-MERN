import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  createAnnouncement,
  getMyAnnouncements,
  getBlockAnnouncements,
} from "../controllers/announcement.js";

const router = express.Router();

// Admin
router.post("/", protectRoute, createAnnouncement);
router.get("/admin", protectRoute, getBlockAnnouncements);

// Student
router.get("/my", protectRoute, getMyAnnouncements);

export default router;
