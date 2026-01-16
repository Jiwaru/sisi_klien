import React from "react";
import Modal from "@/Pages/Auth/Components/Modal";
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";

const ModalRencanaStudi = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  dosen,
  mataKuliah,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Kelas Baru">
      <Form onSubmit={onSubmit}>
        <div>
          <Label>Mata Kuliah</Label>
          <select
            name="mata_kuliah_id"
            className="w-full border p-2 rounded"
            value={form.mata_kuliah_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih MK --</option>
            {mataKuliah.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama} ({m.sks} SKS)
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            *Hanya MK yang belum punya kelas yang muncul
          </p>
        </div>

        <div>
          <Label>Dosen Pengampu</Label>
          <select
            name="dosen_id"
            className="w-full border p-2 rounded"
            value={form.dosen_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Dosen --</option>
            {dosen.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan Kelas</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalRencanaStudi;
