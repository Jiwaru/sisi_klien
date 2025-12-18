// @/Utils/Apis/MahasiswaApi.js
import axios from "axios";

const BASE_URL = "http://localhost:3001";

// Create axios instance untuk konsistensi
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllMahasiswa = () => {
  return api.get("/mahasiswa");
};

export const getMahasiswa = (id) => {
  return api.get(`/mahasiswa/${id}`);
};

export const storeMahasiswa = (data) => {
  return api.post("/mahasiswa", data);
};

export const updateMahasiswa = (id, data) => {
  return api.put(`/mahasiswa/${id}`, data);
};

export const deleteMahasiswa = (id) => {
  return api.delete(`/mahasiswa/${id}`);
};
