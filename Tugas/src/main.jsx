import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "@/Utils/Contexts/AuthContext";
import "./App.css"; // atau ./App.css sesuai project Anda

// Layouts & Components
import AuthLayout from "@/Pages/Auth/AuthLayout";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";
import PageNotFound from "@/Pages/Error/PageNotFound";

// Pages
import Login from "@/Pages/Auth/Login/Login";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen";
import MataKuliah from "@/Pages/Admin/MataKuliah/MataKuliah";
import RencanaStudi from "@/Pages/Admin/RencanaStudi/RencanaStudi"; // 👈 Import Halaman Baru

// Inisialisasi React Query Client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "mahasiswa",
        children: [
          { index: true, element: <Mahasiswa /> },
          { path: ":nim", element: <MahasiswaDetail /> },
        ],
      },
      { path: "dosen", element: <Dosen /> },
      { path: "matakuliah", element: <MataKuliah /> },

      // 👇 Route Baru untuk Rencana Studi
      { path: "rencana-studi", element: <RencanaStudi /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
