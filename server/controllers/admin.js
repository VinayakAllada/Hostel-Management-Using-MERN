import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Complaint from "../models/Complaint.js";
import Invoice from "../models/Invoice.js";
import MessLeave from "../models/MessLeave.js";
import RoomBook from "../models/RoomBook.js";
import StudentRegRequest from "../models/StudentRegRequest.js";
import { sendRegistrationStatusEmail } from "../lib/sendEmail.js";

/* ===================================================
   GET ALL STUDENTS
====================================================== */
export const getAllStudentDetails = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const students = await User.find({ 
      role: "student", 
      hostelBlock: req.user.hostelBlock 
    })
    .select("-password")
    .sort({ createdAt: -1 });

    return res.json({ 
      success: true,
      students 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET SINGLE STUDENT FULL DETAILS
====================================================== */
export const getStudentDetails = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const student = await User.findOne({
      studentID: req.params.studentID,
      role: "student",
    }).select("-password");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const complaints = await Complaint.find({ student: student._id });
    const attendance = await Attendance.find({ student: student._id });
    const messLeaves = await MessLeave.find({ student: student._id });
    const invoices = await Invoice.find({
      $or: [{ student: student._id, isBroadcast: true }],
    });
    const guestRoomBookings = await RoomBook.find({
      student: student._id,
    });

    res.json({
      student,
      complaints,
      attendance,
      messLeaves,
      invoices,
      guestRoomBookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   ADMIN: GET PENDING REGISTRATION REQUESTS
====================================================== */
export const getPendingRegistrations = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requests = await StudentRegRequest.find({
      hostelBlock: req.user.hostelBlock,
      status: "pending",
    });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/* ======================================================
   ADMIN: APPROVE STUDENT REGISTRATION
====================================================== */
export const approveStudent = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { requestId } = req.params;

    const request = await StudentRegRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (request.hostelBlock !== req.user.hostelBlock) {
      return res.status(403).json({ message: "Not authorized for this block" });
    }

    const existingStudent = await User.findOne({
      studentID: request.studentID,
    });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const student = await User.create({
      fullName: request.fullName,
      studentID: request.studentID,
      branch: request.branch,
      collegeEmail: request.collegeEmail,
      hostelBlock: request.hostelBlock,
      roomNO: request.roomNO,
      password: request.password,
      isApproved: true,
      approvedBy: req.user._id,
    });

    request.status = "approved";
    await request.save();

    // 📧 Auto email
    await sendRegistrationStatusEmail({
      to: request.collegeEmail,
      fullName: request.fullName,
      hostelBlock: request.hostelBlock,
      roomNO: request.roomNO,
      status: "approved",
    });

    res.json({
      success: true,
      message: "Student approved successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: REJECT STUDENT REGISTRATION
====================================================== */
export const rejectStudent = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await StudentRegRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (request.hostelBlock !== req.user.hostelBlock) {
      return res.status(403).json({ message: "Not authorized for this block" });
    }

    request.status = "rejected";
    request.rejectionReason = reason || "Rejected by admin";
    await request.save();

    // 📧 Auto email
    await sendRegistrationStatusEmail({
      to: request.collegeEmail,
      fullName: request.fullName,
      status: "rejected",
      rejectionReason: request.rejectionReason,
    });

    res.json({
      success: true,
      message: "Student registration rejected",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: DASHBOARD STATS
====================================================== */
export const getDashboardStats = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { hostelBlock } = req.user;

    // 1. Total Students in Block
    const totalStudents = await User.countDocuments({
      role: "student",
      hostelBlock: hostelBlock,
      isApproved: true,
    });

    // 2. Pending Rooms: Bookings by students in this block
    const studentsInBlock = await User.find({
      role: "student",
      hostelBlock: hostelBlock,
    }).select("_id");
    const studentIds = studentsInBlock.map((s) => s._id);

    const pendingBookings = await RoomBook.countDocuments({
      student: { $in: studentIds },
      status: "pending",
    });

    // 3. Open Complaints (pending or accepted) in Block - SCALAR
    const openComplaints = await Complaint.countDocuments({
      hostelBlock: hostelBlock,
      status: { $in: ["pending", "accepted"] },
    });

    // 4. Pending Mess Leave Requests in Block
    const messLeaveRequests = await MessLeave.countDocuments({
      hostelBlock: hostelBlock,
      status: "pending",
    });

    // 5. CHART DATA: Complaints Status Distribution
    const complaintsDistribution = await Complaint.aggregate([
      { $match: { hostelBlock: hostelBlock } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format for Recharts (Pending, Resolved, Accepted)
    const statsMap = { pending: 0, accepted: 0, resolved: 0 };
    complaintsDistribution.forEach((item) => {
      statsMap[item._id] = item.count;
    });

    const complaintsData = [
      { name: "Resolved", value: statsMap.resolved, color: "#10B981" }, // Green
      { name: "Pending", value: statsMap.pending, color: "#EF4444" },   // Red
      { name: "In Progress", value: statsMap.accepted, color: "#F59E0B" }, // Yellow/Orange
    ];

    // 6. CHART DATA: Weekly Attendance (Last 7 Days)
    // We want to show "Present" count for each of the last 7 days for students in this block.
    // Attendance model has: student (ObjectId), date (Date), status ("present" | "absent")

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo },
          status: "present",
          student: { $in: studentIds }, // Filter by students in this admin's block
        },
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$date", 
              timezone: "+05:30" 
            } 
          },
          present: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0
    const attendanceData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...

      const found = weeklyAttendance.find((w) => w._id === dateStr);
      attendanceData.push({
        name: dayName,
        date: dateStr,
        present: found ? found.present : 0,
      });
    }

    res.json({
      success: true,
      stats: {
        totalStudents,
        pendingBookings,
        openComplaints,
        messLeaveRequests,
        complaintsData, // for Pie Chart
        attendanceData, // for Area Chart
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
