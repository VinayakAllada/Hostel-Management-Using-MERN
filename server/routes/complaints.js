import express from "express"
import { protectRoute } from '../middleware/auth.js';
import { createComplaintByStudent, getStudentComplaints, getAllComplaintsForAdmin, acceptComplaintAndSetResolutionDateTime, resolveComplaint, updateComplaintStatus } from '../controllers/complaints.js';

const router = express.Router();

// Create complaint (Student)
router.post('/', protectRoute, createComplaintByStudent);

// Get student's complaints
router.get('/my-complaints', protectRoute, getStudentComplaints);
router.get('/my', protectRoute, getStudentComplaints); // alias for frntd

// Get all complaints (Admin)
router.get('/all', protectRoute, getAllComplaintsForAdmin);
router.get('/admin', protectRoute, getAllComplaintsForAdmin); // alias for frntd

// Accept complaint and set resolution date/time (Admin)
router.put('/:id/accept', protectRoute, acceptComplaintAndSetResolutionDateTime);

// Resolve complaint (Admin)
router.put('/:id/resolve', protectRoute, resolveComplaint);

// Generic status update (Admin)
router.patch('/:id/status', protectRoute, updateComplaintStatus);

export default router

