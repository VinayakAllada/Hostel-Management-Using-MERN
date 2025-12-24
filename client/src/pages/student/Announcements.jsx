import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyAnnouncements } from "../../api/announcement.api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { Megaphone, Bell } from "lucide-react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data } = await getMyAnnouncements();
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

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-lg">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Announcements
          </h1>
          <p className="text-slate-400 text-sm">
            Stay updated with hostel announcements
          </p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : announcements.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-xl shadow-lg text-center border border-slate-200 dark:border-slate-700">
          <Megaphone className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">
            No announcements at the moment
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Check back later for updates from your hostel admin
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                  <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-slate-800 dark:text-white font-semibold text-lg line-clamp-2">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                </div>
              </div>
              
              <div className="flex-1">
                  <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {announcement.message}
                  </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
                  <span className="text-xs text-slate-400 font-medium">
                    Posted on {new Date(announcement.createdAt).toLocaleString()}
                  </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Announcements;

