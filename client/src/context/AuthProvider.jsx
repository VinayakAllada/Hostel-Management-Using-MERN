import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  loginStudent,
  loginAdmin,
  logoutUser,
} from "../api/auth.api";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔑 single loading state for auth
  const [loading, setLoading] = useState(false);

  // check auth on app load (cookie-based)
  const checkAuth = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/me");
      setAuthUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const studentLogin = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await loginStudent(credentials);
      setAuthUser(data.user);
      setIsAuthenticated(true);
      toast.success("Login successful");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await loginAdmin(credentials);
      setAuthUser(data.user);
      setIsAuthenticated(true);
      toast.success("Login successful");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setAuthUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isAuthenticated,
        loading,        
        studentLogin,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
