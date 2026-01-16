// Helper to generate random dates within last 3 months
const getRandomDate = () => {
  const today = new Date();
  const past = new Date();

  // 60% chance to be within last 7 days for better chart demos
  if (Math.random() > 0.4) {
    past.setDate(today.getDate() - 7);
  } else {
    past.setMonth(today.getMonth() - 2);
  }

  return new Date(
    past.getTime() + Math.random() * (today.getTime() - past.getTime())
  );
};

// Helper for random choice
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 1. Generate 20+ Saved Accounts (Contacts)
export const savedAccounts = Array.from({ length: 25 }, (_, i) => ({
  id: `ACC${1000 + i}`,
  name: [
    `Agus`,
    `Budi`,
    `Citra`,
    `Dewi`,
    `Eko`,
    `Fajar`,
    `Gita`,
    `Hendra`,
    `Indah`,
    `Joko`,
    `Kartika`,
    `Lestari`,
    `Mega`,
    `Nanda`,
    `Oscar`,
    `Putri`,
    `Rizky`,
    `Sari`,
    `Tono`,
    `Utami`,
    `Vina`,
    `Wahyu`,
    `Xena`,
    `Yudi`,
    `Zainal`,
  ][i],
  bank: choice(["BCA", "BRI", "Mandiri", "BNI", "Jago", "SeaBank"]),
  accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
  avatar: `https://ui-avatars.com/api/?name=${
    [
      `Agus`,
      `Budi`,
      `Citra`,
      `Dewi`,
      `Eko`,
      `Fajar`,
      `Gita`,
      `Hendra`,
      `Indah`,
      `Joko`,
      `Kartika`,
      `Lestari`,
      `Mega`,
      `Nanda`,
      `Oscar`,
      `Putri`,
      `Rizky`,
      `Sari`,
      `Tono`,
      `Utami`,
      `Vina`,
      `Wahyu`,
      `Xena`,
      `Yudi`,
      `Zainal`,
    ][i]
  }&background=random`,
  favorite: Math.random() > 0.7,
}));

// 2. Generate 50+ Transactions
export const transactions = Array.from({ length: 60 }, (_, i) => {
  const account = choice(savedAccounts);
  const type = choice([
    "Transfer Masuk",
    "Transfer Keluar",
    "Pembayaran",
    "Top Up",
  ]);
  const status =
    Math.random() > 0.1
      ? "Berhasil"
      : Math.random() > 0.5
      ? "Pending"
      : "Gagal";

  return {
    id: `TRX${5000 + i}`,
    date: getRandomDate().toISOString(),
    description:
      type === "Top Up" ? "Top Up E-Wallet" : `Transfer ke ${account.name}`,
    amount: Math.floor(10000 + Math.random() * 5000000),
    type: type,
    status: status,
    recipient: account.name,
    category: choice([
      "Belanja",
      "Makanan",
      "Transportasi",
      "Tagihan",
      "Hiburan",
      "Lainnya",
    ]),
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

// 3. Dashboard Stats
export const dashboardStats = {
  totalBalance: 15420000,
  monthlyIncome: 25000000,
  monthlyExpense: 12500000,
  savings: 12500000,
  activeCards: 2,
  pendingTransactions: transactions.filter((t) => t.status === "Pending")
    .length,
};

// 4. Monthly Expenses Data (for Charts)
export const expenseData = [
  { name: "Jan", income: 4000000, expense: 2400000 },
  { name: "Feb", income: 3000000, expense: 1398000 },
  { name: "Mar", income: 2000000, expense: 9800000 },
  { name: "Apr", income: 2780000, expense: 3908000 },
  { name: "May", income: 1890000, expense: 4800000 },
  { name: "Jun", income: 2390000, expense: 3800000 },
  { name: "Jul", income: 3490000, expense: 4300000 },
];

export const dummyUser = {
  name: "Admin Transaksiku",
  email: "admin@transaksiku.com",
  password: "admin123",
  avatar:
    "https://ui-avatars.com/api/?name=Admin+Transaksiku&background=4F46E5&color=fff",
};
