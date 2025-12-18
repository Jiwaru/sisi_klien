import React from "react";
import Button from "@/Pages/Auth/Components/Button";

const MataKuliahTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Kode MK</th>
            <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
            <th className="py-2 px-4 text-center">SKS</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="odd:bg-white even:bg-gray-100 hover:bg-gray-50"
            >
              <td className="py-2 px-4 font-medium">{item.kode}</td>
              <td className="py-2 px-4">{item.nama}</td>
              <td className="py-2 px-4 text-center">{item.sks}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MataKuliahTable;
