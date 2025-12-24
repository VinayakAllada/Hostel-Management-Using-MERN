import api from "./axios";

/* ================================
   STUDENT – GUEST ROOM BOOKING
================================ */

// check available guest rooms
export const getAvailableGuestRooms = (params) =>
  api.get("/room-booking/available", { params });

// request guest room booking
export const createRoomBooking = (data) =>
  api.post("/room-booking/book", data);

// get logged-in student's bookings (if you add later)
export const getMyBookings = () =>
  api.get("/room-booking/my-bookings");

/* ================================
   ADMIN – GUEST ROOM MANAGEMENT
================================ */

// get ALL guest room bookings (guest hostel admin)
export const getAllBookings = () =>
  api.get("/room-booking/admin");

// approve / reject booking
export const updateBookingStatus = (bookingId, status) =>
  api.patch(`/room-booking/${bookingId}/status`, { status });
