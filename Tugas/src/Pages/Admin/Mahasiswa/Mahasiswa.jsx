import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: mahasiswa = [], isLoading, isError } = useMahasiswa();

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };
  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedMahasiswa) {
      confirmUpdate(() => {
        update({ id: selectedMahasiswa.id, data: formData });
        setModalOpen(false);
      });
    } else {
      const isExist = mahasiswa.some((m) => m.nim === formData.nim);
      if (isExist) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      store(formData);
      setModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  if (isError) return <p className="text-red-500">Gagal mengambil data.</p>;

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
          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
          )}
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
