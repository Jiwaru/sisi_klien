import React, { useEffect, useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";

// Import APIs
import {
  getAllKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "@/Utils/Apis/KelasApi";

// Import Hooks
import { useMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useDosen } from "@/Utils/Hooks/useDosen";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";

// Import Components
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

const RencanaStudi = () => {
  const [kelas, setKelas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });

  // --- AMBIL DATA DARI HOOKS (DENGAN SAFE CHECK ARRAY) ---

  // 1. Mahasiswa
  const { data: mhsResult } = useMahasiswa();
  const mahasiswa = Array.isArray(mhsResult)
    ? mhsResult
    : mhsResult?.data || [];

  // 2. Dosen
  const { data: dsnResult } = useDosen();
  const dosen = Array.isArray(dsnResult) ? dsnResult : dsnResult?.data || [];

  // 3. Mata Kuliah
  const { data: mkResult } = useMataKuliah();
  const mataKuliah = Array.isArray(mkResult) ? mkResult : mkResult?.data || [];

  // --- FETCH MANUAL KELAS (Agar Realtime Update) ---
  const fetchKelas = async () => {
    try {
      const res = await getAllKelas();
      setKelas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  // --- HELPERS VALIDASI SKS (Dengan Konversi String agar Aman) ---
  const getMaxSksMhs = (id) =>
    mahasiswa.find((m) => String(m.id) === String(id))?.max_sks || 0;
  const getMaxSksDosen = (id) =>
    dosen.find((d) => String(d.id) === String(id))?.max_sks || 0;

  // --- LOGIC 1: Tambah Mahasiswa ke Kelas ---
  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    if (!mhsId) return;

    // Cek apakah sudah ada di kelas
    // Gunakan String comparison untuk safety
    if (kelasItem.mahasiswa_ids.some((id) => String(id) === String(mhsId))) {
      toastError("Mahasiswa sudah terdaftar di kelas ini!");
      return;
    }

    // Hitung SKS Mata Kuliah ini
    const matkulKelas = mataKuliah.find(
      (m) => String(m.id) === String(kelasItem.mata_kuliah_id)
    );
    const sksBaru = parseInt(matkulKelas?.sks || 0);

    // Hitung Total SKS yang SUDAH diambil mahasiswa di SEMUA kelas
    const totalSksDiambil = kelas
      .filter((k) => k.mahasiswa_ids.some((id) => String(id) === String(mhsId)))
      .map(
        (k) =>
          mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id))
            ?.sks || 0
      )
      .reduce((a, b) => parseInt(a) + parseInt(b), 0);

    const maxSks = getMaxSksMhs(mhsId);

    // Validasi
    if (totalSksDiambil + sksBaru > maxSks) {
      toastError(
        `Gagal! Total SKS akan menjadi ${
          totalSksDiambil + sksBaru
        }. Batas Max: ${maxSks}`
      );
      return;
    }

    // Update Data
    const updatedData = {
      ...kelasItem,
      mahasiswa_ids: [...kelasItem.mahasiswa_ids, mhsId],
    };

    await updateKelas(kelasItem.id, updatedData);
    toastSuccess("Mahasiswa berhasil dimasukkan ke kelas!");
    fetchKelas();
  };

  // --- LOGIC 2: Hapus Mahasiswa dari Kelas ---
  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    const updatedData = {
      ...kelasItem,
      mahasiswa_ids: kelasItem.mahasiswa_ids.filter(
        (id) => String(id) !== String(mhsId)
      ),
    };
    await updateKelas(kelasItem.id, updatedData);
    toastSuccess("Mahasiswa dihapus dari kelas.");
    fetchKelas();
  };

  // --- LOGIC 3: Ganti Dosen (Dengan Validasi Strict & Debugging) ---
  const handleChangeDosen = async (kelasItem, newDosenId) => {
    if (!newDosenId) return;

    // Hitung beban SKS dosen tersebut di kelas lain (kecuali kelas ini)
    const totalSksDosen = kelas
      .filter(
        (k) =>
          String(k.dosen_id) === String(newDosenId) &&
          String(k.id) !== String(kelasItem.id)
      )
      .map(
        (k) =>
          mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id))
            ?.sks || 0
      )
      .reduce((a, b) => parseInt(a) + parseInt(b), 0);

    const matkulIni = mataKuliah.find(
      (m) => String(m.id) === String(kelasItem.mata_kuliah_id)
    );
    const sksKelasIni = parseInt(matkulIni?.sks || 0);
    const maxSks = parseInt(getMaxSksDosen(newDosenId));

    const totalAkanDatang = totalSksDosen + sksKelasIni;

    // 🔍 Console Log untuk Debugging
    console.log(`--- Ganti Dosen Check ---`);
    console.log(`Dosen ID Target: ${newDosenId}`);
    console.log(`Beban Existing (Kelas Lain): ${totalSksDosen} SKS`);
    console.log(`Beban Tambahan (Kelas Ini): ${sksKelasIni} SKS`);
    console.log(`Total Prediksi: ${totalAkanDatang} SKS`);
    console.log(`Batas Max Dosen: ${maxSks} SKS`);

    if (totalAkanDatang > maxSks) {
      toastError(
        `Dosen Overload! Total SKS akan menjadi ${totalAkanDatang}. Max: ${maxSks}`
      );
      return;
    }

    await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: newDosenId });
    toastSuccess("Dosen pengampu berhasil diganti!");
    fetchKelas();
  };

  // --- LOGIC 4: Tambah Kelas Baru (Dengan Validasi Dosen) ---
  const handleSubmitKelas = async (e) => {
    e.preventDefault();

    // 1. Cek Duplikasi Kelas (Satu MK hanya boleh satu kelas)
    const isExist = kelas.some(
      (k) => String(k.mata_kuliah_id) === String(form.mata_kuliah_id)
    );
    if (isExist) {
      toastError("Kelas untuk Mata Kuliah ini sudah ada!");
      return;
    }

    // 2. Cek Validasi Beban Dosen
    const dosenId = form.dosen_id;
    const matkulId = form.mata_kuliah_id;

    // Hitung beban dosen saat ini
    const totalSksDosen = kelas
      .filter((k) => String(k.dosen_id) === String(dosenId))
      .map(
        (k) =>
          mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id))
            ?.sks || 0
      )
      .reduce((a, b) => parseInt(a) + parseInt(b), 0);

    const sksMatkulBaru = parseInt(
      mataKuliah.find((m) => String(m.id) === String(matkulId))?.sks || 0
    );
    const maxSksDosen = parseInt(getMaxSksDosen(dosenId));

    const totalPrediksi = totalSksDosen + sksMatkulBaru;

    if (totalPrediksi > maxSksDosen) {
      toastError(
        `Gagal! Dosen Overload. Total akan menjadi ${totalPrediksi}. Max: ${maxSksDosen}`
      );
      return;
    }

    await storeKelas({ ...form, mahasiswa_ids: [] });
    setIsModalOpen(false);
    setForm({ mata_kuliah_id: "", dosen_id: "" });
    toastSuccess("Kelas baru berhasil dibuat!");
    fetchKelas();
  };

  const handleDeleteKelas = (id) => {
    confirmDelete(async () => {
      await deleteKelas(id);
      fetchKelas();
    });
  };

  // --- Filter Mata Kuliah yang belum punya kelas ---
  const mkSudahDipakai = kelas.map((k) => String(k.mata_kuliah_id));
  const mkTersedia = mataKuliah.filter(
    (m) => !mkSudahDipakai.includes(String(m.id))
  );

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Heading>Rencana Studi (KRS)</Heading>
          <Button onClick={() => setIsModalOpen(true)}>
            + Buat Kelas Baru
          </Button>
        </div>

        <TableRencanaStudi
          kelas={kelas}
          mahasiswa={mahasiswa}
          dosen={dosen}
          mataKuliah={mataKuliah}
          onAddMahasiswa={handleAddMahasiswa}
          onDeleteMahasiswa={handleDeleteMahasiswa}
          onChangeDosen={handleChangeDosen}
          onDeleteKelas={handleDeleteKelas}
        />
      </Card>

      <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitKelas}
        form={form}
        setForm={setForm}
        dosen={dosen}
        mataKuliah={mkTersedia}
      />
    </>
  );
};

export default RencanaStudi;
