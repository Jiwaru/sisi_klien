import React, { useState } from "react"; // Import useState
import AdminLayout from "@/Pages/Admin/AdminLayout";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Modal from "@/Pages/Auth/Components/Modal"; // Import Modal
import Form from "@/Pages/Auth/Components/Form";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";

const Mahasiswa = () => {
  // State untuk mengontrol visibilitas Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (nama) => alert(`Edit data ${nama}`);
  const handleDelete = (nama) => {
    if (confirm(`Yakin ingin hapus ${nama}?`)) alert("Data berhasil dihapus!");
  };

  return (
    <AdminLayout>
      {/* Komponen Modal dipasang di sini */}
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

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>
          {/* Update onClick untuk membuka Modal */}
          <Button onClick={() => setIsModalOpen(true)}>
            + Tambah Mahasiswa
          </Button>
        </div>

        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">NIM</th>
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4">20211001</td>
              <td className="py-2 px-4">Budi Santoso</td>
              <td className="py-2 px-4 text-center space-x-2">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit("Budi Santoso")}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete("Budi Santoso")}
                >
                  Hapus
                </Button>
              </td>
            </tr>
            <tr className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4">20211002</td>
              <td className="py-2 px-4">Siti Aminah</td>
              <td className="py-2 px-4 text-center space-x-2">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit("Siti Aminah")}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete("Siti Aminah")}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
};

export default Mahasiswa;
