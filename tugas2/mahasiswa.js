// =================================================================
// BAGIAN 1: DATA AWAL (INPUT)
// =================================================================

const mataKuliahList = {
  tahunAjar: "2023/2024",
  mataKuliah: [
    {
      kode: "MK001",
      nama: "Matematika",
      sks: 3,
      tugasP: 0.2,
      utsP: 0.35,
      uasP: 0.45,
    },
    {
      kode: "MK002",
      nama: "Pemrograman",
      sks: 4,
      tugasP: 0.25,
      utsP: 0.35,
      uasP: 0.4,
    },
    {
      kode: "MK003",
      nama: "Basis Data",
      sks: 3,
      tugasP: 0.3,
      utsP: 0.3,
      uasP: 0.4,
    },
  ],
};

let mahasiswaList = {
  mahasiswa: [
    {
      nim: "22001",
      nama: "Budi Santoso",
      status: true,
      matkul: [
        { matkulId: "MK001", tugas: 80, uts: 78, uas: 85 },
        { matkulId: "MK002", tugas: 75, uts: 80, uas: 82 },
      ],
    },
    {
      nim: "22002",
      nama: "Siti Aminah",
      status: false,
      matkul: [
        { matkulId: "MK001", tugas: 90, uts: 92, uas: 88 },
        { matkulId: "MK003", tugas: 85, uts: 80, uas: 87 },
      ],
    },
  ],
};

// =================================================================
// BAGIAN 2: DEFINISI FUNGSI
// =================================================================

// 2.1 Operasi Baca & Kueri
const show = () => {
  const matkulMap = new Map(
    (mataKuliahList.mataKuliah || []).map((mk) => [mk.kode, mk.nama])
  );
  mahasiswaList.mahasiswa.forEach((mhs) => {
    console.log(
      `NIM: ${mhs.nim}, Nama: ${mhs.nama}, Status: ${
        mhs.status ? "Aktif" : "Tidak Aktif"
      }`
    );
    console.log("Mata Kuliah:");
    if (mhs.matkul && mhs.matkul.length > 0) {
      mhs.matkul.forEach((mk) => {
        const matkulName = matkulMap.get(mk.matkulId) || "Nama Tidak Ditemukan";
        console.log(
          `- ${matkulName}: Tugas ${mk.tugas}, UTS ${mk.uts}, UAS ${mk.uas}`
        );
      });
    } else {
      console.log("- Belum ada mata kuliah yang diambil.");
    }
    console.log("---");
  });
};

const jumlahMahasiswa = () => mahasiswaList.mahasiswa.length;

const jumlahAktifTidak = () => {
  const aktif = mahasiswaList.mahasiswa.filter((m) => m.status).length;
  const tidakAktif = mahasiswaList.mahasiswa.filter((m) => !m.status).length;
  return { aktif, tidakAktif };
};

// 2.2 Operasi Manipulasi Data (CRUD)
const add = (mahasiswaBaru) => {
  // Imutabel: buat array baru dengan mahasiswaBaru di akhir
  mahasiswaList.mahasiswa = [...mahasiswaList.mahasiswa, mahasiswaBaru];
};

const update = (nim, dataBaru) => {
  mahasiswaList.mahasiswa = mahasiswaList.mahasiswa.map((m) =>
    m.nim === nim ? { ...m, ...dataBaru } : m
  );
};

const deleteById = (nim) => {
  mahasiswaList.mahasiswa = mahasiswaList.mahasiswa.filter(
    (m) => m.nim !== nim
  );
};

const clear = () => {
  // Mutabel
  mahasiswaList.mahasiswa.length = 0;
};

const clearArray = () => {
  // Imutabel
  mahasiswaList.mahasiswa = [];
};

// 2.3 Perhitungan & Analisis
const totalNilai = (nim) => {
  const mahasiswa = mahasiswaList.mahasiswa.find((m) => m.nim === nim);
  if (!mahasiswa) return "Mahasiswa tidak ditemukan";
  return (mahasiswa.matkul || []).map((mk) => {
    const total = mk.tugas + mk.uts + mk.uas;
    return { matkulId: mk.matkulId, total };
  });
};

