import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Form from "@/Pages/Auth/Components/Form";
import Input from "@/Pages/Auth/Components/Input";
import Button from "@/Pages/Auth/Components/Button";
import Heading from "@/Pages/Auth/Components/Heading";
import { register } from "@/Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toastSuccess("Registrasi berhasil! Silakan login.");
      navigate("/");
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <Heading as="h2">Daftar Akun</Heading>
        <Form onSubmit={handleSubmit}>
          <Input
            name="nama"
            placeholder="Nama Lengkap"
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">
            Daftar
          </Button>
        </Form>
        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};
export default Register;
