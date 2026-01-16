import Header from "@/Pages/Layouts/Components/Header";
import Sidebar from "@/Pages/Layouts/Components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
