import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  const hasPermission = (perm) => user?.permission?.includes(perm);

  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin</span>
        <span className="text-2xl font-bold block lg:hidden text-center">
          A
        </span>
      </div>
      <nav className="p-4 space-y-2">
        {hasPermission("dashboard.page") && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🏠</span>
            <span className="hidden lg:inline">Dashboard</span>
          </NavLink>
        )}

        {hasPermission("mahasiswa.page") && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🎓</span>
            <span className="hidden lg:inline">Mahasiswa</span>
          </NavLink>
        )}

        {hasPermission("dosen.page") && (
          <NavLink
            to="/admin/dosen"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>👨‍🏫</span>
            <span className="hidden lg:inline">Dosen</span>
          </NavLink>
        )}

        {hasPermission("matakuliah.page") && (
          <NavLink
            to="/admin/matakuliah"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>📚</span>
            <span className="hidden lg:inline">Mata Kuliah</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
