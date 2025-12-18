import React, { useState, useEffect } from "react";
import Modal from "@/Pages/Auth/Components/Modal";
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Button from "@/Pages/Auth/Components/Button";

const MahasiswaModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMahasiswa,
}) => {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: "Aktif",
  });

  useEffect(() => {
    if (isModalOpen) {
      if (selectedMahasiswa) {
        setForm({ ...selectedMahasiswa });
      } else {
        setForm({ nim: "", nama: "", status: "Aktif" });
      }
    }
  }, [isModalOpen, selectedMahasiswa]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();

    if (!form.nim || !form.nama) {
      alert("NIM dan Nama wajib diisi!");
      return;
    }

    onSubmit(form);

    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title={selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
    >
      <Form onSubmit={handleSubmitInternal}>
        <div>
          <Label htmlFor="nim">NIM</Label>
          <Input
            type="text"
            name="nim"
            value={form.nim}
            onChange={handleChange}
            readOnly={!!selectedMahasiswa}
            placeholder="Masukkan NIM"
            required
          />
        </div>
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan Nama"
            required
          />
        </div>

        {}
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

export default MahasiswaModal;
