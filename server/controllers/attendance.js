import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

/* ======================================================
   STUDENT: GET MY ATTENDANCE
====================================================== */
export const getStudentAttendance = async (req, res) => {
  try {
    if (req.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const attendance = await Attendance.find({
      student: req.user._id,
    })
      .sort({ date: -1 })
      .limit(30);

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: RECORD ATTENDANCE (BLOCK-WISE)
====================================================== */
export const recordStudentAttendance = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { studentID, date, status } = req.body;

    if (!studentID || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await User.findOne({
      studentID,
      hostelBlock: req.user.hostelBlock, // 🔑 block check
    });

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found in your hostel block" });
    }

    // Normalize date
    const attendanceDate = date
      ? new Date(new Date(date).setHours(0, 0, 0, 0))
      : new Date(new Date().setHours(0, 0, 0, 0));

    let attendance = await Attendance.findOne({
      student: student._id,
      date: attendanceDate,
    });

    if (attendance) {
      attendance.status = status;
      await attendance.save();
      return res.json(attendance);
    }

    attendance = await Attendance.create({
      student: student._id,
      date: attendanceDate,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Attendance already recorded for this date" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: GET ATTENDANCE (BLOCK-WISE)
====================================================== */
export const getAllStudentsAttendance = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const attendance = await Attendance.find()
      .populate({
        path: "student",
        match: { hostelBlock: req.user.hostelBlock }, // 🔑 block filter
        select: "studentID fullName roomNO hostelBlock",
      })
      .sort({ date: -1 });

    // remove null populated entries
    const filteredAttendance = attendance.filter(
      (a) => a.student !== null
    );

    res.json(filteredAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: ATTENDANCE STATISTICS (BLOCK-WISE)
====================================================== */
export const getAllStudentsAttendanceStatistics = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await User.find({
      role: "student",
      hostelBlock: req.user.hostelBlock, // 🔑 block filter
    });

    const stats = await Promise.all(
      students.map(async (student) => {
        const total = await Attendance.countDocuments({
          student: student._id,
        });

        const present = await Attendance.countDocuments({
          student: student._id,
          status: "present",
        });

        const absent = total - present;

        return {
          studentID: student.studentID,
          name: student.fullName,
          roomNO: student.roomNO,
          total,
          present,
          absent,
          attendancePercentage:
            total > 0 ? ((present / total) * 100).toFixed(2) : 0,
        };
      })
    );

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN: GET ATTENDANCE BY DATE
====================================================== */
export const getAttendanceByDate = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // 1. Get all students in this block (to ensure we only return relevant data)
    const studentsInBlock = await User.find({
      role: "student",
      hostelBlock: req.user.hostelBlock,
    }).select("_id");
    
    const studentIds = studentsInBlock.map(s => s._id);

    // 2. Find attendance for these students on this date
    const attendanceRecords = await Attendance.find({
      student: { $in: studentIds },
      date: {
        $gte: searchDate,
        $lt: nextDay
      }
    }).populate("student", "studentID fullName roomNO");

    res.json({
        success: true,
        attendance: attendanceRecords
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
