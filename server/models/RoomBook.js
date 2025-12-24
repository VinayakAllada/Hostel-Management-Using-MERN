import mongoose from "mongoose";

const roomBookSchema = new mongoose.Schema(
  {
    // Student who requested the booking
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔑 Always GUEST HOSTEL (not student block)
    guestHostelBlock: {
      type: String,
      required: true,
      default: "GUEST_HOSTEL", // or GH1, GH_MAIN, etc.
    },

    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    relation: {
      type: String,
      required: true,
    },

    guestRoomNO: {
      type: String,
      required: true,
      trim: true,
    },

    dateFrom: {
      type: Date,
      required: true,
    },

    dateTo: {
      type: Date,
      required: true,
    },

    purpose: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent overlapping bookings for same guest room
roomBookSchema.index(
  {
    guestHostelBlock: 1,
    guestRoomNO: 1,
    dateFrom: 1,
    dateTo: 1,
  }
);

export default mongoose.model("RoomBook", roomBookSchema);
