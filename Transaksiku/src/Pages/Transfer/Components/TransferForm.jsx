import React, { useState } from "react";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";
import Form from "@/Pages/Layouts/Components/Form";
import { savedAccounts } from "@/Data/Dummy";
import { ChevronDown, Clock, Save, FileText } from "lucide-react";

const TransferForm = ({
  form,
  onChange,
  onSubmit,
  disabled,
  onSaveTemplate,
}) => {
  const [useSavedAccount, setUseSavedAccount] = useState(false);

  return (
    <Form onSubmit={onSubmit}>
      <div className="space-y-4">
        {/* Destination Account Selection */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="tujuan">Tujuan Transfer</Label>
            <button
              type="button"
              onClick={() => setUseSavedAccount(!useSavedAccount)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {useSavedAccount ? "Input Manual" : "Pilih dari Kontak"}
            </button>
          </div>

          {useSavedAccount ? (
            <div className="relative">
              <select
                name="tujuan"
                value={form.tujuan}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none"
                disabled={disabled}
              >
                <option value="">-- Pilih Rekening --</option>
                {savedAccounts.map((acc) => (
                  <option key={acc.id} value={acc.name}>
                    {acc.name} - {acc.bank} ({acc.accountNumber})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          ) : (
            <Input
              type="text"
              name="tujuan"
              value={form.tujuan}
              onChange={onChange}
              placeholder="Masukkan nama penerima"
              required
              disabled={disabled}
            />
          )}
        </div>

        {/* Nominal */}
        <div>
          <Label htmlFor="nominal">Nominal (Rp)</Label>
          <Input
            type="number"
            name="nominal"
            value={form.nominal}
            onChange={onChange}
            min="1000"
            placeholder="0"
            required
            disabled={disabled}
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="catatan">Catatan</Label>
          <Input
            type="text"
            name="catatan"
            value={form.catatan}
            onChange={onChange}
            placeholder="Berita acara / pesan"
            disabled={disabled}
          />
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 py-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <Clock size={16} className="text-gray-400" />
            <span>Jadwalkan</span>
          </label>
          <button
            type="button"
            onClick={onSaveTemplate}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
          >
            <Save size={16} />
            <span>Simpan Template</span>
          </button>
        </div>

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={disabled}
        >
          {disabled ? (
            <>Loading...</>
          ) : (
            <>
              <FileText size={18} />
              Kirim Sekarang
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};
export default TransferForm;
