import React, { useState, useEffect } from "react";
import TransferForm from "./Components/TransferForm";
import TransactionList from "./Components/TransactionList";
import { transaksiList as dummyTransaksiList } from "@/Data/Dummy";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const TransferPage = () => {
  const [form, setForm] = useState({ tujuan: "", nominal: "", catatan: "" });
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTransaksiList(dummyTransaksiList);
      setLoading(false);
    }, 1500);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tujuan || !form.nominal) {
      toastError("Tujuan dan nominal wajib diisi!");
      return;
    }
    if (+form.nominal < 1000) {
      toastError("Nominal minimal Rp 1.000!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setTransaksiList((prev) => [
        {
          id: `TRX${prev.length + 1001}`,
          tanggal: new Date().toLocaleDateString("id-ID"),
          tujuan: form.tujuan,
          nominal: +form.nominal,
          catatan: form.catatan,
          status: "Berhasil",
        },
        ...prev,
      ]);
      setForm({ tujuan: "", nominal: "", catatan: "" });
      setLoading(false);
      toastSuccess("Transfer berhasil!");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white max-w-lg w-full p-8 rounded-xl shadow mx-auto mt-6">
        <TransferForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          disabled={loading}
        />
      </div>
      <div className="max-w-lg w-full mx-auto">
        {loading ? (
          <div className="text-center py-8 text-blue-500">Loading...</div>
        ) : (
          <TransactionList transaksiList={transaksiList} />
        )}
      </div>
    </div>
  );
};
export default TransferPage;
