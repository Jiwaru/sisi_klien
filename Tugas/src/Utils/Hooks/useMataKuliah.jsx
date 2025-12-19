import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMataKuliah = () =>
  useQuery({
    queryKey: ["matakuliah"],
    queryFn: getMataKuliah,
    select: (res) => res.data,
  });

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
