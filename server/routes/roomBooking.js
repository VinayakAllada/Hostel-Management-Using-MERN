import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getAvailableRooms,
  bookRoom,
  getMyBookings,
  getAllRooms,
  updateRoomBookingStatus,
} from "../controllers/roomBooking.js";

const router = express.Router();

/* =======================
   STUDENT ROUTES
======================= */

// Check available guest rooms
// GET /api/room-booking/available?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
router.get("/available", protectRoute, getAvailableRooms);

// Request guest room booking
// POST /api/room-booking/book
router.post("/book", protectRoute, bookRoom);

// Get my bookings
router.get("/my-bookings", protectRoute, getMyBookings);

/* =======================
   GUEST HOSTEL ADMIN ROUTES
======================= */

// View all guest room bookings
// GET /api/room-booking/admin
router.get("/admin", protectRoute, getAllRooms);

// Approve / Reject booking
// PATCH /api/room-booking/:id/status
router.patch("/:id/status", protectRoute, updateRoomBookingStatus);

export default router;
