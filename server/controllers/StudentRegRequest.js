import bcrypt from "bcryptjs";
import StudentRegistrationRequest from "../models/StudentRegRequest.js";
import User from "../models/User.js";

export const submitRegistrationRequest = async (req, res) => {
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

    // 1️⃣ Prevent duplicate approved users
    const existingUser = await User.findOne({
      $or: [
        { studentID },
        { collegeEmail },
        { hostelBlock, roomNO }, // ✅ FIXED
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Student already registered or room already allocated",
      });
    }

    // 2️⃣ Prevent duplicate pending requests
    const existingRequest = await StudentRegistrationRequest.findOne({
      $or: [
        { studentID, status: "pending" },
        { collegeEmail, status: "pending" },
        { hostelBlock, roomNO, status: "pending" }, // ✅ FIXED
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Registration request already pending",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create registration request
    await StudentRegistrationRequest.create({
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
