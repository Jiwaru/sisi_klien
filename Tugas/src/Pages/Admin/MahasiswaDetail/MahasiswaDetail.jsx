import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMahasiswaById } from "@/Utils/Apis/MahasiswaApi"; // Import API
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";

const MahasiswaDetail = () => {
  // Di main.jsx route-nya path: ":nim", jadi kita ambil sebagai variable nim
  // Tapi karena di Table kita passing ID, maka variable 'nim' ini isinya sebenarnya ID.
  const { nim } = useParams();

  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Panggil API get by ID
        const res = await getMahasiswaById(nim);
        setMahasiswa(res.data);
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
        setMahasiswa(null);
      } finally {
        setLoading(false);
      }
    };

    if (nim) {
      fetchData();
    }
  }, [nim]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Memuat data...</p>
      </div>
    );
  }

  if (!mahasiswa) {
    return (
      <Card>
        <div className="text-center py-10">
          <h3 className="text-xl text-red-500 font-bold mb-2">
            Data Mahasiswa Tidak Ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            Mungkin data telah dihapus atau ID salah.
          </p>
          <Link to="/admin/mahasiswa">
            <Button>Kembali ke Daftar</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <Heading as="h2" className="mb-0">
          Detail Mahasiswa
        </Heading>
        <Link to="/admin/mahasiswa">
          <Button variant="secondary" size="sm">
            Kembali
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
            <p className="text-lg font-semibold text-gray-800">
              {mahasiswa.nama}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">NIM</p>
            <p className="text-lg font-semibold text-gray-800">
              {mahasiswa.nim}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Status Mahasiswa</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                mahasiswa.status === "Aktif"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {mahasiswa.status || "Aktif"}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">ID Database</p>
            <p className="text-lg font-mono text-gray-600">{mahasiswa.id}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MahasiswaDetail;
