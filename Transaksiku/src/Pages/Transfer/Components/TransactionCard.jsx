const TransactionCard = ({ transaksi }) => (
  <div className="bg-white max-w-lg w-full p-4 rounded-xl shadow mx-auto mt-6">
    <div>
      <b>Tanggal:</b> {transaksi.tanggal}
    </div>
    <div>
      <b>Rekening Tujuan:</b> {transaksi.tujuan}
    </div>
    <div>
      <b>Nominal:</b> Rp {transaksi.nominal}
    </div>
    {transaksi.catatan && (
      <div>
        <b>Catatan:</b> {transaksi.catatan}
      </div>
    )}
    <div>
      <b>Status:</b> {transaksi.status}
    </div>
  </div>
);
export default TransactionCard;
