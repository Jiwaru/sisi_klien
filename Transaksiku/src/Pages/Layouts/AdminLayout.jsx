import Header from "@/Pages/Layouts/Components/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 px-4 pt-8 pb-12">
        <div className="max-w-3xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default AdminLayout;
