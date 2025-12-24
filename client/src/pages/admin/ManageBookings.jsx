import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../api/booking.api";
import { getErrorMessage } from "../../utils/apiError";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const ManageBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchBookings = async () => {
        setLoading(true)
        try{
            const {data} = await getAllBookings()
            setBookings(data.bookings || data || [])
        }
        catch(error){
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch bookings";
            toast.error(errorMessage);
            console.error("Failed to fetch bookings:", error);
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            await updateBookingStatus(bookingId, status);
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error(
                getErrorMessage(error, "Failed to update booking")
            );
        }
    };

    return (
        <DashboardLayout>
        {/* Page Header */}
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
            Guest Room Bookings
        </h1>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-800">
            {loading ? (
                <Loader />
                ) : bookings.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">
                    No bookings found.
                </p>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-600 dark:text-white">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="p-3 text-left">Student</th>
                        <th className="p-3 text-left">Visitor</th>
                        <th className="p-3 text-left">Room</th>
                        <th className="p-3 text-left">Dates</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((booking) => (
                        <tr
                            key={booking._id}
                            className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                        >
                            <td className="p-3">
                                {booking.student?.fullName}
                            </td>

                            <td className="p-3">
                                {booking.visitorName}
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {booking.relation}
                                </div>
                            </td>

                            <td className="p-3 font-medium">
                                {booking.guestRoomNO}
                            </td>

                            <td className="p-3">
                                {new Date(
                                    booking.dateFrom
                                ).toLocaleDateString()}{" "}
                                →{" "}
                                {new Date(
                                    booking.dateTo
                                ).toLocaleDateString()}
                            </td>

                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium
                                    ${
                                        booking.status === "approved"
                                        ? "bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-400"
                                        : booking.status === "rejected"
                                        ? "bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400"
                                        : "bg-yellow-100 dark:bg-yellow-600/20 text-yellow-600 dark:text-yellow-400"
                                    }
                                    `}
                                >
                                    {booking.status}
                                </span>
                            </td>

                            <td className="p-3 flex gap-2">
                                {booking.status === "pending" && (
                                    <>
                                    <Button
                                        onClick={() =>
                                        handleStatusUpdate(
                                            booking._id,
                                            "approved"
                                        )
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-sm"
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        onClick={() =>
                                        handleStatusUpdate(
                                            booking._id,
                                            "rejected"
                                        )
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-sm"
                                    >
                                        Reject
                                    </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}
        </div>
        </DashboardLayout>
  );
}

export default ManageBookings