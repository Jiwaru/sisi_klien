import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAllMahasiswa,
  getMahasiswaById,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMahasiswa = (params = {}) =>
  useQuery({
    queryKey: ["mahasiswa", params],
    queryFn: () => getAllMahasiswa(params),
    placeholderData: keepPreviousData,
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res.headers["x-total-count"] || 0),
    }),
  });

export const useMahasiswaDetail = (id) =>
  useQuery({
    queryKey: ["mahasiswa", id],
    queryFn: () => getMahasiswaById(id),
    select: (res) => res.data,
    enabled: !!id,
  });

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: (err) => toastError("Gagal menambah data: " + err.message),
  });
};

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
