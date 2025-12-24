import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

const Login = () => {
  const { studentLogin, adminLogin, loading } = useContext(AuthContext);

  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    studentID: "",
    adminID: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ important

    if (role === "student") {
      await studentLogin({
        studentID: formData.studentID,
        password: formData.password,
      });
    } else {
      await adminLogin({
        adminID: formData.adminID,
        password: formData.password,
      });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-sm border border-slate-200 dark:border-slate-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-white">
          {role === "student" ? "Student Login" : "Admin Login"}
        </h2>

        {/* role toggle */}
        <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            disabled={loading}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
              role === "student"
                ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            disabled={loading}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
              role === "admin"
                ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        {role === "student" ? (
          <Input
            label="Student ID"
            name="studentID"
            value={formData.studentID}
            onChange={handleChange}
            disabled={loading} // ✅
            required
          />
        ) : (
          <Input
            label="Admin ID"
            name="adminID"
            value={formData.adminID}
            onChange={handleChange}
            disabled={loading} // ✅
            required
          />
        )}

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading} // ✅
          required
        />

        <Button type="submit" disabled={loading} className="w-full mt-4">
          {loading ? <Loader /> : "Login"}
        </Button>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">New user? </span>
          <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium hover:underline">
            Create new account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
