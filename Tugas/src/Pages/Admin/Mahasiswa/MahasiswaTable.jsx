import React from "react";
import Button from "@/Pages/Auth/Components/Button";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIM</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-center">Status</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                Tidak ada data mahasiswa.
              </td>
            </tr>
          ) : (
            mahasiswa.map((mhs) => (
              <tr
                key={mhs.nim}
                className="odd:bg-white even:bg-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-4 font-medium">{mhs.nim}</td>
                <td className="py-2 px-4">{mhs.nama}</td>
                <td className="py-2 px-4 text-center">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                    {mhs.status || "Aktif"}
                  </span>
                </td>
                <td className="py-2 px-4 text-center flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => openEditModal(mhs)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(mhs.nim)}
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

export default MahasiswaTable;
