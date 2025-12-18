import React, { useState, useEffect } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import MataKuliahTable from "./MataKuliahTable";
import MataKuliahModal from "./MataKuliahModal";
import {
  getMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const MataKuliah = () => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getMataKuliah();
      setData(res.data);
    } catch (error) {
      toastError("Gagal mengambil data MK");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedData(item);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (selectedData) {
        confirmUpdate(async () => {
          await updateMataKuliah(selectedData.id, form);
          toastSuccess("Mata Kuliah diupdate");
          setModalOpen(false);
          fetchData();
        });
      } else {
        await storeMataKuliah(form);
        toastSuccess("Mata Kuliah ditambah");
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
        await deleteMataKuliah(id);
        toastSuccess("Mata Kuliah dihapus");
        fetchData();
      } catch (error) {
        toastError("Gagal menghapus data");
      }
    });
  };

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
          <Button onClick={openAddModal}>+ Tambah MK</Button>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <MataKuliahTable
            data={data}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </>
  );
};

export default MataKuliah;
