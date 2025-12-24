import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import StudentRegRequest from "../models/StudentRegRequest.js";
import { generateToken } from "../lib/utils.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/* ======================================================
   STUDENT REGISTRATION REQUEST
   POST /api/auth/register
====================================================== */
export const registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      studentID,
      branch,
      collegeEmail,
      hostelBlock,
      roomNO,
      password,
    } = req.body;

    // 1️⃣ Validate input
    if (
      !fullName ||
      !studentID ||
      !branch ||
      !collegeEmail ||
      !hostelBlock ||
      !roomNO ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Block duplicate student
    const existingStudent = await User.findOne({
      $or: [{ studentID }, { collegeEmail }, { hostelBlock, roomNO }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already registered",
      });
    }

    // 3️⃣ Block duplicate request
    const existingRequest = await StudentRegRequest.findOne({
      studentID,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Registration request already pending",
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create request
    await StudentRegRequest.create({
      fullName,
      studentID,
      branch,
      collegeEmail,
      hostelBlock,
      roomNO,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration request sent to hostel admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   STUDENT LOGIN (APPROVED ONLY)
   POST /api/auth/login
====================================================== */
export const loginStudent = async (req, res) => {
  try {
    const { studentID, password } = req.body;

    if (!studentID || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await User.findOne({ studentID });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!student.isApproved) {
      return res.status(403).json({
        message: "Registration not approved by hostel admin",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(student._id, "student");

    res
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        user: {
          id: student._id,
          fullName: student.fullName,
          studentID: student.studentID,
          branch: student.branch,
          hostelBlock: student.hostelBlock,
          roomNO: student.roomNO,
          role: "student",
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ADMIN LOGIN
   POST /api/auth/admin/login
====================================================== */
export const loginAdmin = async (req, res) => {
  try {
    const { adminID, password } = req.body;

    if (!adminID || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ adminID });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id, "admin");

    res
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        user: {
          id: admin._id,
          name: admin.name,
          adminID: admin.adminID,
          hostelBlock: admin.hostelBlock,
          role: "admin",
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

// Return the user data to frntd
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user, // comes from protectRoute middleware
  });
};

