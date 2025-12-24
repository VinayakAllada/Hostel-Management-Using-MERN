import DashboardLayout from "../../components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { getAdminDashboardStats } from "../../api/user.api";
import {
  FaUsers,
  FaBed,
  FaExclamationCircle,
  FaUtensils,
  FaUserCheck,
  FaClipboardList,
  FaChartLine
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { authUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingBookings: 0,
    openComplaints: 0,
    messLeaveRequests: 0,
    attendanceData: [], // Default empty
    complaintsData: [], // Default empty
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAdminDashboardStats();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatsCard = ({ title, value, icon: Icon, color, subtext, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg bg-opacity-10 ${color.bg} ${color.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-slate-800 dark:text-white">
          {loading ? "-" : value}
        </p>
      </div>
      <p className="text-slate-400 text-xs mt-2">{subtext}</p>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {authUser?.name || "Admin"}
            </p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => window.print()}
               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/30"
             >
                Generate Report
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={FaUsers}
            color={{ bg: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" }}
            subtext="Total registered students"
            delay={0.1}
          />
          <StatsCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={FaBed}
            color={{ bg: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" }}
            subtext="Approvals waiting"
            delay={0.2}
          />
          <StatsCard
            title="Open Complaints"
            value={stats.openComplaints}
            icon={FaExclamationCircle}
            color={{ bg: "bg-red-500", text: "text-red-600 dark:text-red-400" }}
            subtext="Requires attention"
            delay={0.3}
          />
          <StatsCard
            title="Mess Leaves"
            value={stats.messLeaveRequests}
            icon={FaUtensils}
            color={{ bg: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" }}
            subtext="Active requests"
            delay={0.4}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
              Weekly Attendance Overview
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.attendanceData}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="present" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Complaints Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
              Complaints Status
            </h3>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.complaintsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.complaintsData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {stats.complaintsData?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-400">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/students"
              className="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1"
            >
              <div className="p-3 bg-white/20 w-fit rounded-lg mb-4 backdrop-blur-sm">
                <FaUserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-1">Approve Students</h3>
              <p className="text-blue-100 text-sm">Review pending student registrations</p>
            </Link>

            <Link
              to="/admin/bookings"
              className="group p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1"
            >
              <div className="p-3 bg-white/20 w-fit rounded-lg mb-4 backdrop-blur-sm">
                <FaClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-1">Review Requests</h3>
              <p className="text-indigo-100 text-sm">Check booking and leave requests</p>
            </Link>

            <Link
              to="/admin/attendance"
              className="group p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-1"
            >
              <div className="p-3 bg-white/20 w-fit rounded-lg mb-4 backdrop-blur-sm">
                <FaChartLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-1">View Reports</h3>
              <p className="text-emerald-100 text-sm">Analyze attendance and complaints</p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
