import React, { useState, useEffect } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import { useParams } from "react-router-dom";
import { getMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MahasiswaDetail = () => {
  const { id } = useParams();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMahasiswa();
  }, [id]);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const res = await getMahasiswa(id);
      setMahasiswa(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mahasiswa");
      console.error("Error fetching mahasiswa:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center py-8">Memuat data...</p>
      </Card>
    );
  }

  if (!mahasiswa) {
    return (
      <Card>
        <Heading as="h2" className="mb-4 text-left">
          Detail Mahasiswa
        </Heading>
        <p className="text-red-600">Data mahasiswa tidak ditemukan.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">
        Detail Mahasiswa
      </Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">NIM</td>
            <td className="py-2 px-4">{mahasiswa.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{mahasiswa.nama}</td>
          </tr>
          {mahasiswa.prodi && (
            <tr>
              <td className="py-2 px-4 font-medium">Program Studi</td>
              <td className="py-2 px-4">{mahasiswa.prodi}</td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;
