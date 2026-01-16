import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#6366F1",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-xl border border-gray-100">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = ({ transactions }) => {
  // 1. Process Data for Last 7 Days (Line Chart)
  const last7DaysData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const dayTransactions = transactions.filter((t) =>
        t.date.startsWith(dateStr)
      );
      const income = dayTransactions
        .filter((t) => t.type === "Transfer Masuk")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions
        .filter((t) => t.type !== "Transfer Masuk")
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        Masuk: income,
        Keluar: expense,
      });
    }
    return data;
  }, [transactions]);

  // 2. Process Data for Categories (Pie Chart)
  const categoryData = useMemo(() => {
    const counts = {};
    transactions.forEach((t) => {
      if (t.type !== "Transfer Masuk") {
        // Only expenses/outbound
        counts[t.category] = (counts[t.category] || 0) + t.amount;
      }
    });
    return Object.keys(counts)
      .map((key) => ({
        name: key,
        value: counts[key],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 3. Process Data for Comparison (Bar Chart - Income vs Expense)
  const comparisonData = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "Transfer Masuk")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type !== "Transfer Masuk")
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      { name: "Pemasukan", value: income },
      { name: "Pengeluaran", value: expense },
    ];
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 7 Day History */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Aktivitas 7 Hari Terakhir
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7DaysData} margin={{ left: 20 }}>
              <defs>
                <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B" }}
                tickFormatter={(value) => `Rp${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="Masuk"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMasuk)"
              />
              <Area
                type="monotone"
                dataKey="Keluar"
                stroke="#EF4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorKeluar)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Kategori Pengeluaran
        </h3>
        <div className="h-[300px] w-full flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income vs Expense Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Pemasukan vs Pengeluaran
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B" }}
                tickFormatter={(value) => `Rp${value / 1000000}jt`}
              />
              <Tooltip
                cursor={{ fill: "#F1F5F9" }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Pemasukan" ? "#10B981" : "#EF4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
