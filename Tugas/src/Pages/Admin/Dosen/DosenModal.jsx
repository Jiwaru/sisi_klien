import React, { useState, useEffect } from "react";
import Modal from "@/Pages/Auth/Components/Modal";
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Button from "@/Pages/Auth/Components/Button";

const DosenModal = ({ isOpen, onClose, onSubmit, selectedDosen }) => {
  const [form, setForm] = useState({
    nidn: "",
    nama: "",
    keahlian: "",
  });

  // Effect: Isi form jika mode Edit, reset jika mode Tambah
  useEffect(() => {
    if (isOpen) {
      if (selectedDosen) {
        setForm({
          nidn: selectedDosen.nidn,
          nama: selectedDosen.nama,
          keahlian: selectedDosen.keahlian,
        });
      } else {
        setForm({ nidn: "", nama: "", keahlian: "" });
      }
    }
  }, [isOpen, selectedDosen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!form.nidn || !form.nama) {
      alert("NIDN dan Nama wajib diisi!");
      return;
    }
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
          <Label htmlFor="nidn">NIDN</Label>
          <Input
            type="text"
            name="nidn"
            value={form.nidn}
            onChange={handleChange}
            placeholder="Masukkan NIDN"
            required
            // NIDN sebaiknya tidak bisa diedit jika itu primary key bisnis logic,
            // tapi di json-server id adalah PK, jadi NIDN bisa diedit.
            // readOnly={!!selectedDosen}
          />
        </div>
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan Nama Dosen"
            required
          />
        </div>
        <div>
          <Label htmlFor="keahlian">Bidang Keahlian</Label>
          <Input
            type="text"
            name="keahlian"
            value={form.keahlian}
            onChange={handleChange}
            placeholder="Contoh: Rekayasa Perangkat Lunak"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm">
            Simpan
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DosenModal;
