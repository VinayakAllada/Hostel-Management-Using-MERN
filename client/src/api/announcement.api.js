import api from "./axios";

/* ================================
   STUDENT
================================ */

// get logged-in student's announcements
export const getMyAnnouncements = () =>
  api.get("/announcements/my");

/* ================================
   ADMIN
================================ */

// create announcement
export const createAnnouncement = (data) =>
  api.post("/announcements", data);

// get all announcements for admin
export const getAllAnnouncements = () =>
  api.get("/announcements/admin");

