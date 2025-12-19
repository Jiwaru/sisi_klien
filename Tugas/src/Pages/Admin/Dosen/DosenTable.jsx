import React from "react";
import Button from "@/Pages/Auth/Components/Button";

const DosenTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIDN</th>
            <th className="py-2 px-4 text-left">Nama Lengkap</th>
            <th className="py-2 px-4 text-left">Keahlian</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                Tidak ada data dosen.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                // 👇 PERBAIKAN: class 'border-b' DIHAPUS agar sama dengan MahasiswaTable
                className="odd:bg-white even:bg-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-4 font-medium">{item.nidn}</td>
                <td className="py-2 px-4">{item.nama}</td>
                <td className="py-2 px-4">{item.bidang}</td>
                <td className="py-2 px-4 text-center flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DosenTable;
