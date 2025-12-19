import React from "react";
import Button from "@/Pages/Auth/Components/Button";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Header = () => {
  const { user, setUser } = useAuthStateContext();

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  const handleLogout = () => {
    confirmLogout(() => {
      setUser(null); // Clear context
      window.location.href = "/";
    });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Panel Admin</h1>
          {/* Tampilkan Nama & Role */}
          <p className="text-sm text-gray-500">
            Halo, <span className="font-bold">{user?.name}</span> ({user?.role})
          </p>
        </div>

        <div className="relative">
          <Button
            onClick={toggleProfileMenu}
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm"
          >
            {user?.name?.charAt(0)}
          </Button>
          <div
            id="profileMenu"
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden z-10"
          >
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
