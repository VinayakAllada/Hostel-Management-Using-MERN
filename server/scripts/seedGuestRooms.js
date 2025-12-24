import mongoose from "mongoose";
import dotenv from "dotenv";
import GuestRoom from "../models/GuestRoom.js";

dotenv.config();

const seedGuestRooms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hostel-management");
    console.log("Connected to MongoDB");

    // Clear existing guest rooms
    await GuestRoom.deleteMany({ guestHostelBlock: "GUEST_HOSTEL" });
    console.log("Cleared existing guest rooms");

    // Create 100 guest rooms (Room 1 to Room 100)
    const rooms = [];
    for (let i = 1; i <= 100; i++) {
      rooms.push({
        guestHostelBlock: "GUEST_HOSTEL",
        roomNo: i.toString().padStart(3, "0"), // 001, 002, ..., 100
        capacity: 2,
        isActive: true,
      });
    }

    await GuestRoom.insertMany(rooms);
    console.log(`✅ Successfully created ${rooms.length} guest rooms (001-100)`);

    // Verify
    const count = await GuestRoom.countDocuments({ guestHostelBlock: "GUEST_HOSTEL" });
    console.log(`Total guest rooms in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding guest rooms:", error);
    process.exit(1);
  }
};

seedGuestRooms();

