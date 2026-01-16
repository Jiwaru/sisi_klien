import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savedAccounts } from "@/Data/Dummy";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAccount) => {
      await delay(1000);

      const exists = savedAccounts.find(
        (a) => a.accountNumber === newAccount.accountNumber
      );
      if (exists) throw new Error("Nomor rekening sudah terdaftar!");

      const created = {
        ...newAccount,
        id: `ACC${Date.now()}`,
        avatar: `https://ui-avatars.com/api/?name=${newAccount.name}&background=random`,
      };

      savedAccounts.unshift(created);
      return created;
    },
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });

      const previousAccounts = queryClient.getQueriesData({
        queryKey: ["accounts"],
      });

      queryClient.setQueriesData({ queryKey: ["accounts"] }, (old) => {
        if (!old) return old;
        const tempAccount = {
          ...newAccount,
          id: `TEMP-${Date.now()}`,
          avatar: `https://ui-avatars.com/api/?name=${newAccount.name}&background=random`,
          isOptimistic: true,
        };
        return {
          ...old,
          data: [tempAccount, ...old.data],
          meta: {
            ...old.meta,
            totalItems: old.meta.totalItems + 1,
          },
        };
      });

      return { previousAccounts };
    },
    onError: (err, newAccount, context) => {
      if (context?.previousAccounts) {
        context.previousAccounts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

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
    onMutate: async (updatedAccount) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });
      const previousAccounts = queryClient.getQueriesData({
        queryKey: ["accounts"],
      });

      queryClient.setQueriesData({ queryKey: ["accounts"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((account) =>
            account.id === updatedAccount.id
              ? { ...account, ...updatedAccount }
              : account
          ),
        };
      });

      return { previousAccounts };
    },
    onError: (err, updatedAccount, context) => {
      if (context?.previousAccounts) {
        context.previousAccounts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountId) => {
      await delay(800);
      const index = savedAccounts.findIndex((a) => a.id === accountId);
      if (index !== -1) savedAccounts.splice(index, 1);
      return accountId;
    },
    onMutate: async (accountId) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });
      const previousAccounts = queryClient.getQueriesData({
        queryKey: ["accounts"],
      });

      queryClient.setQueriesData({ queryKey: ["accounts"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((account) => account.id !== accountId),
        };
      });

      return { previousAccounts };
    },
    onError: (err, variables, context) => {
      if (context?.previousAccounts) {
        context.previousAccounts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

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
    onMutate: async (accountIds) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });
      const previousAccounts = queryClient.getQueriesData({
        queryKey: ["accounts"],
      });

      queryClient.setQueriesData({ queryKey: ["accounts"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((account) => !accountIds.includes(account.id)),
        };
      });

      return { previousAccounts };
    },
    onError: (err, variables, context) => {
      if (context?.previousAccounts) {
        context.previousAccounts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
