import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllStudents,
  approveStudent,
  rejectStudent,
} from "../../api/user.api";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/apiError";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, requestsRes] = await Promise.all([
        getAllStudents(),
        api.get("/admin/registrations"),
      ]);

      setStudents(studentsRes.data?.students || studentsRes.data || []);
      setRequests(requestsRes.data.requests || []);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to load students data")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await approveStudent(requestId);
      toast.success("Student approved");
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, "Approval failed"));
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectStudent(requestId);
      toast.success("Student rejected");
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, "Rejection failed"));
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
        Manage Students
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* ================= Pending Requests ================= */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8 border border-slate-200 dark:border-slate-700 w-full">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
               <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
               Pending Registration Requests ({requests.length})
            </h2>

            {requests.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No pending registration requests</p>
                <p className="text-sm text-slate-400">New student registrations will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="p-4">Name</th>
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">Room</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {requests.map((req) => (
                      <tr
                        key={req._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-medium text-slate-900 dark:text-white block text-base">{req.fullName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {req.collegeEmail}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{req.studentID}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{req.branch}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">
                          {req.hostelBlock} - <span className="font-semibold text-slate-800 dark:text-slate-200">{req.roomNO}</span>
                        </td>
                        <td className="p-4">
                           <div className="flex gap-3">
                              <button
                                onClick={() => handleApprove(req._id)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition bg-green-600 text-white hover:bg-green-700 shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req._id)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition bg-red-600 text-white hover:bg-red-700 shadow-sm"
                              >
                                Reject
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ================= Approved Students ================= */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 w-full">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
               <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
               Approved Students ({students.length})
            </h2>

            {students.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No approved students yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="p-4">Name</th>
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">Room</th>
                      <th className="p-4">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {students.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                                {student.fullName?.charAt(0) || "S"}
                             </div>
                             <span className="font-medium text-slate-900 dark:text-white text-base">{student.fullName}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{student.studentID}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{student.branch}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">
                          {student.hostelBlock} - <span className="font-semibold text-slate-800 dark:text-slate-200">{student.roomNO}</span>
                        </td>
                        <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                          {student.collegeEmail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ManageStudents;
