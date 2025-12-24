import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import adminRoutes from "./routes/admin.js";
import complaintRoutes from "./routes/complaints.js";
import attendanceRoutes from "./routes/attendance.js";
import messLeaveRoutes from "./routes/messLeave.js";
import invoiceRoutes from "./routes/invoices.js";
import roomBookingRoutes from "./routes/roomBooking.js";
import registrationRoutes from "./routes/registration.js";
import announcementRoutes from "./routes/announcements.js";
import cookieParser from "cookie-parser";

const app = express();

// ------------------ MIDDLEWARE ------------------ //
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      process.env.CLIENT_URL // Production frontend URL
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "4mb" }));

// ------------------ ROUTES ------------------ //
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/mess-leave", messLeaveRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/room-booking", roomBookingRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/announcements", announcementRoutes);

// ------------------ START SERVER ------------------ //
const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
