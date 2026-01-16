import React, { useState } from "react";
import Button from "@/Pages/Auth/Components/Button";

const TableRencanaStudi = ({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  onAddMahasiswa,
  onDeleteMahasiswa,
  onChangeDosen,
  onDeleteKelas,
}) => {
  const [selectedMhs, setSelectedMhs] = useState({});

  return (
    <div className="space-y-8">
      {kelas.map((kls) => {
        const matkul = mataKuliah.find((m) => m.id === kls.mata_kuliah_id);
        const dsnPengampu = dosen.find((d) => d.id === kls.dosen_id);

        const mhsInClass = kls.mahasiswa_ids
          .map((id) => mahasiswa.find((m) => m.id === id))
          .filter(Boolean);

        return (
          <div
            key={kls.id}
            className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            {}
            <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {matkul?.nama || "Unknown MK"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  SKS: <span className="font-semibold">{matkul?.sks}</span> •
                  Dosen:{" "}
                  <span className="font-semibold text-blue-600">
                    {dsnPengampu?.nama}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {}
                <select
                  className="bg-white border border-gray-300 text-sm py-1.5 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={kls.dosen_id}
                  onChange={(e) => onChangeDosen(kls, e.target.value)}
                >
                  {dosen.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} (Max: {d.max_sks})
                    </option>
                  ))}
                </select>

                {}
                {mhsInClass.length === 0 && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDeleteKelas(kls.id)}
                  >
                    Hapus Kelas
                  </Button>
                )}
              </div>
            </div>

            {}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">No</th>
                    <th className="py-2 px-4 text-left">Nama Mahasiswa</th>
                    <th className="py-2 px-4 text-left">NIM</th>
                    <th className="py-2 px-4 text-center">Total SKS</th>
                    <th className="py-2 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mhsInClass.length > 0 ? (
                    mhsInClass.map((m, i) => {
                      const totalSks = kelas
                        .filter((k) => k.mahasiswa_ids.includes(m.id))
                        .map(
                          (k) =>
                            mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)
                              ?.sks || 0
                        )
                        .reduce((a, b) => parseInt(a) + parseInt(b), 0);

                      return (
                        <tr
                          key={m.id}
                          className="odd:bg-white even:bg-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-2 px-4">{i + 1}</td>
                          <td className="py-2 px-4 font-medium">{m.name}</td>
                          <td className="py-2 px-4">{m.nim}</td>
                          <td className="py-2 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                totalSks > m.max_sks
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {totalSks} / {m.max_sks}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => onDeleteMahasiswa(kls, m.id)}
                            >
                              Keluarkan
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 text-center text-gray-500 italic"
                      >
                        Belum ada mahasiswa di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  className="bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                  value={selectedMhs[kls.id] || ""}
                  onChange={(e) =>
                    setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })
                  }
                >
                  <option value="">+ Pilih Mahasiswa</option>
                  {mahasiswa.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.nim}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={() => {
                    onAddMahasiswa(kls, selectedMhs[kls.id]);
                    setSelectedMhs({ ...selectedMhs, [kls.id]: "" });
                  }}
                >
                  Tambah
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableRencanaStudi;
