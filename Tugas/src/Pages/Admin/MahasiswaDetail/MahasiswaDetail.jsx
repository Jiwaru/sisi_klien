import React from "react";
import { useParams, Link } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";

// 1. Import Hook Detail
import { useMahasiswaDetail } from "@/Utils/Hooks/useMahasiswa";

const MahasiswaDetail = () => {
  const { nim } = useParams(); // Ingat: di route parameternya :nim, tapi isinya ID

  // 2. Gunakan Hook (Otomatis fetch, loading, error handling)
  const { data: mahasiswa, isLoading, isError } = useMahasiswaDetail(nim);

  if (isLoading) {
    return <div className="flex justify-center p-10">Memuat data...</div>;
  }

  if (isError || !mahasiswa) {
    return (
      <Card>
        <div className="text-center py-10">
          <h3 className="text-xl text-red-500 font-bold">
            Data Tidak Ditemukan
          </h3>
          <Link to="/admin/mahasiswa">
            <Button className="mt-4">Kembali</Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Nama Lengkap</p>
          <p className="text-lg font-semibold">{mahasiswa.nama}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">NIM</p>
          <p className="text-lg font-semibold">{mahasiswa.nim}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Status</p>
          <span className="font-semibold text-green-700">
            {mahasiswa.status || "Aktif"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default MahasiswaDetail;
