import React, { useState, useEffect } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getAllMahasiswa();
      setMahasiswa(res.data);
    } catch (error) {
      toastError("Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };
  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedMahasiswa) {
        confirmUpdate(async () => {
          await updateMahasiswa(selectedMahasiswa.id, formData);
          toastSuccess("Data diupdate!");
          setModalOpen(false);
          fetchData();
        });
      } else {
        await storeMahasiswa(formData);
        toastSuccess("Data ditambah!");
        setModalOpen(false);
        fetchData();
      }
    } catch (error) {
      toastError("Gagal menyimpan data");
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMahasiswa(id);
        toastSuccess("Data dihapus!");
        fetchData();
      } catch (error) {
        toastError("Gagal menghapus");
      }
    });
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
          <Heading as="h2" className="mb-0">
            Daftar Mahasiswa
          </Heading>

          {}
          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
          )}
        </div>

        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      </Card>
    </>
  );
};

export default Mahasiswa;
