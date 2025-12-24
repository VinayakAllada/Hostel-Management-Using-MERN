import api from "./axios";

/* ================================
   STUDENT
================================ */

// apply for mess leave
export const applyMessLeave = (data) => {
  console.log("API: applyMessLeave called with data:", data);
  return api.post("/mess-leave/apply", data);
};

// get logged-in student's mess leaves
export const getMyMessLeaves = () =>
  api.get("/mess-leave/my");

/* ================================
   ADMIN
================================ */

// get all mess leave requests
export const getAllMessLeaves = () =>
  api.get("/mess-leave/admin");

// approve / reject mess leave
export const updateMessLeaveStatus = (id, status) =>
  status === "approved"
    ? api.patch(`/mess-leave/${id}/approve`)
    : api.patch(`/mess-leave/${id}/reject`);
