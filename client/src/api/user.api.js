import api from "./axios";

/* ================================
   STUDENT APIs
================================ */

// get logged-in student profile
export const getStudentProfile = () =>
  api.get("/students/profile");

// update student profile
export const updateStudentProfile = (data) =>
  api.put("/students/profile", data);

// change student password
export const changeStudentPassword = (data) =>
  api.put("/students/change-password", data);

// get student dashboard stats
export const getStudentDashboardStats = () =>
  api.get("/students/dashboard/stats");

/* ================================
   ADMIN APIs
================================ */

// get all students
export const getAllStudents = () =>
  api.get("/admin/students");

// get single student details by studentID
export const getStudentById = (studentID) =>
  api.get(`/admin/students/${studentID}`);

// approve student registration request
export const approveStudent = (requestId) =>
  api.patch(`/admin/students/${requestId}/approve`);

// reject student registration request
export const rejectStudent = (requestId) =>
  api.patch(`/admin/students/${requestId}/reject`);

// get admin dashboard stats
export const getAdminDashboardStats = () =>
  api.get("/admin/dashboard/stats");
