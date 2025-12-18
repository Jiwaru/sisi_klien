const TableMahasiswa = ({ data = [], onEdit, onDelete, onDetail }) => {
  console.log("=== TABLE DEBUG ===");
  console.log("Received data:", data);
  console.log("Data length:", data.length);
  console.log("First item:", data[0]);

  const mahasiswaData = Array.isArray(data) ? data : [];

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {mahasiswaData.length > 0 ? (
          mahasiswaData.map((mhs, index) => {
            console.log(`Rendering row ${index}:`, mhs);
            return (
              <tr
                key={mhs.id || mhs.nim || index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="py-2 px-4">{mhs.nim || "N/A"}</td>
                <td className="py-2 px-4">{mhs.nama || "N/A"}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <Button size="sm" onClick={() => onDetail(mhs.id)}>
                    Detail
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEdit(mhs)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(mhs.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="3" className="py-4 text-center text-gray-500">
              Tidak ada data mahasiswa
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableMahasiswa;
