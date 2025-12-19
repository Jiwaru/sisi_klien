import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; // Import Context

// Komponen UI
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Form from "@/Pages/Auth/Components/Form";
import Input from "@/Pages/Auth/Components/Input";
import Button from "@/Pages/Auth/Components/Button";
import Label from "@/Pages/Auth/Components/Label";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStateContext(); // Ambil fungsi setUser
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);

      setUser(user); // 👈 Simpan user ke Context
      toastSuccess("Login berhasil! Selamat datang.");

      // Delay sedikit agar state terupdate
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 100);
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <Heading as="h2">Login</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Masukkan email"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Masukkan password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </Card>
  );
};

export default Login;
