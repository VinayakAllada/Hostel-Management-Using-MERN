import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllStudents, markAttendance, getAttendanceByDate } from "../../api/admin.api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Calendar } from "lucide-react";

const AdminAttendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState({}); // { studentID: 'present' | 'absent' }
  const [saving, setSaving] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Students
      const { data: studentData } = await getAllStudents();
      let studentList = [];
      if (studentData.success) {
        studentList = studentData.students;
        setStudents(studentList);
      }

      // 2. Fetch Attendance for selected Date
      if (selectedDate && studentList.length > 0) {
        try {
            const { data: attendanceData } = await getAttendanceByDate(selectedDate);
            if (attendanceData.success) {
                const statusMap = {};
                attendanceData.attendance.forEach(record => {
                    // Assuming record.student is the populated object, and record.student._id matches
                    // OR if population failed, record.student might be ID. 
                    // Let's rely on student ID from the record.
                    const sID = record.student?.studentID || record.student; 
                    // Actually, controller populates 'student'. record.student.studentID is what we key by.
                    if (record.student && record.student.studentID) {
                        statusMap[record.student.studentID] = record.status;
                    }
                });
                setAttendanceStatus(statusMap);
            }
        } catch (err) {
            console.error("Failed to fetch attendance for date", err);
        }
      }

    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]); // Re-fetch when date changes

  const handleMarkAttendance = async (studentID, status) => {
    setSaving((prev) => ({ ...prev, [studentID]: true }));
    try {
      await markAttendance({
        studentID, // Passing Roll Number (string) as per backend expectation
        date: selectedDate,
        status,
      });
      setAttendanceStatus((prev) => ({ ...prev, [studentID]: status }));
      toast.success(`Marked ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSaving((prev) => ({ ...prev, [studentID]: false }));
    }
  };

  if (loading) return <Loader />;
  

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Mark Attendance</h1>
        
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Calendar className="text-blue-500 dark:text-blue-400 w-5 h-5" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Room No</th>
                <th className="px-6 py-4 text-center">Action</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.fullName}</td>
                  <td className="px-6 py-4">{student.studentID}</td>
                  <td className="px-6 py-4">{student.roomNO}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleMarkAttendance(student.studentID, "present")}
                        disabled={saving[student.studentID]}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                           attendanceStatus[student.studentID] === 'present'
                           ? 'bg-green-600 text-white shadow-lg shadow-green-900/50'
                           : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Present</span>
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(student.studentID, "absent")}
                        disabled={saving[student.studentID]}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                           attendanceStatus[student.studentID] === 'absent'
                           ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                           : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {saving[student.studentID] ? (
                        <span className="text-xs text-blue-400 animate-pulse">Saving...</span>
                    ) : attendanceStatus[student.studentID] ? (
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                            attendanceStatus[student.studentID] === 'present' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                            {attendanceStatus[student.studentID]}
                        </span>
                    ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-600">Not Marked</span>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-500">
                        No students found in your block.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAttendance;
