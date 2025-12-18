import React, { useState, useEffect } from "react";

// Komponen UI
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";

// Child Components
import DosenTable from "./DosenTable";
import DosenModal from "./DosenModal";

// API & Helpers
import {
  getDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Dosen = () => {
  // --- STATE ---
  const [dosen, setDosen] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA (READ) ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getDosen();
      setDosen(res.data);
    } catch (error) {
      toastError("Gagal mengambil data dosen: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---

  const openAddModal = () => {
    setSelectedDosen(null);
    setModalOpen(true);
  };

  const openEditModal = (data) => {
    setSelectedDosen(data);
    setModalOpen(true);
  };

  // Logic Simpan (Create / Update)
  const handleSubmit = async (formData) => {
    try {
      if (selectedDosen) {
        // Mode Update
        confirmUpdate(async () => {
          await updateDosen(selectedDosen.id, formData);
          toastSuccess("Data dosen berhasil diperbarui!");
          setModalOpen(false);
          fetchData(); // Refresh tabel
        });
      } else {
        // Mode Create
        // Cek duplikasi NIDN di sisi frontend (opsional jika backend belum handle)
        const isExist = dosen.some((d) => d.nidn === formData.nidn);
        if (isExist) {
          toastError("NIDN sudah terdaftar!");
          return;
        }

        await storeDosen(formData);
        toastSuccess("Data dosen berhasil ditambahkan!");
        setModalOpen(false);
        fetchData(); // Refresh tabel
      }
    } catch (error) {
      toastError("Terjadi kesalahan saat menyimpan data.");
      console.error(error);
    }
  };

  // Logic Hapus (Delete)
  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteDosen(id);
        toastSuccess("Data dosen berhasil dihapus!");
        fetchData(); // Refresh tabel
      } catch (error) {
        toastError("Gagal menghapus data.");
      }
    });
  };

  return (
    <>
      <DosenModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedDosen={selectedDosen}
      />

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Dosen
          </Heading>
          <Button onClick={openAddModal}>+ Tambah Dosen</Button>
        </div>

        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Memuat data...</p>
        ) : (
          <DosenTable
            data={dosen}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </>
  );
};

export default Dosen;
