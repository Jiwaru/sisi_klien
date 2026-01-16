import React from "react";
import StatsCards from "./Components/StatsCards";
import AnalyticsCharts from "./Components/AnalyticsCharts";
import { Loader2 } from "lucide-react";
import {
  useDashboardStats,
  useDashboardTransactions,
} from "./Hooks/useDashboard";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: trx, isLoading: trxLoading } = useDashboardTransactions();

  if (statsLoading || trxLoading) {
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

      <StatsCards stats={stats} />

      <AnalyticsCharts transactions={trx} />
    </div>
  );
};

export default Dashboard;
