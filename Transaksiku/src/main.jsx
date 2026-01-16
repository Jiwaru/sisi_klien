import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import AuthLayout from "@/Pages/Layouts/AuthLayout";
import AdminLayout from "@/Pages/Layouts/AdminLayout";
import ProtectedRoute from "@/Pages/Layouts/Components/ProtectedRoute";
import ErrorBoundary from "@/Pages/Layouts/Components/ErrorBoundary";
import Login from "@/Pages/Auth/Login";
import PageNotFound from "@/Pages/PageNotFound";
import Dashboard from "@/Pages/Dashboard/Dashboard";
import AccountsPage from "@/Pages/Accounts/AccountsPage";
import ReportsPage from "@/Pages/Reports/ReportsPage";
import TransferPage from "@/Pages/Transfer/TransferPage";
import SettingsPage from "@/Pages/Settings/SettingsPage";

import { Toaster } from "react-hot-toast";

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
        <ErrorBoundary>
          <AdminLayout />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "rekening",
        element: <AccountsPage />,
      },
      {
        path: "laporan",
        element: <ReportsPage />,
      },
      {
        path: "transfer",
        element: <TransferPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./Context/ThemeContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="transaksiku-theme">
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
