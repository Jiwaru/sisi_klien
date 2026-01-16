import React from "react";
import Button from "@/Pages/Auth/Components/Button";
import { Link } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MahasiswaTable = ({ data = [], openEditModal, onDelete }) => {
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIM</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-center">Status</th>
            <th className="py-2 px-4 text-center">Max SKS</th>{" "}
            {/* Tambahan Kolom */}
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Data mahasiswa kosong.
              </td>
            </tr>
          ) : (
            data.map((mhs) => (
              <tr
                key={mhs.id}
                className="odd:bg-white even:bg-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-4 font-medium">{mhs.nim}</td>

                {/* 👇 PERBAIKAN: Gunakan mhs.name (bukan mhs.nama) */}
                <td className="py-2 px-4">{mhs.name}</td>

                <td className="py-2 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      mhs.status === "Aktif"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {mhs.status}
                  </span>
                </td>

                {/* 👇 Tambahan: Menampilkan Max SKS */}
                <td className="py-2 px-4 text-center font-bold text-blue-600">
                  {mhs.max_sks} SKS
                </td>

                <td className="py-2 px-4 text-center flex justify-center gap-2">
                  <Link
                    to={`/admin/mahasiswa/${mhs.nim}`} // Pastikan pakai NIM atau ID sesuai route
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Detail
                  </Link>

                  {user?.permission?.includes("mahasiswa.update") && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => openEditModal(mhs)}
                    >
                      Edit
                    </Button>
                  )}

                  {user?.permission?.includes("mahasiswa.delete") && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(mhs.id)}
                    >
                      Hapus
                    </Button>
                  )}
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
