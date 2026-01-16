import React, { useState, useEffect } from "react";
import StatsCards from "./Components/StatsCards";
import AnalyticsCharts from "./Components/AnalyticsCharts";
import { dashboardStats, transactions } from "@/Data/Dummy";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API load
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 mt-1">
          Selamat datang kembali, Admin Transaksiku.
        </p>
      </div>

      <StatsCards stats={dashboardStats} />

      <AnalyticsCharts transactions={transactions} />
    </div>
  );
};

export default Dashboard;
