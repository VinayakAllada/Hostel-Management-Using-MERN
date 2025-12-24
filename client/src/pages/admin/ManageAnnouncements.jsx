import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  createAnnouncement,
  getAllAnnouncements,
} from "../../api/announcement.api";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { Megaphone, Trash2 } from "lucide-react";

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data } = await getAllAnnouncements();
      setAnnouncements(data || []);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load announcements";
      toast.error(errorMessage);
      console.error("Failed to load announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    const submitToast = toast.loading("Creating announcement...");
    setSubmitting(true);

    try {
      const response = await createAnnouncement(formData);
      console.log("Announcement response:", response);
      
      if (response?.data?.success) {
        toast.success("Announcement created successfully!", { id: submitToast });
        setFormData({ title: "", message: "" });
        fetchAnnouncements();
      } else {
        toast.error(response?.data?.message || "Failed to create announcement", { id: submitToast });
      }
    } catch (error) {
      console.error("Announcement creation error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create announcement";
      toast.error(errorMessage, { id: submitToast });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
        Manage Announcements
      </h1>

      {/* Create Announcement Form */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-8 border border-slate-200 dark:border-slate-800 w-full transition-all">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
            <Megaphone className="w-5 h-5" />
          </div>
          Create New Announcement
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Enter a catchy title"
            required
            className="text-lg"
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Type your announcement detail here..."
              required
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed resize-y min-h-[120px]"
            />
          </div>

          <div className="flex justify-end">
            <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
            >
                {submitting ? "Publishing..." : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
          All Announcements ({announcements.length})
        </h2>
        
        {loading ? (
          <Loader />
        ) : announcements.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No announcements yet. Create your first announcement above.
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-slate-800 dark:text-white font-semibold text-lg">
                    {announcement.title}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">
                  {announcement.message}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Posted: {new Date(announcement.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageAnnouncements;

