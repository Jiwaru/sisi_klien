import AxiosInstance from "@/Utils/AxiosInstance";

export const getMataKuliah = () => AxiosInstance.get("/matakuliah");
export const getMataKuliahById = (id) => AxiosInstance.get(`/matakuliah/${id}`);
export const storeMataKuliah = (data) =>
  AxiosInstance.post("/matakuliah", data);
export const updateMataKuliah = (id, data) =>
  AxiosInstance.put(`/matakuliah/${id}`, data);
export const deleteMataKuliah = (id) =>
  AxiosInstance.delete(`/matakuliah/${id}`);
