import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaSun, 
  FaMoon, 
  FaUser, 
  FaKey, 
  FaSignOutAlt, 
  FaCaretDown,
  FaUserCircle 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { authUser, logout, loading } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const rolePrefix = authUser?.role || "student"; 

  return (
    <nav className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm dark:shadow-lg z-20 sticky top-0 transition-colors duration-300">
      {/* App name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">HM</span>
        </div>
        <h1 className="font-bold text-xl tracking-wide hidden sm:block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Hostel Management
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <FaSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FaMoon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* User Dropdown */}
        {authUser && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FaUser className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden md:block">
                {authUser.fullName || authUser.name}
              </span>
              <FaCaretDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium truncate">
                      {authUser.fullName || authUser.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {authUser.email || "User Email"}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to={`/${rolePrefix}/profile`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserCircle className="w-4 h-4 text-slate-400" />
                      Update Profile
                    </Link>
                    <Link
                      to={`/${rolePrefix}/change-password`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaKey className="w-4 h-4 text-slate-400" />
                      Change Password
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 py-1 bg-slate-50 dark:bg-slate-800/50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
