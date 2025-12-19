import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import MataKuliahTable from "./MataKuliahTable";
import MataKuliahModal from "./MataKuliahModal";

// 1. Import Hooks React Query
import {
  useMataKuliah,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "@/Utils/Hooks/useMataKuliah";

// 2. Import Helper & Context
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MataKuliah = () => {
  const { user } = useAuthStateContext();
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // 3. Gunakan Hook Fetch
  const { data: mataKuliah = [], isLoading, isError } = useMataKuliah();

  // 4. Gunakan Hook Mutasi
  const { mutate: store } = useStoreMataKuliah();
  const { mutate: update } = useUpdateMataKuliah();
  const { mutate: remove } = useDeleteMataKuliah();

  const openAddModal = () => {
    setSelectedData(null);
    setModalOpen(true);
  };
  const openEditModal = (item) => {
    setSelectedData(item);
    setModalOpen(true);
  };

  // Logic Simpan
  const handleSubmit = (formData) => {
    if (selectedData) {
      // Update
      confirmUpdate(() => {
        update({ id: selectedData.id, data: formData });
        setModalOpen(false);
      });
    } else {
      // Create
      const isExist = mataKuliah.some((m) => m.kode === formData.kode);
      if (isExist) {
        toastError("Kode Mata Kuliah sudah ada!");
        return;
      }
      store(formData);
      setModalOpen(false);
    }
  };

  // Logic Hapus
  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  if (isError)
    return (
      <p className="text-red-500 text-center py-4">
        Gagal mengambil data mata kuliah.
      </p>
    );

  return (
    <>
      <MataKuliahModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedData={selectedData}
      />
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0">
            Daftar Mata Kuliah
          </Heading>

          {/* Cek Permission */}
          {user?.permission?.includes("matakuliah.create") && (
            <Button onClick={openAddModal}>+ Tambah MK</Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Memuat data...</p>
        ) : (
          <MataKuliahTable
            data={mataKuliah}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </>
  );
};

export default MataKuliah;
