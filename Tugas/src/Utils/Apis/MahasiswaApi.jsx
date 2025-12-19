import AxiosInstance from "@/Utils/AxiosInstance";

export const getAllMahasiswa = () => AxiosInstance.get("/mahasiswa");

export const getMahasiswaById = (id) => AxiosInstance.get(`/mahasiswa/${id}`);

export const storeMahasiswa = (data) => AxiosInstance.post("/mahasiswa", data);

export const updateMahasiswa = (id, data) =>
  AxiosInstance.put(`/mahasiswa/${id}`, data);

export const deleteMahasiswa = (id) => AxiosInstance.delete(`/mahasiswa/${id}`);
