import React from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import { useParams } from "react-router-dom";
import { mahasiswaList } from "@/Data/Dummy";

const MahasiswaDetail = () => {
  const { nim } = useParams();
  const data = mahasiswaList.find((m) => m.nim === nim);

  if (!data) {
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
            <td className="py-2 px-4">{data.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{data.nama}</td>
          </tr>
          {data.prodi && (
            <tr>
              <td className="py-2 px-4 font-medium">Program Studi</td>
              <td className="py-2 px-4">{data.prodi}</td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;
