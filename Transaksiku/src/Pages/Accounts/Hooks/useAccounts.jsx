import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savedAccounts } from "@/Data/Dummy";

// Simulated API calls with delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get Accounts with Filtering/Pagination logic simulation
export const useAccounts = ({ page, search }) => {
  return useQuery({
    queryKey: ["accounts", { page, search }],
    queryFn: async () => {
      await delay(800);
      let data = [...savedAccounts];

      if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter(
          (acc) =>
            acc.name.toLowerCase().includes(lowerSearch) ||
            acc.bank.toLowerCase().includes(lowerSearch)
        );
      }

      // Pagination simulated (10 per page)
      const itemsPerPage = 8;
      const totalPages = Math.ceil(data.length / itemsPerPage);
      const paginatedData = data.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      );

      return {
        data: paginatedData,
        meta: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: data.length,
        },
      };
    },
    placeholderData: (previousData) => previousData,
  });
};

// Create Account Hook
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAccount) => {
      await delay(1000);
      // Simulate backend validation
      const exists = savedAccounts.find(
        (a) => a.accountNumber === newAccount.accountNumber
      );
      if (exists) throw new Error("Nomor rekening sudah terdaftar!");

      const created = {
        ...newAccount,
        id: `ACC${Date.now()}`,
        avatar: `https://ui-avatars.com/api/?name=${newAccount.name}&background=random`,
      };

      // Mutate local dummy data (since we don't have a real backend)
      savedAccounts.unshift(created);

      return created;
    },
    onSuccess: () => {
      // Invalidate queries to refresh list
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

// Update Account Hook
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedAccount) => {
      await delay(1000);
      const index = savedAccounts.findIndex((a) => a.id === updatedAccount.id);
      if (index === -1) throw new Error("Akun tidak ditemukan");

      savedAccounts[index] = { ...savedAccounts[index], ...updatedAccount };
      return savedAccounts[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

// Delete Account Hook
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountId) => {
      await delay(800);
      const index = savedAccounts.findIndex((a) => a.id === accountId);
      if (index !== -1) savedAccounts.splice(index, 1);
      return accountId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

// Bulk Delete Hook
export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountIds) => {
      await delay(1000);
      accountIds.forEach((id) => {
        const index = savedAccounts.findIndex((a) => a.id === id);
        if (index !== -1) savedAccounts.splice(index, 1);
      });
      return accountIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
