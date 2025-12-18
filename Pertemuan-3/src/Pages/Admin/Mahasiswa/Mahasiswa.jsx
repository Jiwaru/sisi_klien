import React, { useState, useEffect } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableMahasiswa from "@/Pages/admin/Mahasiswa/TableMahasiswa";
import ModalMahasiswa from "@/Pages/admin/Mahasiswa/ModalMahasiswa";
import { useNavigate } from "react-router-dom";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]); // PENTING: inisialisasi dengan array kosong
  const [form, setForm] = useState({ id: "", nim: "", nama: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const res = await getAllMahasiswa();

      console.log("=== DEBUG INFO ===");
      console.log("Response:", res);
      console.log("Response.data:", res.data);
      console.log("Is Array?", Array.isArray(res.data));
      console.log("Array length:", res.data?.length);
      console.log("First item:", res.data?.[0]);

      if (Array.isArray(res.data)) {
        console.log("✓ Setting mahasiswa state:", res.data);
        setMahasiswa(res.data);
      } else {
        console.log("✗ Data is not an array");
        setMahasiswa([]);
        toastError("Format data tidak valid");
      }
    } catch (error) {
      console.error("Error fetching:", error);
      toastError("Gagal memuat data mahasiswa");
      setMahasiswa([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ id: "", nim: "", nama: "" });
    setIsEdit(false);
  };

  const openEditModal = (mhs) => {
    setForm({ id: mhs.id, nim: mhs.nim, nama: mhs.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nim || !form.nama) {
      toastError("NIM dan Nama wajib diisi");
      return;
    }

    try {
      if (isEdit) {
        confirmUpdate(async () => {
          await updateMahasiswa(form.id, form);
          await fetchMahasiswa();
          toastSuccess("Data berhasil diperbarui");
          setForm({ id: "", nim: "", nama: "" });
          setIsEdit(false);
          setIsModalOpen(false);
        });
      } else {
        await storeMahasiswa(form);
        await fetchMahasiswa();
        toastSuccess("Data berhasil ditambahkan");
        setForm({ id: "", nim: "", nama: "" });
        setIsEdit(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      toastError(isEdit ? "Gagal memperbarui data" : "Gagal menambahkan data");
      console.error("Error submitting data:", error);
    }
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await deleteMahasiswa(id);
        await fetchMahasiswa();
        toastSuccess("Data berhasil dihapus");
      } catch (error) {
        toastError("Gagal menghapus data");
        console.error("Error deleting mahasiswa:", error);
      }
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <TableMahasiswa
          data={mahasiswa}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
        />
      )}

      <ModalMahasiswa
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default Mahasiswa;
