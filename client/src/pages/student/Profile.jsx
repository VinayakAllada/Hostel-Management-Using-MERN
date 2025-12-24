import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthProvider";
import { getStudentProfile, updateStudentProfile } from "../../api/user.api";
import { getErrorMessage } from "../../utils/apiError";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { Pencil, X } from "lucide-react";

const StudentProfile = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    branch: "",
    collegeEmail: "",
    hostelBlock: "",
    roomNO: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* =========================
     FETCH PROFILE
  ========================= */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await getStudentProfile();
      setFormData({
        fullName: data.student.fullName,
        branch: data.student.branch,
        collegeEmail: data.student.collegeEmail,
        hostelBlock: data.student.hostelBlock,
        roomNO: data.student.roomNO,
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load profile"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =========================
     UPDATE PROFILE
  ========================= */
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
      const { data } = await updateStudentProfile(formData);
      toast.success("Profile updated successfully");

      // keep auth context in sync
      setAuthUser(data.student);
      setIsEditing(false); // Exit edit mode on success
    } catch (error) {
      toast.error(getErrorMessage(error, "Profile update failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">My Profile</h1>
        {!isEditing && !loading && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
        {isEditing && (
            <button
                onClick={() => {
                    setIsEditing(false);
                    fetchProfile(); // Reset form to original data
                }}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
                <span>Cancel</span>
            </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 max-w-xl border border-slate-200 dark:border-slate-800">
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing || loading}
              required
            />

            <Input
              label="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              disabled={!isEditing || loading}
              required
            />

            <Input
              label="College Email"
              name="collegeEmail"
              value={formData.collegeEmail}
              disabled
            />

            <Input
              label="Hostel Block"
              name="hostelBlock"
              value={formData.hostelBlock}
              disabled
            />

            <Input
              label="Room Number"
              name="roomNO"
              value={formData.roomNO}
              disabled
            />

            {isEditing && (
              <Button type="submit" disabled={loading} className="mt-4">
                {loading ? "Saving..." : "Update Profile"}
              </Button>
            )}
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
