import AxiosInstance from "@/Utils/AxiosInstance";

export const getMataKuliah = (params) =>
  AxiosInstance.get("/matakuliah", { params });

export const storeMataKuliah = (data) =>
  AxiosInstance.post("/matakuliah", data);
export const updateMataKuliah = (id, data) =>
  AxiosInstance.put(`/matakuliah/${id}`, data);
export const deleteMataKuliah = (id) =>
  AxiosInstance.delete(`/matakuliah/${id}`);
