const Input = ({
  type,
  name,
  value,
  onChange,
  readOnly = false,
  required = false,
  placeholder,
  className = "",
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value} // Menghubungkan nilai input dengan State
      onChange={onChange} // Menghubungkan event ketik dengan State
      readOnly={readOnly} // Agar NIM tidak bisa diedit saat mode Edit
      required={required}
      placeholder={placeholder}
      className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-200 ${className}`}
    />
  );
};

export default Input;
