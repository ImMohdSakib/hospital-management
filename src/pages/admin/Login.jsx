import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/webadmin/dashboard";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Username aur Password required hai.");
      return;
    }

    setLoading(true);

    const result = await login(
      formData.username,
      formData.password
    );

    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-teal-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
            <Lock className="text-teal-600" size={35} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Hospital Admin
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Username
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-600"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Login"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 border-t pt-5 text-center">
          <p className="text-xs text-slate-400">
            Hospital Management System
          </p>
        </div>
      </motion.div>
    </div>
  );
}