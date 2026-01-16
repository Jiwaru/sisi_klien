import { useQuery } from "@tanstack/react-query";
import { dashboardStats, transactions } from "@/Data/Dummy";

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      await delay(1000); // Simulate network latency
      return dashboardStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardTransactions = () => {
  return useQuery({
    queryKey: ["dashboardTransactions"],
    queryFn: async () => {
      await delay(1200); // Simulate slightly different latency
      // Return top 5 recent transactions for example, or all if the component filters them
      return transactions;
    },
    staleTime: 5 * 60 * 1000,
  });
};
