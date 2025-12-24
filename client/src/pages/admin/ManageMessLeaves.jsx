import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllMessLeaves,
  updateMessLeaveStatus,
} from "../../api/messLeave.api";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const ManageMessLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data } = await getAllMessLeaves();
      setLeaves(data.leaves || data || []);
    } catch {
      toast.error("Failed to load mess leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    await updateMessLeaveStatus(id, status);
    toast.success("Status updated");
    fetchLeaves();
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Manage Mess Leaves
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {leaves.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-800">
                <p>No mess leave requests found.</p>
            </div>
          ) : (
            leaves.map((l) => (
            <div
              key={l._id}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between h-full"
            >
              <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {l.student?.fullName?.charAt(0) || "S"}
                         </div>
                         <div>
                             <h3 className="font-semibold text-slate-800 dark:text-white">
                                {l.student?.fullName || "Unknown"}
                             </h3>
                             <p className="text-xs text-slate-500 dark:text-slate-400">
                                {l.student?.studentID}
                             </p>
                         </div>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                         l.status === 'approved' ? "text-green-600 bg-green-100 dark:bg-green-900/30" :
                         l.status === 'rejected' ? "text-red-600 bg-red-100 dark:bg-red-900/30" :
                         "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
                     }`}>
                         {l.status}
                     </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {new Date(l.startDate).toLocaleDateString()} <span className="text-slate-400 mx-1">→</span> {new Date(l.endDate).toLocaleDateString()}
                      </p>
                  </div>

                  <div className="mb-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Reason</p>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">
                        {l.reason || "No reason provided."}
                      </p>
                  </div>
              </div>

              {l.status === "pending" && (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => updateStatus(l._id, "approved")}
                    className="py-2 px-4 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(l._id, "rejected")}
                    className="py-2 px-4 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Reject
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

export default ManageMessLeaves;
