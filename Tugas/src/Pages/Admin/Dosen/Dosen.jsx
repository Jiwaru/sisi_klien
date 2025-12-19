import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import DosenTable from "./DosenTable";
import DosenModal from "./DosenModal";

import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "@/Utils/Hooks/useDosen";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Dosen = () => {
  const { user } = useAuthStateContext();
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: dosen = [], isLoading, isError } = useDosen();

  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();

  const openAddModal = () => {
    setSelectedDosen(null);
    setModalOpen(true);
  };
  const openEditModal = (data) => {
    setSelectedDosen(data);
    setModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedDosen) {
      confirmUpdate(() => {
        update({ id: selectedDosen.id, data: formData });
        setModalOpen(false);
      });
    } else {
      const isExist = dosen.some((d) => d.nidn === formData.nidn);
      if (isExist) {
        toastError("NIDN sudah terdaftar!");
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

  if (isError)
    return (
      <p className="text-red-500 text-center py-4">
        Gagal mengambil data dosen.
      </p>
    );

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
          {user?.permission?.includes("dosen.create") && (
            <Button onClick={openAddModal}>+ Tambah Dosen</Button>
          )}
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
