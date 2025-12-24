import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { changeStudentPassword } from "../../api/user.api";
import { getErrorMessage } from "../../utils/apiError";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
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
      await changeStudentPassword(formData);
      toast.success("Password changed successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to change password")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Change Password
      </h1>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 max-w-md border border-slate-200 dark:border-slate-800">
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="mt-4"
            >
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
