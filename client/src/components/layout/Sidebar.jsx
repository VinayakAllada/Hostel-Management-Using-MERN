import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import {
  FaTachometerAlt,
  FaBed,
  FaBookmark,
  FaExclamationCircle,
  FaUtensils,
  FaFileInvoiceDollar,
  FaBullhorn,
  FaUsers,
  FaClipboardCheck,
  FaBars,
  FaTimes
} from "react-icons/fa";

const Sidebar = () => {
  const { authUser } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic link classes
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-[1.02]"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-white hover:pl-5"
    }`;

  const SectionTitle = ({ children }) => (
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
      {children}
    </p>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900/90 backdrop-blur-sm text-white rounded-lg shadow-xl border border-slate-700 hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        <FaBars className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 md:z-10 transition-transform duration-300 ease-out min-h-screen shadow-lg dark:shadow-none`}
      >
        {/* Sidebar Header (Mobile Only - Desktop uses Navbar) */}
        <div className="md:hidden p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HM</span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-lg">Menu</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
          
          {/* STUDENT LINKS */}
          {authUser?.role === "student" && (
            <>
              <div className="space-y-1">
                <NavLink to="/student" end className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaTachometerAlt className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>
              </div>

              <SectionTitle>Services</SectionTitle>
              <div className="space-y-1">
                <NavLink to="/student/guest-room-booking" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaBed className="w-5 h-5" />
                  <span>Guest Room</span>
                </NavLink>
                <NavLink to="/student/my-bookings" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaBookmark className="w-5 h-5" />
                  <span>My Bookings</span>
                </NavLink>
                <NavLink to="/student/complaints" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaExclamationCircle className="w-5 h-5" />
                  <span>Complaints</span>
                </NavLink>
                <NavLink to="/student/mess-leaves" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaUtensils className="w-5 h-5" />
                  <span>Mess Leaves</span>
                </NavLink>
                <NavLink to="/student/invoices" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaFileInvoiceDollar className="w-5 h-5" />
                  <span>Invoices</span>
                </NavLink>
                <NavLink to="/student/announcements" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaBullhorn className="w-5 h-5" />
                  <span>Announcements</span>
                </NavLink>
              </div>
            </>
          )}

          {/* ADMIN LINKS */}
          {authUser?.role === "admin" && (
            <>
              <div className="space-y-1">
                <NavLink to="/admin" end className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaTachometerAlt className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>
              </div>

              <SectionTitle>Management</SectionTitle>
              <div className="space-y-1">
                <NavLink to="/admin/students" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaUsers className="w-5 h-5" />
                  <span>Manage Students</span>
                </NavLink>
                <NavLink to="/admin/bookings" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaBed className="w-5 h-5" />
                  <span>Room Bookings</span>
                </NavLink>
                <NavLink to="/admin/complaints" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaExclamationCircle className="w-5 h-5" />
                  <span>Complaints</span>
                </NavLink>
                <NavLink to="/admin/mess-leaves" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaUtensils className="w-5 h-5" />
                  <span>Mess Leaves</span>
                </NavLink>
                <NavLink to="/admin/invoices" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaFileInvoiceDollar className="w-5 h-5" />
                  <span>Invoices</span>
                </NavLink>
                <NavLink to="/admin/announcements" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaBullhorn className="w-5 h-5" />
                  <span>Announcements</span>
                </NavLink>
                <NavLink to="/admin/attendance" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                  <FaClipboardCheck className="w-5 h-5" />
                  <span>Attendance</span>
                </NavLink>
              </div>
            </>
          )}
        </nav>
        
        {/* Footer / Copyright */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <p className="text-xs text-center text-slate-400 dark:text-slate-500">
               © 2025 Hostel Management
             </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
