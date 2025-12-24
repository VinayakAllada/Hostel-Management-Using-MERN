import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyBookings } from "../../api/booking.api";
import { getErrorMessage } from "../../utils/apiError";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await getMyBookings();
      setBookings(data.bookings || data || []);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to fetch bookings")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        My Guest Room Bookings
      </h1>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full">
        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
             <p className="text-slate-500 dark:text-slate-400 text-lg">You have no bookings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {bookings.map((booking) => (
                <div
                key={booking._id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col h-full group"
                >
                    <div className="flex justify-between items-start mb-4">
                         <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">#{booking.guestRoomNO}</span>
                         </div>
                         <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${
                                booking.status === "approved"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : booking.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }
                            `}
                        >
                            {booking.status}
                        </span>
                    </div>

                    <div className="mb-6 flex-grow">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                            {booking.visitorName}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                            Relation: {booking.relation}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Schedule</p>
                        <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                            <span>{new Date(booking.dateFrom).toLocaleDateString()}</span>
                            <span className="text-slate-400">→</span>
                            <span>{new Date(booking.dateTo).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyBookings;
