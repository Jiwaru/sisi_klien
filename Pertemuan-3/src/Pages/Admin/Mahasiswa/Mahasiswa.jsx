import React, { useState } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableMahasiswa from "@/Pages/admin/Mahasiswa/TableMahasiswa";
import ModalMahasiswa from "@/Pages/admin/Mahasiswa/ModalMahasiswa";
import { mahasiswaList } from "@/Data/Dummy";
import { useNavigate } from "react-router-dom";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState(mahasiswaList);
  const [form, setForm] = useState({ nim: "", nama: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  // Tambah data mahasiswa
  const addMahasiswa = (data) => {
    setMahasiswa([...mahasiswa, data]);
  };

  // Update data mahasiswa
  const updateMahasiswa = (nim, newData) => {
    setMahasiswa(
      mahasiswa.map((mhs) => (mhs.nim === nim ? { ...mhs, ...newData } : mhs))
    );
  };

  // Delete data mahasiswa
  const deleteMahasiswa = (nim) => {
    setMahasiswa(mahasiswa.filter((mhs) => mhs.nim !== nim));
  };

  // Handle perubahan input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Buka modal untuk tambah data
  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nim: "", nama: "" });
    setIsEdit(false);
  };

  // Handle buka modal untuk edit
  const handleEdit = (mhs) => {
    setForm({ nim: mhs.nim, nama: mhs.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // Handle submit, untuk tambah atau edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama) {
      toastError("NIM dan Nama wajib diisi");
      return;
    }
    if (isEdit) {
      confirmUpdate(() => {
        updateMahasiswa(form.nim, form);
        toastSuccess("Data berhasil diperbarui");
        setForm({ nim: "", nama: "" });
        setIsEdit(false);
        setIsModalOpen(false);
      });
    } else {
      const exists = mahasiswa.find((m) => m.nim === form.nim);
      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      addMahasiswa(form);
      toastSuccess("Data berhasil ditambahkan");
      setForm({ nim: "", nama: "" });
      setIsEdit(false);
      setIsModalOpen(false);
    }
  };

  // Handle hapus data
  const handleDelete = (nim) => {
    confirmDelete(() => {
      deleteMahasiswa(nim);
      toastSuccess("Data berhasil dihapus");
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
      <TableMahasiswa
        data={mahasiswa}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
      />
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
