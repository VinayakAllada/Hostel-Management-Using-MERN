import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({children}) => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            {/* Top Navbar */}
            <Navbar />

            {/* Body */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <main className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout