import React, { useState, useEffect } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import { mahasiswaList } from "@/Data/Dummy";

import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setMahasiswa(mahasiswaList.map((m) => ({ ...m, status: "Aktif" })));
  }, []);

  const storeMahasiswa = (payload) => {
    const isExist = mahasiswa.some((m) => m.nim === payload.nim);
    if (isExist) {
      alert("NIM sudah terdaftar!");
      return;
    }
    setMahasiswa([...mahasiswa, payload]);
    alert("Berhasil menambahkan data!");
  };

  const updateMahasiswa = (payload) => {
    const updatedData = mahasiswa.map((item) =>
      item.nim === payload.nim ? payload : item
    );
    setMahasiswa(updatedData);
    alert("Berhasil memperbarui data!");
  };

  const deleteMahasiswa = (nim) => {
    const filteredData = mahasiswa.filter((item) => item.nim !== nim);
    setMahasiswa(filteredData);
    alert("Data berhasil dihapus!");
  };

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const handleDelete = (nim) => {
    if (confirm(`Yakin ingin menghapus NIM ${nim}?`)) {
      deleteMahasiswa(nim);
    }
  };

  const handleSubmit = (formData) => {
    if (selectedMahasiswa) {
      updateMahasiswa(formData);
    } else {
      storeMahasiswa(formData);
    }
  };

  return (
    <>
      {}
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

        {}
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
