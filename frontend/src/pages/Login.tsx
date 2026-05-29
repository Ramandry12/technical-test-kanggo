import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToastStore } from "../store/toastStore";
import { KeyRound, Mail, ArrowRight } from "lucide-react";
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Login gagal. Silakan coba lagi.";
      useToastStore.getState().addToast("error", msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Glass Container */}
      <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative z-10 animate-slide-up">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="font-heading text-2xl font-extrabold text-slate-100 tracking-tight mt-2">
            Kanggo Task Management
          </h1>
          <p className="text-sm text-slate-400">
            Silahkan login untuk masuk ke dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-sm tracking-wide shadow-md shadow-indigo-500/10 cursor-pointer transition-all hover:shadow-indigo-500/20 disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? "Sedang Masuk..." : "Masuk"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Redirection */}
        <div className="text-center text-sm text-slate-400 border-t border-slate-850 pt-4">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
