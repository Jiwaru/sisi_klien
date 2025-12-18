import axios from "@/Utils/AxiosInstance";

export const getDosen = () => axios.get("/dosen");
export const storeDosen = (data) => axios.post("/dosen", data);
export const updateDosen = (id, data) => axios.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => axios.delete(`/dosen/${id}`);
