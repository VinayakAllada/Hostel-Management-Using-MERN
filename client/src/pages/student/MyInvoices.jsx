import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyInvoices } from "../../api/invoice.api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await getMyInvoices();
      setInvoices(data.invoices || data || []);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        My Invoices
      </h1>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg w-full">
        {loading ? (
          <Loader />
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
             <p className="text-slate-500 dark:text-slate-400 text-lg">No invoices available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((inv) => (
               <div
                key={inv._id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col relative overflow-hidden"
              >
                 <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase rounded-bl-xl ${
                     inv.status === "paid"
                     ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                     : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                 }`}>
                     {inv.status}
                 </div>

                 <div className="mb-4 pr-8">
                     <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Invoice</p>
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                         {inv.title}
                     </h3>
                 </div>

                 <div className="flex items-baseline gap-1 mb-4">
                     <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{inv.amount}</span>
                 </div>

                 <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-grow">
                     {inv.description}
                 </p>

                 <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                     <span className="text-slate-500 dark:text-slate-400">Due Date</span>
                     <span className="font-semibold text-slate-700 dark:text-slate-200">
                         {new Date(inv.dueDate).toLocaleDateString()}
                     </span>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyInvoices;
