import AxiosInstance from "@/Utils/AxiosInstance";

export const getDosen = (params) => AxiosInstance.get("/dosen", { params });

export const storeDosen = (data) => AxiosInstance.post("/dosen", data);
export const updateDosen = (id, data) =>
  AxiosInstance.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => AxiosInstance.delete(`/dosen/${id}`);
