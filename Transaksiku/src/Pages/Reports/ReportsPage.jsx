import React, { useState } from "react";
import {
  LineChart,
  Line,
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart,
} from "recharts";
import {
  Filter,
  Download,
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";

import { useReports } from "./Hooks/useReports";
import withChartContainer from "@/Pages/Layouts/Components/withChartContainer";
import Button from "@/Pages/Layouts/Components/Button";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import { formatCurrency } from "@/Utils/Helpers/FormatHelpers";

// HOC-wrapped Charts
const ChartLine = withChartContainer(LineChart);
const ChartBar = withChartContainer(BarChart);
const ChartPie = withChartContainer(PieChart);
const ChartRadar = withChartContainer(RadarChart);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    startDate: "2024-01-01", // Default to beginning of year mainly for dummy data coverage
    endDate: new Date().toISOString().split("T")[0],
    minAmount: "",
    maxAmount: "",
    status: "All",
  });

  const { data, isLoading } = useReports({ filters });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Generating Analytics...</p>
        </div>
      </div>
    );
  }

  const { charts, transactions } = data;

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Laporan & Analitik
          </h2>
          <p className="text-gray-500 mt-1">
            Analisis mendalam transaksi dan performa keuangan.
          </p>
        </div>
        <Button variant="secondary">
          <Download size={18} className="mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Filters Section (Compound Component Concept could be applied here conceptually) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold border-b border-gray-50 pb-2">
          <Filter size={20} />
          <h3>Filter Data</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label>Mulai Tanggal</Label>
            <Input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label>Sampai Tanggal</Label>
            <Input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label>Min. Nominal</Label>
            <Input
              type="number"
              name="minAmount"
              placeholder="0"
              value={filters.minAmount}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label>Max. Nominal</Label>
            <Input
              type="number"
              name="maxAmount"
              placeholder="∞"
              value={filters.maxAmount}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mt-1 bg-white"
            >
              <option value="All">Semua</option>
              <option value="Berhasil">Berhasil</option>
              <option value="Pending">Pending</option>
              <option value="Gagal">Gagal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart (Line) */}
        <ChartLine
          title="Tren Transaksi (Harian)"
          data={charts.trend}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(d) => d.split("-").slice(1).join("/")}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => formatCurrency(value)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Total Transaksi"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 4, fill: "#4F46E5" }}
            activeDot={{ r: 6 }}
          />
        </ChartLine>

        {/* Status Distribution (Pie) */}
        <ChartPie title="Distribusi Status Transaksi" data={charts.status}>
          <Pie
            data={charts.status}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {charts.status.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </ChartPie>

        {/* Top Recipients (Bar) */}
        <ChartBar
          title="Top 5 Penerima Transfer"
          data={charts.recipients}
          layout="vertical"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => formatCurrency(value)}
          />
          <Bar
            dataKey="amount"
            name="Total Dikirim"
            fill="#10B981"
            radius={[0, 4, 4, 0]}
            barSize={20}
          />
        </ChartBar>

        {/* Radar Chart (Category Analysis) */}
        <ChartRadar
          title="Analisis Kategori (Frekuensi vs Nominal)"
          data={charts.radar}
        >
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: "#6B7280" }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} hide />
          <Radar
            name="Frekuensi Trx"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Nominal (Scaled)"
            dataKey="B"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Legend />
          <Tooltip />
        </ChartRadar>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Rincian Transaksi</h3>
          <span className="text-sm text-gray-400">
            Total: {transactions.length} items
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Keterangan
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Tipe
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold text-right">
                  Nominal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {trx.date}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {trx.description}
                      </p>
                      <span className="text-xs text-gray-400">
                        {trx.recipient}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          trx.type === "Masuk"
                            ? "bg-green-100 text-green-700"
                            : trx.type === "Keluar"
                            ? "bg-red-100 text-red-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            trx.status === "Berhasil"
                              ? "bg-green-500"
                              : trx.status === "Pending"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-sm text-gray-600">
                          {trx.status}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold text-right ${
                        trx.type === "Masuk"
                          ? "text-green-600"
                          : "text-gray-800"
                      }`}
                    >
                      {trx.type === "Masuk" ? "+" : ""}{" "}
                      {formatCurrency(trx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
