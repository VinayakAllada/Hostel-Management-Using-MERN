import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Reference to student
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hostelBlock: {
      type: String,
      required: true,
    },


    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    // If true → invoice created for all students
    isBroadcast: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
