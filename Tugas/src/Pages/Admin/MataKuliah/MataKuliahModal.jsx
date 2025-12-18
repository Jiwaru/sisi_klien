import React, { useState, useEffect } from "react";
import Modal from "@/Pages/Auth/Components/Modal";
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Button from "@/Pages/Auth/Components/Button";

const MataKuliahModal = ({ isOpen, onClose, onSubmit, selectedData }) => {
  const [form, setForm] = useState({ kode: "", nama: "", sks: "" });

  useEffect(() => {
    if (isOpen) {
      if (selectedData) setForm(selectedData);
      else setForm({ kode: "", nama: "", sks: "" });
    }
  }, [isOpen, selectedData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedData ? "Edit MK" : "Tambah MK"}
    >
      <Form onSubmit={handleSubmitInternal}>
        <div>
          <Label>Kode MK</Label>
          <Input
            name="kode"
            value={form.kode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Nama MK</Label>
          <Input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>SKS</Label>
          <Input
            type="number"
            name="sks"
            value={form.sks}
            onChange={handleChange}
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

export default MataKuliahModal;
