import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  History,
  Settings,
  LogOut,
  Contact,
  FileBarChart,
} from "lucide-react";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";

const Sidebar = () => {
  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/admin/rekening",
      label: "Rekening",
      icon: <Contact size={20} />,
    },
    {
      path: "/admin/laporan",
      label: "Laporan",
      icon: <FileBarChart size={20} />,
    },
    {
      path: "/admin/transfer",
      label: "Transfer",
      icon: <ArrowRightLeft size={20} />,
    },
    {
      path: "/admin/settings",
      label: "Pengaturan",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 z-50 hidden lg:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Transaksiku
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() =>
            confirmLogout(() => {
              localStorage.removeItem("user");
              location.href = "/";
            })
          }
          className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
