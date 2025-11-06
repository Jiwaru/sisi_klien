// ./TransferForm.jsx
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";
import Form from "@/Pages/Layouts/Components/Form";
const TransferForm = ({ form, onChange, onSubmit, disabled }) => (
  <Form onSubmit={onSubmit} className="mb-6">
    <div>
      <Label htmlFor="tujuan">Nama Rekening Tujuan</Label>
      <Input
        type="text"
        name="tujuan"
        value={form.tujuan}
        onChange={onChange}
        placeholder="Nama penerima"
        required
        disabled={disabled}
      />
    </div>
    <div>
      <Label htmlFor="nominal">Nominal</Label>
      <Input
        type="number"
        name="nominal"
        value={form.nominal}
        onChange={onChange}
        min="1000"
        placeholder="Minimal Rp 1.000"
        required
        disabled={disabled}
      />
    </div>
    <div>
      <Label htmlFor="catatan">Catatan</Label>
      <Input
        type="text"
        name="catatan"
        value={form.catatan}
        onChange={onChange}
        placeholder="(Opsional) Isi pesan"
        disabled={disabled}
      />
    </div>
    <Button type="submit" className="w-full" disabled={disabled}>
      {disabled ? "Loading..." : "Transfer"}
    </Button>
  </Form>
);
export default TransferForm;
