import AxiosInstance from "@/Utils/AxiosInstance";

// Ambil semua mahasiswa
export const getAllMahasiswa = () => AxiosInstance.get("/mahasiswa");

// Ambil 1 mahasiswa by ID
export const getMahasiswaById = (id) => AxiosInstance.get(`/mahasiswa/${id}`);

// Tambah mahasiswa
export const storeMahasiswa = (data) => AxiosInstance.post("/mahasiswa", data);

// Update mahasiswa
export const updateMahasiswa = (id, data) =>
  AxiosInstance.put(`/mahasiswa/${id}`, data);

// Hapus mahasiswa
export const deleteMahasiswa = (id) => AxiosInstance.delete(`/mahasiswa/${id}`);
