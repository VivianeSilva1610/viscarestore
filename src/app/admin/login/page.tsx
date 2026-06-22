"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const { login, adminUser } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to admin
  React.useEffect(() => {
    if (adminUser) router.replace("/admin");
  }, [adminUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch {
      setError("Email ou senha incorretos. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8A97E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C8A97E]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-10">
            <p className="font-serif italic text-4xl tracking-widest text-[#C8A97E] mb-2">VisCaree</p>
            <p className="text-neutral-500 text-xs tracking-widest uppercase font-light">Painel Administrativo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-xs text-neutral-400 tracking-widest uppercase font-medium block">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" strokeWidth={1.5} />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@viscaree.com"
                  className="w-full bg-neutral-800 border border-white/10 focus:border-[#C8A97E]/60 focus:outline-none pl-11 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 rounded-xl transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-xs text-neutral-400 tracking-widest uppercase font-medium block">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" strokeWidth={1.5} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-800 border border-white/10 focus:border-[#C8A97E]/60 focus:outline-none pl-11 pr-12 py-3.5 text-sm text-white placeholder-neutral-600 rounded-xl transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-3 bg-red-950/50 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} strokeWidth={1.5} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#C8A97E] hover:bg-[#b8976b] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs tracking-[0.3em] uppercase font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  A verificar...
                </>
              ) : (
                "Entrar no Painel"
              )}
            </button>
          </form>

          <p className="text-center text-neutral-600 text-[10px] tracking-wider mt-8 uppercase">
            Acesso exclusivo para administradores VisCaree
          </p>
        </div>
      </div>
    </div>
  );
}
