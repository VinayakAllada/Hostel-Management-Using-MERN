import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  applyMessLeave,
  getMyMessLeaves,
} from "../../api/messLeave.api";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const MessLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data } = await getMyMessLeaves();
      setLeaves(data.leaves || data || []);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load mess leaves";
      toast.error(errorMessage);
      console.error("Failed to load mess leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== MESS LEAVE SUBMISSION START ===");
    console.log("1. Form submitted, formData:", formData);
    
    // Validation
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      console.log("2. Validation failed: Missing fields");
      toast.error("Please fill all required fields");
      return;
    }

    const startDt = new Date(formData.startDate);
    const endDt = new Date(formData.endDate);
    
    if (endDt < startDt) {
      console.log("2. Validation failed: End date before start date");
      toast.error("End date must be after start date");
      return;
    }

    console.log("3. Validation passed, creating toast");
    const submitToast = toast.loading("Submitting mess leave request...");
    setLoading(true);

    try {
      console.log("4. Calling applyMessLeave API with data:", formData);
      const response = await applyMessLeave(formData);
      console.log("5. API Response received:", response);
      console.log("6. Response data:", response?.data);
      console.log("7. Response status:", response?.status);
      
      if (response?.data?.success) {
        console.log("8. Success! Response indicates success");
        toast.success("Mess leave applied successfully!", { id: submitToast });
        console.log("9. Resetting form and refreshing leaves");
        setFormData({ startDate: "", endDate: "", reason: "" });
        fetchLeaves();
        console.log("10. Mess leave submission completed successfully");
      } else {
        console.log("8. Failed! Response does not indicate success:", response?.data);
        toast.error(response?.data?.message || "Failed to apply mess leave", { id: submitToast });
      }
    } catch (error) {
      console.error("=== MESS LEAVE SUBMISSION ERROR ===");
      console.error("Error object:", error);
      console.error("Error response:", error?.response);
      console.error("Error response data:", error?.response?.data);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to apply mess leave";
      console.error("Final error message to show:", errorMessage);
      toast.error(errorMessage, { id: submitToast });
    } finally {
      setLoading(false);
      console.log("=== MESS LEAVE SUBMISSION END ===");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Mess Leave
      </h1>

      {/* Apply */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl mb-8 shadow-lg border border-slate-200 dark:border-slate-700 w-full transition-all">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Apply for Mess Leave</h2>
        <form
            onSubmit={(e) => {
            console.log("Form onSubmit triggered");
            handleSubmit(e);
            }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                label="From Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
                required
                />

                <Input
                label="To Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
                required
                />
            </div>

            <Input
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            disabled={loading}
            placeholder="Why do you need leave?"
            required
            className="w-full"
            />

            <div className="flex justify-end">
                <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
                onClick={() => console.log("Apply Leave button clicked")}
                >
                {loading ? "Submitting..." : "Apply Leave"}
                </button>
            </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Your Mess Leave History</h2>
        {loading ? (
          <Loader />
        ) : leaves.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
             <p className="text-slate-500 dark:text-slate-400 text-lg">No mess leave records found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaves.map((l) => (
              <div
                key={l._id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide ${
                    l.status === "approved" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : l.status === "rejected"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {l.status}
                  </span>
                  
                  <span className="text-xs text-slate-400 font-mono">
                     {new Date(l.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-4 border border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white">
                        {new Date(l.startDate).toLocaleDateString()}
                        <span className="text-slate-400">→</span>
                        {new Date(l.endDate).toLocaleDateString()}
                    </div>
                </div>

                <div className="mb-2 flex-grow">
                     <p className="text-slate-600 dark:text-slate-300 text-sm">
                        <span className="font-medium text-slate-800 dark:text-slate-200 mr-2">Reason:</span>
                        {l.reason}
                    </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MessLeaves;
