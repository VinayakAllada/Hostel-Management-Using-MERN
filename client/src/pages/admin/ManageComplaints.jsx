import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllComplaints,
  updateComplaintStatus,
} from "../../api/complaint.api";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await getAllComplaints();
      setComplaints(data.complaints || data || []);
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      toast.success("Status updated");
      fetchComplaints();
    } catch {
      toast.error("Could not update status");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Manage Complaints
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {complaints.length === 0 ? (
             <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-800">
                <p>No complaints found.</p>
             </div>
          ) : (
             complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between h-full"
            >
              <div>
                  <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                        {c.category}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                        c.status === 'resolved' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 
                        c.status === 'pending' ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        {c.status}
                      </span>
                  </div>
                  
                  <p className="text-slate-800 dark:text-white text-lg font-medium mb-3 line-clamp-3">
                      {c.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {c.student?.fullName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-white">
                            {c.student?.fullName || "Unknown Student"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                             {c.student?.roomNO ? `Room: ${c.student.roomNO}` : "No Room Info"}
                        </p>
                      </div>
                  </div>
              </div>

              {c.status !== "resolved" && (
                <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  {c.status === "pending" && (
                    <button
                      onClick={() => updateStatus(c._id, "accepted")}
                      className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 transition-colors"
                    >
                      Accept
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(c._id, "resolved")}
                    className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              )}
            </div>
          ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageComplaints;
