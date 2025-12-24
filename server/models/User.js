// // models/User.js
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     studentID: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       match: [/^\d{5}$/, "Student ID must be exactly 5 digits"],
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     role: {
//       type: String,
//       default: "student",
//     },

//     // Cloudinary profile picture
//     profilePic: {
//       type: String,
//       default: "",
//     },

//     // Student's allocated hostel room (ONLY ONE ROOM)
//     roomNO: {
//       type: String,
//       unique: true,   // ensures 1 room = 1 student
//       sparse: true,   // avoids duplicate null errors
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("User", userSchema);


// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    studentID: {
      type: String, // roll number
      required: true,
      unique: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    collegeEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    hostelBlock: {
      type: String,
      required: true,
      trim: true,
    },

    roomNO: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "student",
    },

    // 🔐 approval system
    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    // 🟢 optional but useful
    isActive: {
      type: Boolean,
      default: true,
    },

    // 🖼 optional (Cloudinary)
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/**
 * ✅ One room per student PER BLOCK
 * Example:
 * Block A - 101 ✔
 * Block B - 101 ✔
 */
userSchema.index(
  { hostelBlock: 1, roomNO: 1 },
  { unique: true }
);

export default mongoose.model("User", userSchema);
