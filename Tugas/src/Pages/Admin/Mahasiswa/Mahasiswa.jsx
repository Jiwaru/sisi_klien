import React, { useState } from "react";

import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Modal from "@/Pages/Auth/Components/Modal";
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import { mahasiswaList } from "@/Data/Dummy";
import { Link } from "react-router-dom";

const Mahasiswa = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (nama) => alert(`Edit data ${nama}`);
  const handleDelete = (nama) => {
    if (confirm(`Yakin ingin hapus ${nama}?`)) alert("Data berhasil dihapus!");
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={() => setIsModalOpen(true)}>+ Tambah Mahasiswa</Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Mahasiswa"
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Data tersimpan!");
            setIsModalOpen(false);
          }}
        >
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input type="text" name="nim" placeholder="Masukkan NIM" required />
          </div>
          <div>
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              type="text"
              name="nama"
              placeholder="Masukkan Nama"
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Simpan Data
          </Button>
        </Form>
      </Modal>

      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIM</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {}
          {mahasiswaList.map((mhs, index) => (
            <tr key={mhs.nim} className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4">{mhs.nim}</td>
              <td className="py-2 px-4">{mhs.nama}</td>
              <td className="py-2 px-4 text-center space-x-2">
                {}
                <Link
                  to={`/admin/mahasiswa/${mhs.nim}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                >
                  Detail
                </Link>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit(mhs.nama)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(mhs.nama)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default Mahasiswa;
