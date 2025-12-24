import bcrypt from "bcryptjs";
import User from "../models/User.js";
import RoomBook from "../models/RoomBook.js";
import Complaint from "../models/Complaint.js";
import MessLeave from "../models/MessLeave.js";
import Invoice from "../models/Invoice.js";
import Attendance from "../models/Attendance.js"; 
import Announcement from "../models/Announcement.js";

export const getStudentProfile = async (req, res) => {
    try{
        if(req.role !== "student"){
            return res.status(403).json({success : false, message : "Unauthorized"})
        }
        const student = await User.findById(req.user._id).select("-password")

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.json({
            success: true,
            student
        });
    }
    catch(error){
        res.status(500).json({success : false, message : error.message})
    }
}

export const updateStudentProfile = async (req, res) => {
    try{
        if(req.role !== "student"){
            return res.status(403).json({success : false, message : "Unauthorized"})
        }

        const updateData = {}; // To store the updated details
        
        const {fullName, branch, profilePic} = req.body;

        const studentId = req.user._id;

        // Email update logic disabled/removed for now
        
        if(fullName) updateData.fullName = fullName;
        if(branch) updateData.branch = branch;
        if(profilePic) updateData.profilePic = profilePic;

        if(Object.keys(updateData).length === 0){
            return res.status(400).json({
                success : false,
                message : "No valid fields provided for update"
            })
        }

        /*Default behavior:
            MongoDB returns the OLD document before update
            With new: true:-
            MongoDB returns the UPDATED document
        runValidators: true
            Ensures schema validations still run on update,
            if after update lets say we set email = "", but
            we have defined email.required : true,
            so it will check it after updating nd it will throw error*/ 
        
        const updatedStudent = await User.findByIdAndUpdate(
            studentId,
            { $set : updateData},
            { new : true, runValidators : true}
        )

        if(!updatedStudent){
            return res.status(404).json({
                success : false,
                message : "Student not found"
            })
        }

        res.json({
            success : true,
            student : updatedStudent,
        })
    }
    catch(error){
        res.status(500).json({success : false, message : error.message})
    }   
}

export const changeStudentPassword = async (req, res) => {
    try {
        if(req.role !== "student"){
            return res.status(403).json({success : false , message : "Access denied"})
        }
        
        const {currentPassword, newPassword} = req.body;
        const studentId = req.user._id;

        const student = await User.findOne({_id : studentId})

        const isMatch = await bcrypt.compare(currentPassword, student.password)
        if(!isMatch){
            return res.status(400).json({success : false, message : "Current password entered is wrong"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        student.password = hashedPassword;

        await student.save();

    } catch (error) {
        res.status(500).json({success : false, message : error.message})
    }    
}

export const getDashboardStats = async (req, res) => {
  try {
    if (req.role !== "student") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const studentId = req.user._id;

    // 1. Total Attendance (Count of 'present' status)
    const totalAttendance = await Attendance.countDocuments({
      student: studentId,
      status: "present",
    });

    // 2. Active Complaints
    const activeComplaints = await Complaint.countDocuments({
      student: studentId,
      status: { $in: ["pending", "open"] },
    });

    // 3. Mess Leave Days (Sum of days for all approved leaves)
    const approvedLeaves = await MessLeave.find({
      student: studentId,
      status: "approved",
    });

    const messLeaveDays = approvedLeaves.reduce((acc, leave) => {
      if (!leave.startDate || !leave.endDate) return acc;
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      return acc + diffDays;
    }, 0);

    // 4. Attendance Trend (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const attendanceRecords = await Attendance.find({
      student: studentId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // Fill in missing days for cleaner graph if needed, 
    // but for now let's just send what records we have.
    const attendanceTrend = attendanceRecords.map(record => ({
      date: new Date(record.date).toISOString().split('T')[0],
      status: record.status
    }));

    // 5. Complaints by Category
    const complaintsByCategory = await Complaint.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    // 6. Recent Announcements (Top 5 for student's hostel block)
    // Assuming student has a hostelBlock field. If not, fetch globally.
    // Fetching global for now + block specific if available
    const block = req.user.hostelBlock;
    const recentAnnouncements = await Announcement.find({
        $or: [
            { hostelBlock: "All" },
            { hostelBlock: block }
        ]
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // 7. Recent Approved Mess Leaves
    const recentMessLeaves = await MessLeave.find({
        student: studentId,
        status: "approved"
    })
    .sort({ startDate: -1 })
    .limit(5);

    res.json({
      success: true,
      stats: {
        totalAttendance,
        activeComplaints,
        messLeaveDays,
        attendanceTrend,
        complaintsByCategory,
        recentAnnouncements,
        recentMessLeaves
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};