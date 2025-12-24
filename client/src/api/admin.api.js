import api from "./axios";

export const getAllStudents = () => api.get("/admin/students");

export const markAttendance = (data) => api.post("/attendance/record", data);

export const getAttendanceByDate = (date) => api.get(`/attendance/date?date=${date}`);

export const getStudentAttendanceHistory = (studentID) => api.get(`attendance/history/${studentID}`); // Assuming this might be useful later
