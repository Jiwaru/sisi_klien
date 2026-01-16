import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import TransferForm from "./Components/TransferForm";
import TransactionList from "./Components/TransactionList";
import { transactions as dummyTransaksiList } from "@/Data/Dummy";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { Loader2 } from "lucide-react";

const TransferPage = () => {
  const [form, setForm] = useState({ tujuan: "", nominal: "", catatan: "" });
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate initial fetch delay
    const timer = setTimeout(() => {
      setTransaksiList(dummyTransaksiList);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveTemplate = () => {
    if (!form.tujuan) return toastError("Isi tujuan terlebih dahulu!");
    toastSuccess("Template transfer berhasil disimpan!");
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

    // Confirmation Modal
    Swal.fire({
      title: "Konfirmasi Transfer",
      html: `
        <div class="text-left bg-gray-50 p-4 rounded-lg text-sm">
            <div class="flex justify-between mb-2">
                <span class="text-gray-500">Tujuan:</span>
                <span class="font-bold text-gray-800">${form.tujuan}</span>
            </div>
            <div class="flex justify-between mb-2">
                <span class="text-gray-500">Nominal:</span>
                <span class="font-bold text-indigo-600">Rp ${Number(
                  form.nominal
                ).toLocaleString("id-ID")}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Catatan:</span>
                <span class="text-gray-800">${form.catatan || "-"}</span>
            </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#4F46E5",
    }).then((result) => {
      if (result.isConfirmed) {
        executeTransfer();
      }
    });
  };

  const executeTransfer = () => {
    setLoading(true);
    setTimeout(() => {
      // Optimistic update
      const newTrx = {
        id: `TRX${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        description: form.catatan || `Transfer ke ${form.tujuan}`,
        amount: +form.nominal,
        type: "Transfer Keluar",
        status: "Berhasil",
        recipient: form.tujuan, // Store string name as per our fix
        category: "Lainnya",
      };

      setTransaksiList((prev) => [newTrx, ...prev]);

      setForm({ tujuan: "", nominal: "", catatan: "" });
      setLoading(false);

      // Digital Receipt (SweetAlert success)
      Swal.fire({
        title: "Transfer Berhasil!",
        html: `<p class="text-gray-500 text-sm mb-4">Ref: ${newTrx.id}</p>`,
        icon: "success",
        confirmButtonText: "Selesai",
        confirmButtonColor: "#10B981",
      });
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Transfer Dana
          </h2>
          <p className="text-gray-500 mt-1">
            Kirim uang ke rekening tersimpan atau baru.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h3 className="font-bold text-lg text-gray-800 mb-6 border-b border-gray-50 pb-4">
              Form Transfer
            </h3>
            <TransferForm
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onSaveTemplate={handleSaveTemplate}
              disabled={loading}
            />
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">
                Riwayat Transfer
              </h3>
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              )}
            </div>
            <div className="p-6">
              <TransactionList transaksiList={transaksiList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransferPage;
