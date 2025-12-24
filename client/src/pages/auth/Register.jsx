import { useState } from "react";
import { Link } from "react-router-dom";
import { registerStudent } from "../../api/auth.api";
import { getErrorMessage } from "../../utils/apiError";
import toast from "react-hot-toast";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentID: "",
    branch: "",
    collegeEmail: "",
    hostelBlock: "",
    roomNO: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await registerStudent(formData); // ✅ await
      toast.success(
        data.message || "Registration sent successfully"
      );

      setFormData({
        fullName: "",
        studentID: "",
        branch: "",
        collegeEmail: "",
        hostelBlock: "",
        roomNO: "",
        password: "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200 dark:border-slate-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-white">
          Student Registration
        </h2>

        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          disabled={loading}   // ✅
          required
        />

        <Input
          label="Student ID"
          name="studentID"
          value={formData.studentID}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Input
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Input
          label="College Email"
          type="email"
          name="collegeEmail"
          value={formData.collegeEmail}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Input
          label="Hostel Block"
          name="hostelBlock"
          value={formData.hostelBlock}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Input
          label="Room Number"
          name="roomNO"
          value={formData.roomNO}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? <Loader /> : "Register"}
        </Button>

        <p className="mt-4 text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
