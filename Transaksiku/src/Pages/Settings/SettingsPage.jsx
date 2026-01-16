import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Lock, Moon, Sun, Shield, Bell } from "lucide-react";
import { useTheme } from "@/Context/ThemeContext";
import Button from "@/Pages/Layouts/Components/Button";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import { toastSuccess } from "@/Utils/Helpers/ToastHelpers";
import { dummyUser } from "@/Data/Dummy";

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  // -- Profile State --
  const [profile, setProfile] = useState(dummyUser);

  // -- Password State --
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // -- Toggles --
  const [settings, setSettings] = useState({
    twoFactor: true,
    emailNotif: true,
    smsNotif: false,
  });

  // -- Mock Update Profile Mutation --
  const updateProfileMutation = useMutation({
    mutationFn: async (newData) => {
      // Simulate API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real app, we would update backend
      return newData;
    },
    onSuccess: (data) => {
      setProfile((prev) => ({ ...prev, ...data }));
      toastSuccess("Profil berhasil diperbarui!");
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    toastSuccess("Password berhasil diubah (Simulasi)");
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Pengaturan Akun</h2>
      <p className="text-gray-500 mb-8">
        Kelola preferensi dan keamanan akun Anda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Navigation / Simple Toggles */}
        <div className="space-y-6">
          {/* Theme Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-semibold">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <h3>Tampilan</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Mode Gelap</span>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  isDark ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    isDark ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Security Toggles */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-semibold">
              <Shield size={20} />
              <h3>Keamanan</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">2-Factor Auth</span>
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    twoFactor: !prev.twoFactor,
                  }))
                }
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  settings.twoFactor ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.twoFactor ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Notifikasi Login</span>
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotif: !prev.emailNotif,
                  }))
                }
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  settings.emailNotif ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.emailNotif ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 text-indigo-600 font-semibold border-b border-gray-50 pb-2">
              <User size={20} />
              <h3>Edit Profil</h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-2 border-indigo-100"
                />
                <Button type="button" size="sm" variant="secondary">
                  Ubah Foto
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 text-indigo-600 font-semibold border-b border-gray-50 pb-2">
              <Lock size={20} />
              <h3>Ganti Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label>Password Saat Ini</Label>
                <Input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Password Baru</Label>
                  <Input
                    type="password"
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Konfirmasi Password</Label>
                  <Input
                    type="password"
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword({ ...password, confirm: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
