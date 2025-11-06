import TransactionCard from "./TransactionCard";
const TransactionList = ({ transaksiList }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Daftar Transaksi</h3>
    {transaksiList.length === 0 ? (
      <div className="text-gray-400">Belum ada transaksi.</div>
    ) : (
      transaksiList.map((tx) => <TransactionCard key={tx.id} transaksi={tx} />)
    )}
  </div>
);
export default TransactionList;
