import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Input from "@/Pages/Auth/Components/Input"; // Pastikan komponen Input sudah ada
import DosenTable from "./DosenTable";
import DosenModal from "./DosenModal";

// 1. Import Hooks React Query
import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "@/Utils/Hooks/useDosen";

// 2. Import Helper & Context
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Dosen = () => {
  const { user } = useAuthStateContext();
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // --- STATE PAGINATION & SEARCH ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default 5 data per halaman
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // --- 3. HOOK FETCH DENGAN PARAMS ---
  // Kita mengirim params (_page, _limit, q) ke hook useDosen
  const {
    data: result = { data: [], total: 0 },
    isLoading,
    isError,
  } = useDosen({
    _page: page,
    _limit: limit,
    q: search,
    _sort: sortBy,
    _order: sortOrder,
  });

  const dosen = result.data; // Data array dosen
  const totalPages = Math.ceil(result.total / limit); // Hitung total halaman

  // --- 4. MUTATIONS ---
  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();

  // --- HANDLERS ---
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
      // Mode Update
      confirmUpdate(() => {
        update({ id: selectedDosen.id, data: formData });
        setModalOpen(false);
      });
    } else {
      // Mode Create
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

  // --- PAGINATION HANDLERS ---
  const handlePrev = () => setPage((old) => Math.max(old - 1, 1));
  const handleNext = () => setPage((old) => Math.min(old + 1, totalPages));

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
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Dosen
          </Heading>

          {/* Cek Permission Create */}
          {user?.permission?.includes("dosen.create") && (
            <Button onClick={openAddModal}>+ Tambah Dosen</Button>
          )}
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
          <div className="flex gap-2 items-center w-full md:w-auto">
            {/* Input Pencarian */}
            <Input
              placeholder="Cari Nama / NIDN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-64"
            />

            {/* Dropdown Limit */}
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

        {/* --- TABLE CONTENT --- */}
        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Memuat data...</p>
        ) : (
          <>
            <DosenTable
              data={dosen}
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

export default Dosen;
