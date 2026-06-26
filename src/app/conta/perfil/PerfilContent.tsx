"use client";

import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Shield, LogOut,
  Save, Loader2, CheckCircle, AlertCircle, ChevronRight, ShoppingBag
} from "lucide-react";

type Section = "dados" | "endereco" | "seguranca";

export default function PerfilContent() {
  const { user, profile, isLoggedIn, isLoading, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("dados");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    cpf: "",
    birth_date: "",
    address_street: "",
    address_number: "",
    address_complement: "",
    address_district: "",
    address_city: "",
    address_state: "",
    address_zip: "",
    newsletter: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        cpf: profile.cpf || "",
        birth_date: profile.birth_date || "",
        address_street: profile.address_street || "",
        address_number: profile.address_number || "",
        address_complement: profile.address_complement || "",
        address_district: profile.address_district || "",
        address_city: profile.address_city || "",
        address_state: profile.address_state || "",
        address_zip: profile.address_zip || "",
        newsletter: profile.newsletter ?? true,
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/conta");
  }, [isLoggedIn, isLoading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMsg(null);
    try {
      await updateProfile(form);
      setSaveMsg({ type: "success", text: "Dados atualizados com sucesso!" });
    } catch {
      setSaveMsg({ type: "error", text: "Erro ao salvar. Tente novamente." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1E7E2] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#C8A97E]" />
      </div>
    );
  }

  const sections = [
    { id: "dados" as Section, label: "Dados Pessoais", icon: User },
    { id: "endereco" as Section, label: "Endereço de Entrega", icon: MapPin },
    { id: "seguranca" as Section, label: "Segurança", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F1E7E2]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8A97E]/15 py-5 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-serif italic text-2xl tracking-widest text-neutral-900 hover:text-[#C8A97E] transition-colors">
            VisCaree
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-[#C8A97E] transition-colors tracking-wider uppercase font-medium">
              <ShoppingBag size={15} strokeWidth={1.5} />
              Continuar comprando
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-red-500 transition-colors tracking-wider uppercase font-medium">
              <LogOut size={15} strokeWidth={1.5} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <p className="text-neutral-500 text-sm mb-1">Bem-vinda de volta,</p>
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide">
            {profile?.name || user?.name || "Cliente VisCaree"}
          </h1>
          <p className="text-neutral-400 text-sm mt-1">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <nav className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              {sections.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-sm font-medium transition-all duration-200 border-b border-neutral-50 last:border-0 ${
                    activeSection === id ? "bg-[#C8A97E]/10 text-[#C8A97E]" : "text-neutral-600 hover:bg-neutral-50"
                  }`}>
                  <span className="flex items-center gap-3"><Icon size={16} strokeWidth={1.5} />{label}</span>
                  <ChevronRight size={14} className="text-neutral-300" />
                </button>
              ))}
            </nav>
          </aside>

          <main className="md:col-span-3">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <form onSubmit={handleSave}>
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">

                  {activeSection === "dados" && (
                    <div className="space-y-5">
                      <h2 className="text-base font-semibold text-neutral-800 mb-6">Dados Pessoais</h2>
                      <div>
                        <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Nome completo</label>
                        <div className="relative">
                          <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Email</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                          <input type="email" value={user?.email || ""} disabled
                            className="w-full border border-neutral-100 bg-neutral-50 pl-10 pr-4 py-3 text-sm text-neutral-400 rounded-xl cursor-not-allowed" />
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">O email não pode ser alterado.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Telefone</label>
                          <div className="relative">
                            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              placeholder="(00) 00000-0000"
                              className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Data de Nascimento</label>
                          <input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                            className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="accent-[#C8A97E] w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-neutral-600">Receber novidades e ofertas exclusivas por email</span>
                      </label>
                    </div>
                  )}

                  {activeSection === "endereco" && (
                    <div className="space-y-5">
                      <h2 className="text-base font-semibold text-neutral-800 mb-6">Endereço de Entrega</h2>
                      <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-2">
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Rua / Avenida</label>
                          <input type="text" value={form.address_street} onChange={(e) => setForm({ ...form, address_street: e.target.value })}
                            placeholder="Ex: Rua das Flores"
                            className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Número</label>
                          <input type="text" value={form.address_number} onChange={(e) => setForm({ ...form, address_number: e.target.value })}
                            placeholder="123" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Complemento</label>
                          <input type="text" value={form.address_complement} onChange={(e) => setForm({ ...form, address_complement: e.target.value })}
                            placeholder="Apto, Sala, etc." className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-1">
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Bairro</label>
                          <input type="text" value={form.address_district} onChange={(e) => setForm({ ...form, address_district: e.target.value })}
                            placeholder="Bairro" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Cidade</label>
                          <input type="text" value={form.address_city} onChange={(e) => setForm({ ...form, address_city: e.target.value })}
                            placeholder="Cidade" className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">CEP / CAP</label>
                          <input type="text" value={form.address_zip} onChange={(e) => setForm({ ...form, address_zip: e.target.value })}
                            placeholder="Ex: 88100" maxLength={9} className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">Estado / Província</label>
                          <input type="text" value={form.address_state} onChange={(e) => setForm({ ...form, address_state: e.target.value.toUpperCase() })}
                            placeholder="Ex: SP ou CZ" maxLength={2} className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "seguranca" && (
                    <div className="space-y-5">
                      <h2 className="text-base font-semibold text-neutral-800 mb-6">Segurança</h2>
                      <div className="bg-[#F8F5F2] rounded-2xl p-6 border border-[#C8A97E]/15">
                        <div className="flex items-start gap-4">
                          <Shield size={20} className="text-[#C8A97E] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <p className="font-medium text-neutral-800 text-sm mb-1">Seus dados estão protegidos</p>
                            <p className="text-neutral-500 text-xs leading-relaxed">
                              Sua conta está protegida pela infraestrutura segura do Appwrite Cloud. Todos os dados são criptografados e armazenados em conformidade com a LGPD.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 mb-2">Email de acesso</p>
                        <p className="text-sm text-neutral-500 bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100">{user?.email}</p>
                      </div>
                      <button type="button" onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-3 border border-red-200 text-red-500 hover:bg-red-50 text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors">
                        <LogOut size={14} />
                        Sair da conta
                      </button>
                    </div>
                  )}
                </div>

                {activeSection !== "seguranca" && (
                  <div className="flex items-center justify-between mt-5">
                    {saveMsg ? (
                      <div className={`flex items-center gap-2 text-sm ${saveMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {saveMsg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {saveMsg.text}
                      </div>
                    ) : <div />}
                    <button type="submit" disabled={isSaving}
                      className="flex items-center gap-2 px-7 py-3 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-60 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300">
                      {isSaving ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : <><Save size={14} /> Salvar Dados</>}
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
