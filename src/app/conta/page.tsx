"use client";

import React, { useState } from "react";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { account } from "../../lib/appwrite";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

type Tab = "login" | "cadastro";
type View = "main" | "recuperar";

function ContaContent() {
  const { login, register, isLoggedIn } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [view, setView] = useState<View>("main");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  // Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    if (isLoggedIn) router.replace("/conta/perfil");
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      router.replace("/conta/perfil");
    } catch {
      setError("Email ou senha incorretos. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (regPassword !== regConfirm) { setError("As senhas não coincidem."); return; }
    if (regPassword.length < 8) { setError("A senha deve ter no mínimo 8 caracteres."); return; }
    setIsLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      setSuccess("Conta criada com sucesso! Bem-vinda à VisCaree.");
      setTimeout(() => router.replace("/conta/perfil"), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("already exists") || msg.includes("conflict")) {
        setError("Este email já está cadastrado. Tente fazer login.");
      } else {
        setError("Erro ao criar conta. Verifique seus dados e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setIsLoading(true);
    try {
      // Appwrite sends a password reset email with a link to /conta/nova-senha
      await account.createRecovery(
        recoveryEmail,
        `${window.location.origin}/conta/nova-senha`
      );
      setRecoverySent(true);
    } catch {
      setError("Email não encontrado. Verifique o endereço digitado.");
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

          <AnimatePresence mode="wait">
            {view === "recuperar" ? (
              /* ---- RECUPERAR SENHA ---- */
              <motion.div key="recuperar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                <button onClick={() => { setView("main"); setError(""); setRecoverySent(false); }}
                  className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700 text-sm mb-6 transition-colors">
                  <ArrowLeft size={15} strokeWidth={1.5} />
                  Voltar ao login
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
                  {recoverySent ? (
                    <div className="text-center space-y-4 py-4">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={32} className="text-emerald-500" strokeWidth={1.5} />
                      </div>
                      <h2 className="text-lg font-semibold text-neutral-800">Email enviado!</h2>
                      <p className="text-neutral-500 text-sm leading-relaxed">
                        Enviamos um link de redefinição para <strong className="text-neutral-700">{recoveryEmail}</strong>.
                        Verifique sua caixa de entrada (e a pasta spam).
                      </p>
                      <button onClick={() => { setView("main"); setRecoverySent(false); setRecoveryEmail(""); }}
                        className="mt-2 text-[#C8A97E] text-sm font-semibold hover:underline">
                        Voltar ao login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRecovery} className="space-y-5">
                      <div>
                        <h1 className="text-xl font-semibold text-neutral-800 mb-1">Recuperar senha</h1>
                        <p className="text-neutral-400 text-sm">Digite seu email para receber um link de redefinição.</p>
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="recovery-email" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Email cadastrado</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                          <input id="recovery-email" type="email" required value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                      </div>
                      {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"><AlertCircle size={15} className="flex-shrink-0" /><span>{error}</span></div>}
                      <button type="submit" disabled={isLoading}
                        className="w-full py-4 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-60 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2">
                        {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Enviando...</> : "Enviar link de recuperação"}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            ) : (
              /* ---- LOGIN / CADASTRO ---- */
              <motion.div key="main" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                <div className="flex bg-white rounded-2xl p-1.5 mb-8 shadow-sm border border-neutral-100">
                  {(["login", "cadastro"] as Tab[]).map((t) => (
                    <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                      className={`flex-1 py-3 text-xs tracking-widest uppercase font-semibold rounded-xl transition-all duration-300 ${tab === t ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                      {t === "login" ? "Entrar" : "Criar Conta"}
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
                  <AnimatePresence mode="wait">
                    {tab === "login" ? (
                      <motion.form key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }} onSubmit={handleLogin} className="space-y-5">
                        <div>
                          <h1 className="text-xl font-semibold text-neutral-800 mb-1">Bem-vinda de volta</h1>
                          <p className="text-neutral-400 text-sm">Entre na sua conta VisCaree</p>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="login-email" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Email</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input id="login-email" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="seu@email.com" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label htmlFor="login-password" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Senha</label>
                            <button type="button" onClick={() => { setView("recuperar"); setRecoveryEmail(loginEmail); setError(""); }}
                              className="text-[10px] text-[#C8A97E] hover:underline font-medium tracking-wide">
                              Esqueceu a senha?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input id="login-password" type={showLoginPassword ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="••••••••" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-12 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors" />
                            <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600" aria-label="Mostrar senha">
                              {showLoginPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                            </button>
                          </div>
                        </div>
                        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"><AlertCircle size={15} className="flex-shrink-0" /><span>{error}</span></div>}
                        <button type="submit" disabled={isLoading}
                          className="w-full py-4 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-60 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2">
                          {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> A verificar...</> : "Entrar na Conta"}
                        </button>
                        <p className="text-center text-neutral-400 text-xs">
                          Não tem conta?{" "}<button type="button" onClick={() => { setTab("cadastro"); setError(""); }} className="text-[#C8A97E] font-semibold hover:underline">Criar agora</button>
                        </p>
                      </motion.form>
                    ) : (
                      <motion.form key="cadastro" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} onSubmit={handleRegister} className="space-y-5">
                        <div>
                          <h1 className="text-xl font-semibold text-neutral-800 mb-1">Criar sua conta</h1>
                          <p className="text-neutral-400 text-sm">Junte-se à curadoria exclusiva VisCaree</p>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="reg-name" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Nome completo</label>
                          <div className="relative">
                            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input id="reg-name" type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                              placeholder="Seu nome completo" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="reg-email" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Email</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input id="reg-email" type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="seu@email.com" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="reg-password" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Senha</label>
                          <div className="relative">
                            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input id="reg-password" type={showRegPassword ? "text" : "password"} required value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                              placeholder="Mínimo 8 caracteres" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-12 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors" />
                            <button type="button" onClick={() => setShowRegPassword(!showRegPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600" aria-label="Mostrar senha">
                              {showRegPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="reg-confirm" className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">Confirmar senha</label>
                          <div className="relative">
                            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input id="reg-confirm" type="password" required value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                              placeholder="Repita a senha"
                              className={`w-full border focus:outline-none pl-10 pr-4 py-3.5 text-sm text-neutral-800 rounded-xl transition-colors ${regConfirm && regPassword !== regConfirm ? "border-red-300 focus:border-red-400" : "border-neutral-200 focus:border-[#C8A97E]"}`} />
                          </div>
                          {regConfirm && regPassword !== regConfirm && (
                            <p className="text-[10px] text-red-400 mt-1">As senhas não coincidem.</p>
                          )}
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-0.5 accent-[#C8A97E] w-4 h-4 flex-shrink-0" />
                          <span className="text-xs text-neutral-500 leading-relaxed">Quero receber novidades, lançamentos exclusivos e ofertas especiais da VisCaree.</span>
                        </label>
                        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"><AlertCircle size={15} className="flex-shrink-0" /><span>{error}</span></div>}
                        {success && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl"><CheckCircle size={15} className="flex-shrink-0" /><span>{success}</span></div>}
                        <button type="submit" disabled={isLoading}
                          className="w-full py-4 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-60 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2">
                          {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> A criar...</> : "Criar Minha Conta"}
                        </button>
                        <p className="text-center text-[9px] text-neutral-400 leading-relaxed">
                          Ao criar uma conta, você concorda com nossa{" "}
                          <a href="#" className="text-[#C8A97E] underline">Política de Privacidade</a> e{" "}
                          <a href="#" className="text-[#C8A97E] underline">Termos de Uso</a>. Seus dados estão protegidos pela LGPD.
                        </p>
                        <p className="text-center text-neutral-400 text-xs">
                          Já tem conta?{" "}<button type="button" onClick={() => { setTab("login"); setError(""); }} className="text-[#C8A97E] font-semibold hover:underline">Entrar</button>
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ContaPage() {
  return (
    <AuthProvider>
      <ContaContent />
    </AuthProvider>
  );
}
