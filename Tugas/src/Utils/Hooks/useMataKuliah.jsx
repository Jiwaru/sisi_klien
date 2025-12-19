import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"; // 👈 Pastikan ejaan keepPreviousData benar
import {
  getMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// --- UPDATE BAGIAN FETCH INI (Pagination Support) ---
export const useMataKuliah = (params = {}) =>
  useQuery({
    queryKey: ["matakuliah", params],
    queryFn: () => getMataKuliah(params),
    placeholderData: keepPreviousData, // Agar transisi halaman mulus
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res.headers["x-total-count"] || 0),
    }),
  });

// --- BAGIAN MUTATION (Tetap Sama) ---
export const useStoreMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("MK berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambah MK."),
  });
};

export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMataKuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("MK berhasil diupdate!");
    },
    onError: () => toastError("Gagal update MK."),
  });
};

export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("MK berhasil dihapus!");
    },
    onError: () => toastError("Gagal hapus MK."),
  });
};
