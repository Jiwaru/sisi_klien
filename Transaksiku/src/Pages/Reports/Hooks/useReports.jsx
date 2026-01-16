import { useQuery } from "@tanstack/react-query";
import { transactions } from "@/Data/Dummy";
import {
  startOfDay,
  endOfDay,
  isWithinInterval,
  parseISO,
  subDays,
} from "date-fns";

// Mock API Delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useReports = ({ filters }) => {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: async () => {
      await delay(800); // Simulate network latency

      let filteredData = [...transactions];

      // 1. Filter by Date Range
      if (filters.startDate && filters.endDate) {
        filteredData = filteredData.filter((t) => {
          // Parse dummy date "YYYY-MM-DD"
          const tDate = parseISO(t.date);
          return isWithinInterval(tDate, {
            start: startOfDay(filters.startDate),
            end: endOfDay(filters.endDate),
          });
        });
      }

      // 2. Filter by Nominal (Min-Max)
      if (filters.minAmount) {
        filteredData = filteredData.filter(
          (t) => t.amount >= Number(filters.minAmount)
        );
      }
      if (filters.maxAmount) {
        filteredData = filteredData.filter(
          (t) => t.amount <= Number(filters.maxAmount)
        );
      }

      // 3. Filter by Status
      if (filters.status && filters.status !== "All") {
        filteredData = filteredData.filter((t) => t.status === filters.status);
      }

      // --- Aggregations for Charts ---

      // A. Trend (Line Chart) - Daily Total Amount
      // Group by Date
      const trendMap = {};
      filteredData.forEach((t) => {
        if (!trendMap[t.date]) trendMap[t.date] = 0;
        trendMap[t.date] += t.amount;
      });
      // Convert to array and sort
      const trendChartData = Object.keys(trendMap)
        .map((date) => ({
          date,
          total: trendMap[date],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // B. Status Distribution (Pie Chart)
      const statusMap = {};
      filteredData.forEach((t) => {
        if (!statusMap[t.status]) statusMap[t.status] = 0;
        statusMap[t.status] += 1; // Count
      });
      const statusChartData = Object.keys(statusMap).map((status) => ({
        name: status,
        value: statusMap[status],
      }));

      // C. Top Recipients (Bar Chart) - Only for "Keluar" type usually, or all
      const recipientMap = {};
      filteredData
        .filter((t) => t.recipient !== "Transaksiku" && t.type === "Keluar")
        .forEach((t) => {
          if (!recipientMap[t.recipient]) recipientMap[t.recipient] = 0;
          recipientMap[t.recipient] += t.amount;
        });
      const recipientChartData = Object.keys(recipientMap)
        .map((r) => ({
          name: r,
          amount: recipientMap[r],
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5); // Top 5

      // D. Radar Chart (Category Analysis)
      // Compare average amount per category vs count or similar
      const categoryMap = {};
      filteredData.forEach((t) => {
        if (!categoryMap[t.category])
          categoryMap[t.category] = { count: 0, total: 0 };
        categoryMap[t.category].count += 1;
        categoryMap[t.category].total += t.amount;
      });
      const radarChartData = Object.keys(categoryMap).map((cat) => ({
        subject: cat,
        A: categoryMap[cat].count, // Frequency
        B: categoryMap[cat].total / 10000, // Scaled amount for visibility
        fullMark: 100, // arbitrary
      }));

      return {
        transactions: filteredData,
        charts: {
          trend: trendChartData,
          status: statusChartData,
          recipients: recipientChartData,
          radar: radarChartData,
        },
      };
    },
    keepPreviousData: true, // Should be placeholderData in v5, I will use placeholderData pattern
    placeholderData: (prev) => prev,
  });
};