const kategoriNilai = (nilaiAkhir) => {
  if (nilaiAkhir >= 85) return "A";
  if (nilaiAkhir >= 75) return "B";
  if (nilaiAkhir >= 65) return "C";
  if (nilaiAkhir >= 50) return "D";
  return "E";
};

const getPoinNilai = (nilaiHuruf) => {
  const poin = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.0 };
  return poin[nilaiHuruf] || 0;
};

const IPS = (nim) => {
  const mahasiswa = mahasiswaList.mahasiswa.find((m) => m.nim === nim);
  if (!mahasiswa) return "Mahasiswa tidak ditemukan";
  const matkulInfo = (mahasiswa.matkul || [])
    .map((mk) => {
      const detailMatkul = (mataKuliahList.mataKuliah || []).find(
        (m) => m.kode === mk.matkulId
      );
      if (!detailMatkul) return null;
      const nilaiAkhir =
        mk.tugas * detailMatkul.tugasP +
        mk.uts * detailMatkul.utsP +
        mk.uas * detailMatkul.uasP;
      const nilaiHuruf = kategoriNilai(nilaiAkhir);
      const poinNilai = getPoinNilai(nilaiHuruf);
      return {
        sks: detailMatkul.sks,
        poinTertimbang: poinNilai * detailMatkul.sks,
      };
    })
    .filter(Boolean);
  if (matkulInfo.length === 0) return "0.00";
  const totalSks = matkulInfo.reduce((sum, mk) => sum + mk.sks, 0);
  const totalPoinTertimbang = matkulInfo.reduce(
    (sum, mk) => sum + mk.poinTertimbang,
    0
  );
  if (totalSks === 0) return "0.00";
  return (totalPoinTertimbang / totalSks).toFixed(2);
};

// 2.4 Operasi Pengurutan
const sortByNIM = () => {
  const sortedMahasiswa = [...mahasiswaList.mahasiswa].sort((a, b) =>
    a.nim.localeCompare(b.nim)
  );
  mahasiswaList.mahasiswa = sortedMahasiswa;
};

const sortByStatus = () => {
  // true (1) duluan => descending by numeric value of status
  const sortedMahasiswa = [...mahasiswaList.mahasiswa].sort(
    (a, b) => Number(b.status) - Number(a.status)
  );
  mahasiswaList.mahasiswa = sortedMahasiswa;
};

// =================================================================
// BAGIAN 3: EKSEKUSI FUNGSI DAN OUTPUT
// =================================================================

console.log("====== TAHAP 1: DATA AWAL ======");
show();

console.log("\n====== TAHAP 2: MENAMBAH MAHASISWA BARU ======");
add({
  nim: "22003",
  nama: "Andi Setiawan",
  status: true,
  matkul: [{ matkulId: "MK003", tugas: 90, uts: 85, uas: 88 }],
});
show();

console.log(
  "\n====== TAHAP 3: MEMPERBARUI STATUS MAHASISWA (NIM 22001) ======"
);
update("22001", { status: false });
show();

console.log("\n====== TAHAP 4: MENGHAPUS MAHASISWA (NIM 22002) ======");
deleteById("22002");
show();

console.log("\n====== TAHAP 5: KUERI DAN PERHITUNGAN ======");
console.log("Jumlah Mahasiswa Saat Ini:", jumlahMahasiswa());
console.log("Jumlah Mahasiswa Aktif/Tidak Aktif:", jumlahAktifTidak());
console.log("Total Nilai Mentah Mahasiswa 22001:", totalNilai("22001"));
console.log("IPS Mahasiswa 22001:", IPS("22001"));
console.log("IPS Mahasiswa 22003:", IPS("22003"));

console.log("\n====== TAHAP 6: PENGURUTAN ======");
console.log("--- Mengurutkan berdasarkan Status (Aktif duluan) ---");
sortByStatus();
show();

console.log("--- Mengurutkan berdasarkan NIM (Ascending) ---");
sortByNIM();
show();

console.log("\n====== TAHAP 7: MENGHAPUS SEMUA DATA ======");
clearArray(); // Menggunakan versi imutabel
console.log("Jumlah Mahasiswa Setelah clearArray():", jumlahMahasiswa());
show(); // Seharusnya tidak menampilkan apa-apa
