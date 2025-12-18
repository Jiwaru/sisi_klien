import React, { useState, useEffect } from "react";

// Komponen UI
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";

// Child Components
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";

// API & Helpers (REFACTOR DI SINI)
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Mahasiswa = () => {
  // --- STATE ---
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA (READ) ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getAllMahasiswa();
      setMahasiswa(res.data);
    } catch (error) {
      toastError("Gagal mengambil data mahasiswa");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  // Logic Hapus (Delete)
  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMahasiswa(id);
        toastSuccess("Data mahasiswa berhasil dihapus!");
        fetchData(); // Refresh data dari server
      } catch (error) {
        toastError("Gagal menghapus data.");
      }
    });
  };

  // Logic Submit (Create / Update)
  const handleSubmit = async (formData) => {
    try {
      if (selectedMahasiswa) {
        // Mode Update
        confirmUpdate(async () => {
          await updateMahasiswa(selectedMahasiswa.id, formData);
          toastSuccess("Data berhasil diperbarui!");
          setModalOpen(false);
          fetchData(); // Refresh data
        });
      } else {
        // Mode Create
        // Cek duplikasi NIM (Opsional: Backend json-server tidak otomatis cek unique field selain id)
        const isExist = mahasiswa.some((m) => m.nim === formData.nim);
        if (isExist) {
          toastError("NIM sudah terdaftar!");
          return;
        }

        await storeMahasiswa(formData);
        toastSuccess("Data berhasil ditambahkan!");
        setModalOpen(false);
        fetchData(); // Refresh data
      }
    } catch (error) {
      toastError("Terjadi kesalahan saat menyimpan data.");
      console.error(error);
    }
  };

  return (
    <>
      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>
          <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
        </div>

        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Memuat data...</p>
        ) : (
          <MahasiswaTable
            mahasiswa={mahasiswa}
            openEditModal={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </>
  );
};

export default Mahasiswa;
