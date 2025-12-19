import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  getMahasiswaById,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// 1. Fetch All
export const useMahasiswa = () =>
  useQuery({
    queryKey: ["mahasiswa"], // Key unik untuk cache
    queryFn: getAllMahasiswa,
    select: (res) => res.data, // Ambil data langsung dari response
  });

// 2. Fetch By ID (Detail)
export const useMahasiswaDetail = (id) =>
  useQuery({
    queryKey: ["mahasiswa", id],
    queryFn: () => getMahasiswaById(id),
    select: (res) => res.data,
    enabled: !!id, // Hanya jalan jika ID ada
  });

// 3. Tambah Data
export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      // Refresh data otomatis setelah sukses
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: (err) => toastError("Gagal menambah data: " + err.message),
  });
};

// 4. Update Data
export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil diupdate!");
    },
    onError: (err) => toastError("Gagal update data: " + err.message),
  });
};

// 5. Hapus Data
export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil dihapus!");
    },
    onError: (err) => toastError("Gagal menghapus data: " + err.message),
  });
};
