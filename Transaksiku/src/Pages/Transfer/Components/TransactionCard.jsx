const TransactionCard = ({ transaksi }) => {
  const date = new Date(transaksi.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const isExpense =
    transaksi.type === "Transfer Keluar" || transaksi.type === "Pembayaran";

  return (
    <div className="bg-white w-full p-4 rounded-xl shadow mt-4 flex justify-between items-center hover:shadow-md transition-shadow">
      <div>
        <div className="text-sm text-gray-500 mb-1">{date}</div>
        <div className="font-semibold text-gray-800 text-lg">
          {transaksi.recipient?.name || transaksi.description}
        </div>
        <div className="text-sm text-gray-500">
          {transaksi.category} • {transaksi.type}
        </div>
        {transaksi.description && (
          <div className="text-xs text-gray-400 mt-1">
            {transaksi.description}
          </div>
        )}
      </div>
      <div className="text-right">
        <div
          className={`font-bold text-lg ${
            isExpense ? "text-red-500" : "text-green-500"
          }`}
        >
          {isExpense ? "-" : "+"} {formatter.format(transaksi.amount)}
        </div>
        <div
          className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-2 ${
            transaksi.status === "Berhasil"
              ? "bg-green-100 text-green-700"
              : transaksi.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {transaksi.status}
        </div>
      </div>
    </div>
  );
};
export default TransactionCard;
