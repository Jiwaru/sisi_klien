import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Input from "@/Pages/Auth/Components/Input";
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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const {
    data: result = { data: [], total: 0 },
    isLoading,
    isError,
  } = useMahasiswa({
    _page: page,
    _limit: limit,
    q: search,
    _sort: sortBy,
    _order: sortOrder,
  });

  const mahasiswa = result.data;
  const totalPages = Math.ceil(result.total / limit);

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
      store(formData);
      setModalOpen(false);
    }
  };

  const handleDelete = (id) => confirmDelete(() => remove(id));

  const handlePrev = () => setPage((old) => Math.max(old - 1, 1));
  const handleNext = () => setPage((old) => Math.min(old + 1, totalPages));

  return (
    <>
      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Heading as="h2" className="mb-0">
            Daftar Mahasiswa
          </Heading>
          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={openAddModal}>+ Tambah</Button>
          )}
        </div>

        {}
        <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Cari..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-64"
            />
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border p-2 rounded"
            >
              <option value={5}>5 / hal</option>
              <option value={10}>10 / hal</option>
              <option value={20}>20 / hal</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Total: {result.total} Data
          </div>
        </div>

        {}
        {isLoading ? (
          <p className="text-center py-4">Memuat data...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              openEditModal={openEditModal}
              onDelete={handleDelete}
            />

            {}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">
                Halaman {page} dari {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrev}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNext}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default Mahasiswa;
