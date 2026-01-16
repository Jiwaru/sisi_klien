import { useQuery } from "@tanstack/react-query";
import { transactions } from "@/Data/Dummy";
import {
  startOfDay,
  endOfDay,
  isWithinInterval,
  parseISO,
  subDays,
} from "date-fns";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useReports = ({ filters }) => {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: async () => {
      await delay(800);

      let filteredData = [...transactions];

      if (filters.startDate && filters.endDate) {
        filteredData = filteredData.filter((t) => {
          const tDate = parseISO(t.date);
          return isWithinInterval(tDate, {
            start: startOfDay(filters.startDate),
            end: endOfDay(filters.endDate),
          });
        });
      }

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

      if (filters.status && filters.status !== "All") {
        filteredData = filteredData.filter((t) => t.status === filters.status);
      }

      const trendMap = {};
      filteredData.forEach((t) => {
        const dateKey = t.date.split("T")[0];
        if (!trendMap[dateKey]) trendMap[dateKey] = 0;
        trendMap[dateKey] += t.amount;
      });

      const trendChartData = Object.keys(trendMap)
        .map((date) => ({
          date,
          total: trendMap[date],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const statusMap = {};
      filteredData.forEach((t) => {
        if (!statusMap[t.status]) statusMap[t.status] = 0;
        statusMap[t.status] += 1;
      });
      const statusChartData = Object.keys(statusMap).map((status) => ({
        name: status,
        value: statusMap[status],
      }));

      const recipientMap = {};
      filteredData
        .filter(
          (t) =>
            (t.type === "Transfer Keluar" || t.type === "Pembayaran") &&
            t.recipient !== "Transaksiku"
        )
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
        .slice(0, 5);

      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      const sixtyDaysAgo = subDays(today, 60);

      const currentMonthCats = {};
      const prevMonthCats = {};

      transactions.forEach((t) => {
        const tDate = parseISO(t.date);

        if (
          t.type === "Transfer Keluar" ||
          t.type === "Pembayaran" ||
          t.category !== "Lainnya"
        ) {
          if (isWithinInterval(tDate, { start: thirtyDaysAgo, end: today })) {
            if (!currentMonthCats[t.category]) currentMonthCats[t.category] = 0;
            currentMonthCats[t.category] += t.amount;
          } else if (
            isWithinInterval(tDate, { start: sixtyDaysAgo, end: thirtyDaysAgo })
          ) {
            if (!prevMonthCats[t.category]) prevMonthCats[t.category] = 0;
            prevMonthCats[t.category] += t.amount;
          }
        }
      });

      const allCategories = new Set([
        ...Object.keys(currentMonthCats),
        ...Object.keys(prevMonthCats),
      ]);

      const radarChartData = Array.from(allCategories).map((cat) => ({
        subject: cat,
        A: currentMonthCats[cat] || 0,
        B: prevMonthCats[cat] || 0,
        fullMark:
          Math.max(
            ...Object.values(currentMonthCats),
            ...Object.values(prevMonthCats)
          ) * 1.2,
      }));

      let currentBalance = 10000000;
      const sortedForBalance = [...filteredData].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const balanceHistory = sortedForBalance.map((t) => {
        if (t.type === "Transfer Masuk" || t.type === "Top Up") {
          currentBalance += t.amount;
        } else {
          currentBalance -= t.amount;
        }
        return {
          date: t.date,
          balance: currentBalance,
        };
      });

      return {
        transactions: filteredData,
        charts: {
          trend: trendChartData,
          status: statusChartData,
          recipients: recipientChartData,
          radar: radarChartData,
          balance: balanceHistory,
        },
      };
    },
    keepPreviousData: true,
    placeholderData: (prev) => prev,
  });
};
