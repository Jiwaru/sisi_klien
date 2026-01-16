import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Components
import Input from "@/Pages/Layouts/Components/Input";
import Button from "@/Pages/Layouts/Components/Button";
import Label from "@/Pages/Layouts/Components/Label";

const AccountFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [form, setForm] = useState({
    name: "",
    bank: "",
    accountNumber: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: "", bank: "BCA", accountNumber: "" });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl scale-100 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold mb-4">
          {initialData ? "Edit Rekening" : "Tambah Rekening Baru"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nama Pemilik</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Budi Santoso"
              required
            />
          </div>

          <div>
            <Label>Bank</Label>
            <select
              name="bank"
              value={form.bank}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              {[
                "BCA",
                "BRI",
                "Mandiri",
                "BNI",
                "Jago",
                "SeaBank",
                "CIMB Niaga",
              ].map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Nomor Rekening</Label>
            <Input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 1234567890"
              required
            />
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {initialData ? "Simpan Perubahan" : "Tambah Rekening"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountFormModal;
