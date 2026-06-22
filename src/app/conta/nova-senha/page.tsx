"use client";

import React, { useState, useEffect, Suspense } from "react";
import { account } from "../../../lib/appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function NovaSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId") || "";
  const secret = searchParams.get("secret") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!userId || !secret) {
      setError("Link inválido ou expirado. Solicite um novo link de recuperação.");
    }
  }, [userId, secret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    if (password.length < 8) { setError("A senha deve ter no mínimo 8 caracteres."); return; }
    setIsLoading(true);
    try {
      await account.updateRecovery(userId, secret, password);
      setDone(true);
      setTimeout(() => router.replace("/conta"), 3000);
    } catch {
      setError("Link expirado ou inválido. Solicite um novo link de recuperação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1E7E2] flex flex-col">
      <header className="py-6 text-center border-b border-[#C8A97E]/15">
        <a href="/" className="font-serif italic text-3xl tracking-widest text-neutral-900 hover:text-[#C8A97E] transition-colors">
          VisCaree
        </a>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
            {done ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-emerald-500" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-semibold text-neutral-800">Senha redefinida!</h2>
                <p className="text-neutral-500 text-sm">Sua nova senha foi salva. Redirecionando para o login...</p>
                <Loader2 size={20} className="animate-spin text-[#C8A97E] mx-auto mt-2" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold text-neutral-800 mb-1">Nova senha</h1>
                  <p className="text-neutral-400 text-sm">Escolha uma senha segura para a sua conta VisCaree.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="new-password" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Nova senha</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                    <input id="new-password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres" disabled={!userId || !secret}
                      className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-12 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors disabled:bg-neutral-50 disabled:text-neutral-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600" aria-label="Mostrar senha">
                      {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirm-password" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Confirmar nova senha</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                    <input id="confirm-password" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repita a nova senha" disabled={!userId || !secret}
                      className={`w-full border focus:outline-none pl-10 pr-4 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors disabled:bg-neutral-50 disabled:text-neutral-400 ${confirm && password !== confirm ? "border-red-300 focus:border-red-400" : "border-neutral-200 focus:border-[#C8A97E]"}`} />
                  </div>
                  {confirm && password !== confirm && <p className="text-[10px] text-red-400 mt-1">As senhas não coincidem.</p>}
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={isLoading || !userId || !secret}
                  className="w-full py-4 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-60 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2">
                  {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Salvando...</> : "Salvar Nova Senha"}
                </button>

                {(!userId || !secret) && (
                  <p className="text-center text-neutral-400 text-xs">
                    <a href="/conta" className="text-[#C8A97E] font-semibold hover:underline">Solicitar novo link de recuperação</a>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NovaSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F1E7E2] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#C8A97E]" />
      </div>
    }>
      <NovaSenhaContent />
    </Suspense>
  );
}
