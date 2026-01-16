import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useBulkDeleteAccounts,
} from "./Hooks/useAccounts";
import AccountFormModal from "./Components/AccountFormModal";
import Button from "@/Pages/Layouts/Components/Button";
import Input from "@/Pages/Layouts/Components/Input";
import Swal from "sweetalert2";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const AccountsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(""); // Immediate state
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced state for query
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  // Queries & Mutations
  const { data, isLoading } = useAccounts({ page, search: debouncedSearch });
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();
  const bulkDeleteMutation = useBulkDeleteAccounts();

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === data?.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data?.data.map((a) => a.id) || []);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((idx) => idx !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Rekening?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id, {
          onSuccess: () => toastSuccess("Rekening berhasil dihapus"),
        });
      }
    });
  };

  const handleBulkDelete = () => {
    Swal.fire({
      title: `Hapus ${selectedIds.length} Rekening?`,
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus Semua!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        bulkDeleteMutation.mutate(selectedIds, {
          onSuccess: () => {
            toastSuccess(`${selectedIds.length} rekening berhasil dihapus`);
            setSelectedIds([]);
          },
        });
      }
    });
  };

  const handleSave = (formData) => {
    if (editingAccount) {
      updateMutation.mutate(
        { ...formData, id: editingAccount.id },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingAccount(null);
            toastSuccess("Rekening berhasil diperbarui");
          },
          onError: (err) => toastError(err.message),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          toastSuccess("Rekening baru berhasil ditambahkan");
        },
        onError: (err) => toastError(err.message),
      });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Daftar Rekening
          </h2>
          <p className="text-gray-500 mt-1">
            Kelola daftar rekening tujuan transfer Anda.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              <Trash2 size={16} className="mr-2" />
              Hapus ({selectedIds.length})
            </Button>
          )}
          <Button
            onClick={() => {
              setEditingAccount(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} className="mr-2" />
            Tambah Rekening
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="Cari nama atau bank..."
            className="pl-10 border-none bg-gray-50 focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center text-indigo-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-[50px]">
                    <button
                      onClick={handleSelectAll}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      {data?.data.length > 0 &&
                      selectedIds.length === data?.data.length ? (
                        <CheckSquare size={20} />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Nama Pemilik
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Bank
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    No. Rekening
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Tidak ada data rekening ditemukan.
                    </td>
                  </tr>
                ) : (
                  data?.data.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleSelectOne(account.id)}
                          className={`text-gray-400 hover:text-indigo-600 ${
                            selectedIds.includes(account.id)
                              ? "text-indigo-600"
                              : ""
                          }`}
                        >
                          {selectedIds.includes(account.id) ? (
                            <CheckSquare size={20} />
                          ) : (
                            <Square size={20} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={account.avatar}
                            alt={account.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {account.name}
                            </p>
                            {account.favorite && (
                              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                Favorit
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                          {account.bank}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600">
                        {account.accountNumber}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingAccount(account);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(account.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Hal <span className="font-medium">{page}</span> dari{" "}
              {data.meta.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={page === data.meta.totalPages}
                onClick={() =>
                  setPage((p) => Math.min(data.meta.totalPages, p + 1))
                }
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AccountFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingAccount}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default AccountsPage;
