const mahasiswa = {
  nama: "Sen Arya",
  nim: "A11.2023.14895",
  umur: 20,
  status: true,
  organisasi: "DNCC",
  hobby: ["musik", "film", "game"],
  matkul: [
    {
      matkulId: 4301,
      matkulNama: "pemsik",
      sks: 3,
      nilai: 85,
    },
    {
      matkulId: 4307,
      matkulNama: "AI",
      sks: 3,
      nilai: 80,
    },
  ],
};

console.log(mahasiswa);

const { nama, nim, umur, status, hobby, matkul } = mahasiswa;
console.log("nama saya: " + nama + " - " + nim);

const [hobby1, hobby2, hobby3] = hobby;
// console.log("hobby saya: " + hobby1 + " & " + hobby3);

console.log("hobi : ${hobby1} dan ${hobby3}");

const newHobby = "ngoding";
const updateHobby = [...hobby, newHobby, "roblox"];
console.log("hobi baru: " + updateHobby);

const jumlah = (a, b) => a + b;
console.log(jumlah(10, 20));

const statusMhs = status ? "aktif" : "tidak aktif";
console.log("status mahasiswa: " + statusMhs);

const aktifMhs = mahasiswa.organisasi || "tidak ada organisasi";
console.log("organisasi: " + aktifMhs);

const namaMatkul = matkul.map((m) => m.matkulNama);
console.log("nama matkul: " + namaMatkul);

const listMhs = [
  { nim: "A11.2023.14895", nama: "Sen Arya", status: true },
  { nim: "A11.2023.14896", nama: "Budi", status: false },
  { nim: "A11.2023.14897", nama: "Siti", status: true },
];

const mhsValid = listMhs.filter((m) => m.status);
console.log(mhsValid);

const totalSks = matkul.reduce((total, m) => total + m.sks, 0);
console.log("total sks: " + totalSks);
