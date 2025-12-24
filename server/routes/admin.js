import express from "express";
import { protectRoute } from '../middleware/auth.js';
import { getAllStudentDetails, getStudentDetails, approveStudent, rejectStudent, getPendingRegistrations, getDashboardStats } from '../controllers/admin.js';

const router = express.Router();

// Get dashboard stats
router.get("/dashboard/stats", protectRoute, getDashboardStats);

// Get all students
router.get('/students', protectRoute, getAllStudentDetails);

// Get student details by ID
router.get('/students/:studentID', protectRoute, getStudentDetails);
router.get(
  "/registrations",
  protectRoute,
  getPendingRegistrations
);

router.patch(
  "/students/:requestId/approve",
  protectRoute,
  approveStudent
);

// Reject student
router.patch(
  "/students/:requestId/reject",
  protectRoute,
  rejectStudent
);


export default router;



