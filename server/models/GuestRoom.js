import mongoose from "mongoose";

const guestRoomSchema = new mongoose.Schema(
  {
    guestHostelBlock: {
      type: String,
      required: true,
    },

    roomNo: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      default: 2,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Room number must be unique within guest hostel
guestRoomSchema.index(
  { guestHostelBlock: 1, roomNo: 1 },
  { unique: true }
);

export default mongoose.model("GuestRoom", guestRoomSchema);
