import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Input from "@/Pages/Auth/Components/Input";
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

  // --- STATE PAGINATION & SEARCH ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // --- 3. HOOK FETCH DENGAN PARAMS ---
  const {
    data: result = { data: [], total: 0 },
    isLoading,
    isError,
  } = useMataKuliah({
    _page: page,
    _limit: limit,
    q: search,
    _sort: sortBy,
    _order: sortOrder,
  });

  const mataKuliah = result.data; // Ambil array datanya
  const totalPages = Math.ceil(result.total / limit);

  // --- 4. MUTATIONS ---
  const { mutate: store } = useStoreMataKuliah();
  const { mutate: update } = useUpdateMataKuliah();
  const { mutate: remove } = useDeleteMataKuliah();

  // --- HANDLERS ---
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

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  // --- PAGINATION HANDLERS ---
  const handlePrev = () => setPage((old) => Math.max(old - 1, 1));
  const handleNext = () => setPage((old) => Math.min(old + 1, totalPages));

  if (isError)
    return (
      <p className="text-red-500 text-center py-4">Gagal mengambil data MK.</p>
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Heading as="h2" className="mb-0">
            Daftar Mata Kuliah
          </Heading>

          {/* Cek Permission Create */}
          {user?.permission?.includes("matakuliah.create") && (
            <Button onClick={openAddModal}>+ Tambah MK</Button>
          )}
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Input
              placeholder="Cari Kode / Nama MK..."
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
            Total: <b>{result.total}</b> Data
          </div>
        </div>

        {/* --- TABLE --- */}
        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Memuat data...</p>
        ) : (
          <>
            <MataKuliahTable
              data={mataKuliah}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />

            {/* --- PAGINATION CONTROLS --- */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Halaman <b>{page}</b> dari <b>{totalPages || 1}</b>
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

export default MataKuliah;
