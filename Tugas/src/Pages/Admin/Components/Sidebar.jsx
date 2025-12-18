import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin</span>
        <span className="text-2xl font-bold block lg:hidden text-center">
          A
        </span>
      </div>
      <nav className="p-4 space-y-2">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
              isActive
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-700 text-gray-200"
            }`
          }
        >
          <span className="text-xl">🏠</span>
          <span className="hidden lg:inline font-medium">Dashboard</span>
        </NavLink>

        {/* Mahasiswa */}
        <NavLink
          to="/admin/mahasiswa"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
              isActive
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-700 text-gray-200"
            }`
          }
        >
          <span className="text-xl">🎓</span>
          <span className="hidden lg:inline font-medium">Mahasiswa</span>
        </NavLink>

        {/* Dosen */}
        <NavLink
          to="/admin/dosen"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
              isActive
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-700 text-gray-200"
            }`
          }
        >
          <span className="text-xl">👨‍🏫</span>
          <span className="hidden lg:inline font-medium">Dosen</span>
        </NavLink>

        {/* 👇 MENU BARU MATA KULIAH */}
        <NavLink
          to="/admin/matakuliah"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
              isActive
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-700 text-gray-200"
            }`
          }
        >
          <span className="text-xl">📚</span>
          <span className="hidden lg:inline font-medium">Mata Kuliah</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
