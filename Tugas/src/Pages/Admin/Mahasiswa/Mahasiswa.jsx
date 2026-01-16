import React, { useState } from "react";
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Input from "@/Pages/Auth/Components/Input";

// Import Component
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // --- State Pagination & Search ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");

  // --- 1. Fetch Data (Dengan Safe Check) ---
  const { data: result, isLoading } = useMahasiswa({
    _page: page,
    _limit: limit,
    q: search,
  });

  // 👇 FIX UTAMA: Pastikan data selalu Array (Handling Pagination Object)
  // Jika result adalah array, pakai langsung. Jika object pagination, ambil .data. Jika null, pakai [].
  const mahasiswa = Array.isArray(result) ? result : result?.data || [];

  const totalItems = result?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // --- Mutations ---
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  // --- Handlers ---
  const openAddModal = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedData(item);
    setModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedData) {
      // Update
      confirmUpdate(() => {
        update({ id: selectedData.id, data: formData });
        setModalOpen(false);
        toastSuccess("Data berhasil diperbarui");
      });
    } else {
      // Create
      // Cek duplikasi NIM sederhana di client side (optional)
      const isExist = mahasiswa.some((m) => m.nim === formData.nim);
      if (isExist) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      store(formData);
      setModalOpen(false);
      toastSuccess("Data berhasil ditambahkan");
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
      toastSuccess("Data berhasil dihapus");
    });
  };

  // --- Pagination Handlers ---
  const handlePrev = () => setPage((old) => Math.max(old - 1, 1));
  const handleNext = () => setPage((old) => Math.min(old + 1, totalPages));

  return (
    <>
      <MahasiswaModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedData={selectedData}
      />

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Heading as="h2" className="mb-0">
            Daftar Mahasiswa
          </Heading>

          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={openAddModal}>+ Tambah</Button>
          )}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Input
              placeholder="Cari Nama / NIM..."
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
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 / hal</option>
              <option value={10}>10 / hal</option>
              <option value={20}>20 / hal</option>
            </select>
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Total: <b>{totalItems}</b> Data
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <p className="text-center py-8 text-gray-500">Memuat data...</p>
        ) : (
          <>
            <MahasiswaTable
              data={mahasiswa} // Data yang dikirim sudah aman (pasti Array)
              openEditModal={openEditModal}
              onDelete={handleDelete}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Halaman <b>{page}</b> dari <b>{totalPages}</b>
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
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default Mahasiswa;
