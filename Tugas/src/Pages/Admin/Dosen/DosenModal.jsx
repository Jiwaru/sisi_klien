import React, { useState, useEffect } from "react";
import Modal from "@/Pages/Auth/Components/Modal";
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Button from "@/Pages/Auth/Components/Button";

const DosenModal = ({ isOpen, onClose, onSubmit, selectedDosen }) => {
  // 1. Pastikan state awal menggunakan key 'bidang', bukan 'keahlian'
  const [form, setForm] = useState({ nidn: "", nama: "", bidang: "" });

  useEffect(() => {
    if (isOpen) {
      if (selectedDosen) {
        // 2. Saat Edit: Ambil data dari selectedDosen.bidang
        setForm({
          nidn: selectedDosen.nidn,
          nama: selectedDosen.nama,
          bidang: selectedDosen.bidang || "", // Pastikan fallback ke string kosong jika null
        });
      } else {
        // Saat Tambah Baru: Reset form
        setForm({ nidn: "", nama: "", bidang: "" });
      }
    }
  }, [isOpen, selectedDosen]);

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
      title={selectedDosen ? "Edit Dosen" : "Tambah Dosen"}
    >
      <Form onSubmit={handleSubmitInternal}>
        <div>
          <Label>NIDN</Label>
          <Input
            name="nidn"
            value={form.nidn}
            onChange={handleChange}
            placeholder="Masukkan NIDN"
            required
          />
        </div>
        <div>
          <Label>Nama Lengkap</Label>
          <Input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan Nama Lengkap"
            required
          />
        </div>
        <div>
          <Label>Bidang Keahlian</Label>
          {/* 3. Pastikan name="bidang" dan value={form.bidang} */}
          <Input
            name="bidang"
            value={form.bidang}
            onChange={handleChange}
            placeholder="Contoh: Rekayasa Perangkat Lunak"
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

export default DosenModal;
