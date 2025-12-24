import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  createComplaint,
  getMyComplaints,
} from "../../api/complaint.api";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "electricity",
    description: "",
  });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await getMyComplaints();
      setComplaints(data.complaints || data || []);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load complaints";
      toast.error(errorMessage);
      console.error("Failed to load complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== COMPLAINT SUBMISSION START ===");
    console.log("1. Form submitted, formData:", formData);
    
    if (!formData.description.trim()) {
      console.log("2. Validation failed: Empty description");
      toast.error("Please enter a description");
      return;
    }

    console.log("3. Validation passed, creating toast");
    const submitToast = toast.loading("Submitting complaint...");
    
    try {
      console.log("4. Calling createComplaint API with data:", formData);
      const response = await createComplaint(formData);
      console.log("5. API Response received:", response);
      console.log("6. Response data:", response?.data);
      console.log("7. Response status:", response?.status);
      
      if (response?.data?.success) {
        console.log("8. Success! Response indicates success");
        toast.success(response.data.message || "Complaint submitted successfully!", { id: submitToast });
        console.log("9. Resetting form and refreshing complaints");
        setFormData({ category: "electricity", description: "" });
        fetchComplaints();
        console.log("10. Complaint submission completed successfully");
      } else {
        console.log("8. Failed! Response does not indicate success:", response?.data);
        toast.error(response?.data?.message || "Failed to submit complaint", { id: submitToast });
      }
    } catch (error) {
      console.error("=== COMPLAINT SUBMISSION ERROR ===");
      console.error("Error object:", error);
      console.error("Error response:", error?.response);
      console.error("Error response data:", error?.response?.data);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to submit complaint";
      console.error("Final error message to show:", errorMessage);
      toast.error(errorMessage, { id: submitToast });
    }
    console.log("=== COMPLAINT SUBMISSION END ===");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Complaints
      </h1>

      {/* New Complaint */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-8 border border-slate-200 dark:border-slate-700 w-full transition-all">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Submit New Complaint</h2>
        <form
            onSubmit={(e) => {
            console.log("Form onSubmit triggered");
            handleSubmit(e);
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                    Category
                    </label>
                    <div className="relative">
                        <select
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData((p) => ({
                            ...p,
                            category: e.target.value,
                            }))
                        }
                        >
                        {["electricity", "water", "mess", "fans", "lightbulb", "other"].map(
                            (opt) => (
                            <option key={opt} value={opt} className="capitalize">
                                {opt}
                            </option>
                            )
                        )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={(e) =>
                        setFormData((p) => ({
                            ...p,
                            description: e.target.value,
                        }))
                        }
                        required
                        placeholder="Describe your issue in detail..."
                        className="w-full"
                    />
                </div>
            </div>
            
            <div className="flex justify-end">
                <button
                type="submit"
                className="px-6 py-3 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform active:scale-95"
                onClick={() => console.log("Submit button clicked")}
                >
                Submit Complaint
                </button>
            </div>
        </form>
      </div>

      {/* Complaint List */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Your Complaints history</h2>
        {loading ? (
          <Loader />
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
             <p className="text-slate-500 dark:text-slate-400 text-lg">No complaints submitted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 capitalize tracking-wide">
                    {c.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                    c.status === "resolved" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : c.status === "accepted"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {c.status}
                  </span>
                </div>
                
                <p className="text-slate-800 dark:text-white text-base font-medium mb-4 flex-1">
                    {c.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Submitted on: {new Date(c.createdAt).toLocaleDateString()}
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

export default Complaints;
