import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllInvoices,
  createInvoice,
  markInvoicePaid,
} from "../../api/invoice.api";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import api from "../../api/axios";
import toast from "react-hot-toast";

const ManageInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]); // Store list of students
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    dueDate: "",
    isBroadcast: true,
    studentID: "", // For single student selection
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await getAllInvoices();
      setInvoices(data.invoices || data || []);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load invoices";
      toast.error(errorMessage);
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all students to populate dropdown
  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/admin/students");
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.amount || !formData.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.isBroadcast && !formData.studentID) {
        toast.error("Please select a student");
        return;
    }

    const submitToast = toast.loading("Creating invoice...");
    setLoading(true);

    try {
      const response = await createInvoice(formData);
      console.log("Invoice response:", response);
      
      if (response?.data?.success) {
        toast.success(response.data.message || "Invoice created successfully!", { id: submitToast });
        setFormData({ title: "", description: "", amount: "", dueDate: "", isBroadcast: true, studentID: "" });
        fetchInvoices();
      } else {
        toast.error(response?.data?.message || "Failed to create invoice", { id: submitToast });
      }
    } catch (error) {
      console.error("Invoice creation error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create invoice";
      toast.error(errorMessage, { id: submitToast });
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    try {
      const response = await markInvoicePaid(id);
      if (response?.data?.success) {
        toast.success("Invoice marked as paid");
        fetchInvoices();
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update status";
      toast.error(errorMessage);
      console.error("Failed to mark invoice as paid:", error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Manage Invoices
      </h1>

      {/* Create Invoice */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-8 border border-slate-200 dark:border-slate-800 w-full">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Create New Invoice</h2>
        <form onSubmit={handleCreate}>
        
        {/* Toggle Broadcast */}
        <div className="mb-6">
          <label className="flex items-center gap-3 text-slate-700 dark:text-white cursor-pointer w-fit p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <input
              type="checkbox"
              name="isBroadcast"
              checked={formData.isBroadcast}
              onChange={(e) => setFormData(prev => ({ ...prev, isBroadcast: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-lg">Broadcast to all students</span>
          </label>
          <p className="text-sm text-slate-500 ml-8 mt-1">If unchecked, you can select a specific student.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Selector (Only if NOT broadcast) */}
            {!formData.isBroadcast && (
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Select Student <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="studentID"
                        value={formData.studentID}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        required={!formData.isBroadcast}
                    >
                        <option value="">-- Select Student --</option>
                        {students.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.fullName} ({student.roomNO})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="md:col-span-2">
                <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Mess Fee - January"
                />
            </div>

            <div>
                <Input
                label="Amount (₹)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="0.00"
                />
            </div>

            <div>
                <Input
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={loading}
                required
                />
            </div>

            <div className="md:col-span-2">
                <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter a brief description of the invoice"
                />
            </div>
        </div>

        <div className="mt-8 flex justify-end">
            <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
            >
            {loading ? "Creating Invoice..." : "Create Invoice"}
            </button>
        </div>
        </form>
      </div>

      {/* Invoice List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
          All Invoices ({invoices.length})
        </h2>
        
        {loading ? (
          <Loader />
        ) : invoices.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No invoices yet. Create your first invoice above.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-800 dark:text-white font-semibold text-lg">
                      {inv.title}
                    </h3>
                     <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase ${
                        inv.status === "paid" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                        {inv.status}
                    </span>
                  </div>
                  
                  {/* Show who this invoice is for */}
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                    To: <span className="text-slate-700 dark:text-slate-200">
                        {inv.student ? `${inv.student.fullName} (${inv.student.roomNO || "N/A"})` : "Broadcast/Unknown"}
                    </span>
                  </p>

                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                    {inv.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                     <span className="font-semibold text-slate-700 dark:text-slate-300">₹{inv.amount}</span>
                     <span>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {inv.status === "pending" ? (
                    <button
                      onClick={() => markPaid(inv._id)}
                      className="px-4 py-2 rounded-md text-sm font-medium transition bg-green-600 text-white hover:bg-green-700 shadow-sm"
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        ✓ Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageInvoices;
