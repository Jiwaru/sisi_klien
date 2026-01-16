import React, { useState } from "react";
import Swal from "sweetalert2";
import TransferForm from "./Components/TransferForm";
import TransactionList from "./Components/TransactionList";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { Loader2 } from "lucide-react";
import { useRecentTransfers, useCreateTransfer } from "./Hooks/useTransfer";

const TransferPage = () => {
  const [form, setForm] = useState({ tujuan: "", nominal: "", catatan: "" });

  const { data: transaksiList, isLoading } = useRecentTransfers();
  const transferMutation = useCreateTransfer();

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
    transferMutation.mutate(form, {
      onSuccess: (data) => {
        setForm({ tujuan: "", nominal: "", catatan: "" });

        // Digital Receipt (SweetAlert success)
        Swal.fire({
          title: "Transfer Berhasil!",
          html: `<p class="text-gray-500 text-sm mb-4">Ref: ${data.id}</p>`,
          icon: "success",
          confirmButtonText: "Selesai",
          confirmButtonColor: "#10B981",
        });
      },
      onError: (err) => {
        toastError("Transfer Gagal: " + err.message);
      },
    });
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
              disabled={isLoading || transferMutation.isPending}
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
              {(isLoading || transferMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              )}
            </div>
            <div className="p-6">
              <TransactionList transaksiList={transaksiList || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransferPage;
