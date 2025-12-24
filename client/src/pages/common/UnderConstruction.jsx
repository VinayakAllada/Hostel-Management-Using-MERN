import DashboardLayout from "../../components/layout/DashboardLayout";
import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const UnderConstruction = () => {
  return (
    <DashboardLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-800 rounded-2xl border border-slate-700">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Wrench className="w-10 h-10 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Under Construction
        </h1>
        <p className="text-slate-400 max-w-md mb-8">
          This feature is currently being developed. Please check back later for updates.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default UnderConstruction;
