import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"; // Pastikan import keepPreviousData
import {
  getDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// --- UPDATE BAGIAN INI (Fetch dengan Pagination) ---
export const useDosen = (params = {}) =>
  useQuery({
    queryKey: ["dosen", params], // Key dinamis ikut params
    queryFn: () => getDosen(params),
    placeholderData: keepPreviousData, // Agar transisi halaman mulus
    select: (res) => ({
      data: res?.data ?? [], // Ambil array data
      total: parseInt(res.headers["x-total-count"] || 0), // Ambil total dari header json-server
    }),
  });

// --- BAGIAN MUTATION (Tidak Perlu Diubah/Tetap Sama) ---
export const useStoreDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambah dosen."),
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil diupdate!");
    },
    onError: () => toastError("Gagal update dosen."),
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil dihapus!");
    },
    onError: () => toastError("Gagal hapus dosen."),
  });
};
