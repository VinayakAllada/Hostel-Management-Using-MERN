import express from "express";
import { protectRoute } from '../middleware/auth.js';
import { getStudentAttendance, recordStudentAttendance, getAllStudentsAttendance, getAllStudentsAttendanceStatistics, getAttendanceByDate } from '../controllers/attendance.js';

const router = express.Router();

// Get student's attendance
router.get('/my-attendance', protectRoute, getStudentAttendance);

// Get attendance by date (Admin) - Place before generic /all or /stats if conflicting, but here it's fine
router.get('/date', protectRoute, getAttendanceByDate);

// Record attendance (Admin)
router.post('/record', protectRoute, recordStudentAttendance);

// Get all attendance (Admin)
router.get('/all', protectRoute, getAllStudentsAttendance);

// Get attendance statistics (Admin)
router.get('/stats', protectRoute, getAllStudentsAttendanceStatistics);

export default router;




