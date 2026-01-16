import React, { useState, useEffect } from "react";
import Modal from "@/Pages/Auth/Components/Modal";
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Button from "@/Pages/Auth/Components/Button";

const MahasiswaModal = ({ isOpen, onClose, onSubmit, selectedData }) => {
  // Setup default state
  const defaultForm = { nim: "", name: "", status: "Aktif", max_sks: 24 };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      if (selectedData) {
        // Mode Edit: Isi form dengan data yang dipilih
        // 👇 PERBAIKAN: Pastikan mapping ke properti 'name'
        setForm({
          nim: selectedData.nim,
          name: selectedData.name,
          status: selectedData.status,
          max_sks: selectedData.max_sks || 24,
        });
      } else {
        // Mode Tambah: Reset form
        setForm(defaultForm);
      }
    }
  }, [isOpen, selectedData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedData ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
    >
      <Form onSubmit={handleSubmitInternal}>
        <div>
          <Label>NIM</Label>
          <Input
            name="nim"
            value={form.nim}
            onChange={handleChange}
            placeholder="Contoh: A11.2023.12345"
            required
            disabled={!!selectedData} // NIM tidak boleh diedit
          />
        </div>

        {/* 👇 PERBAIKAN: Input Name */}
        <div>
          <Label>Nama Lengkap</Label>
          <Input
            name="name" // Harus sesuai dengan state & db.json
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan Nama Lengkap"
            required
          />
        </div>

        <div>
          <Label>Status</Label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Aktif">Aktif</option>
            <option value="Cuti">Cuti</option>
            <option value="Lulus">Lulus</option>
            <option value="Non-Aktif">Non-Aktif</option>
          </select>
        </div>

        {/* 👇 TAMBAHAN: Input Max SKS */}
        <div>
          <Label>Jatah SKS (Max)</Label>
          <Input
            type="number"
            name="max_sks"
            value={form.max_sks}
            onChange={handleChange}
            placeholder="Contoh: 24"
            required
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default MahasiswaModal;
