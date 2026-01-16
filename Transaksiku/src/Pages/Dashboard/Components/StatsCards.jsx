import React from "react";
import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

const StatsCards = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Saldo",
      value: formatCurrency(stats.totalBalance),
      icon: <Wallet className="w-8 h-8 text-indigo-500" />,
      change: "+12% dari bulan lalu",
      positive: true,
      color: "bg-indigo-50 border-indigo-100",
    },
    {
      title: "Pemasukan",
      value: formatCurrency(stats.monthlyIncome),
      icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      change: "+5% dari bulan lalu",
      positive: true,
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Pengeluaran",
      value: formatCurrency(stats.monthlyExpense),
      icon: <TrendingDown className="w-8 h-8 text-rose-500" />,
      change: "-2% dari bulan lalu",
      positive: true, // Decreased expense is good, usually
      color: "bg-rose-50 border-rose-100",
    },
    {
      title: "Transaksi Pending",
      value: stats.pendingTransactions,
      icon: <CreditCard className="w-8 h-8 text-amber-500" />,
      change: "Perlu tindakan",
      positive: false,
      color: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-2xl border ${card.color} glass hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">{card.icon}</div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              {card.title}
            </p>
            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span
              className={`font-medium ${
                card.positive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {card.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
