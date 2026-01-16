import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactions } from "@/Data/Dummy";

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useRecentTransfers = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      await delay(1000);
      return [...transactions]; // Return copy
    },
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferData) => {
      await delay(1500);

      const newTrx = {
        id: `TRX${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        description:
          transferData.catatan || `Transfer ke ${transferData.tujuan}`,
        amount: +transferData.nominal,
        type: "Transfer Keluar",
        status: "Berhasil",
        recipient: transferData.tujuan,
        category: "Lainnya",
      };

      // Update global dummy data
      transactions.unshift(newTrx);

      return newTrx;
    },
    onMutate: async (transferData) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTransactions = queryClient.getQueryData(["transactions"]);

      queryClient.setQueryData(["transactions"], (old) => {
        if (!old) return [];
        const newTrx = {
          id: `TEMP-${Date.now()}`,
          date: new Date().toISOString(),
          description:
            transferData.catatan || `Transfer ke ${transferData.tujuan}`,
          amount: +transferData.nominal,
          type: "Transfer Keluar",
          status: "Pending", // Optimistic status
          recipient: transferData.tujuan,
          category: "Lainnya",
        };
        return [newTrx, ...old];
      });

      return { previousTransactions };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions"],
          context.previousTransactions
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // Also invalidate dashboard transactions if they are different key
      queryClient.invalidateQueries({ queryKey: ["dashboardTransactions"] });
    },
  });
};
