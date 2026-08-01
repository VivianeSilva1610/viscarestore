"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { CheckCircle, Sparkles, ChevronRight, RefreshCw, Clock } from "lucide-react";

const FEATURES = {
  it: [
    "Routine skincare personalizzata per il tuo tipo di pelle",
    "Accesso illimitato all'app VisCaree",
    "Consigli di esperti aggiornati settimanalmente",
    "Prodotti selezionati con ingredienti autentici",
    "Guida passo per passo mattina e sera",
  ],
  pt: [
    "Rotina de skincare personalizada para seu tipo de pele",
    "Acesso ilimitado ao app VisCaree",
    "Dicas de especialistas atualizadas semanalmente",
    "Produtos selecionados com ingredientes autênticos",
    "Guia passo a passo manhã e noite",
  ],
};

function PlanPage() {
  const { language } = useLanguage();
  const isPt = language === "pt";
  const features = FEATURES[isPt ? "pt" : "it"];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"30dias" | "mensal" | null>(null);
  const [error, setError] = useState("");

  const handleCheckout = async (plan: "30dias" | "mensal") => {
    setError("");
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail: email || undefined, language, plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || (isPt ? "Erro ao iniciar pagamento." : "Errore nel pagamento."));
        setLoading(null);
      }
    } catch {
      setError(isPt ? "Erro de conexão." : "Errore di connessione.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-8 h-[1px] bg-[#C8A97E]" />
              <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold flex items-center gap-1.5">
                <Sparkles size={10} />
                VisCaree App
              </span>
              <span className="w-8 h-[1px] bg-[#C8A97E]" />
            </div>
            <h1 className="font-serif-premium text-4xl sm:text-5xl text-neutral-900 font-light tracking-wide mb-5 leading-tight">
              {isPt ? "Rotina Skincare" : "Routine Skincare"}
              <br />
              <span className="text-[#C8A97E]">VisCaree</span>
            </h1>
            <p className="font-sans-premium text-neutral-500 text-sm max-w-lg mx-auto leading-relaxed">
              {isPt
                ? "Descubra a rotina ideal para a sua pele com produtos selecionados e orientação especializada."
                : "Scopri la routine ideale per la tua pelle con prodotti selezionati e consulenza esperta."}
            </p>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12 max-w-3xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle size={14} className="text-[#C8A97E] shrink-0 mt-0.5" />
                <p className="font-sans-premium text-xs text-neutral-600 leading-relaxed">{f}</p>
              </div>
            ))}
          </div>

          {/* E-mail field (shared) */}
          <div className="max-w-sm mx-auto mb-8">
            <label className="font-sans-premium text-[10px] tracking-widest uppercase text-neutral-500 block mb-2 text-center">
              E-mail {isPt ? "(opcional)" : "(opzionale)"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isPt ? "seu@email.com" : "tua@email.com"}
              className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors text-center"
            />
          </div>

          {error && (
            <p className="font-sans-premium text-xs text-red-500 text-center mb-6">{error}</p>
          )}

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

            {/* 30 days */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#F1E7E2] flex items-center justify-center mb-4">
                <Clock size={20} className="text-[#C8A97E]" />
              </div>
              <span className="font-sans-premium text-[10px] tracking-[0.2em] uppercase text-neutral-400 block mb-1">
                {isPt ? "Acesso" : "Accesso"}
              </span>
              <h2 className="font-serif-premium text-2xl text-neutral-900 font-light mb-1">
                30 {isPt ? "dias" : "giorni"}
              </h2>
              <p className="font-sans-premium text-xs text-neutral-500 mb-6 leading-relaxed">
                {isPt ? "Pagamento único · Sem renovação automática." : "Pagamento unico · Nessun rinnovo automatico."}
              </p>
              <button
                onClick={() => handleCheckout("30dias")}
                disabled={loading !== null}
                className="w-full py-3.5 bg-neutral-900 text-white font-sans-premium text-[10px] tracking-[0.2em] uppercase hover:bg-[#C8A97E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {loading === "30dias"
                  ? (isPt ? "Redirecionando…" : "Reindirizzando…")
                  : (isPt ? "Comprar acesso" : "Acquista accesso")}
                {loading !== "30dias" && <ChevronRight size={13} />}
              </button>
            </div>

            {/* Mensal */}
            <div className="bg-neutral-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="font-sans-premium text-[8px] tracking-widest uppercase bg-[#C8A97E] text-white px-2 py-1 rounded-full font-bold">
                  {isPt ? "Melhor valor" : "Miglior valore"}
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <RefreshCw size={20} className="text-[#C8A97E]" />
              </div>
              <span className="font-sans-premium text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-1">
                {isPt ? "Assinatura" : "Abbonamento"}
              </span>
              <h2 className="font-serif-premium text-2xl text-white font-light mb-1">
                {isPt ? "Mensal" : "Mensile"}
              </h2>
              <p className="font-sans-premium text-xs text-white/50 mb-6 leading-relaxed">
                {isPt ? "Renova automaticamente todo mês. Cancele quando quiser." : "Si rinnova automaticamente ogni mese. Cancella quando vuoi."}
              </p>
              <button
                onClick={() => handleCheckout("mensal")}
                disabled={loading !== null}
                className="w-full py-3.5 bg-[#C8A97E] text-white font-sans-premium text-[10px] tracking-[0.2em] uppercase hover:bg-[#b8926a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {loading === "mensal"
                  ? (isPt ? "Redirecionando…" : "Reindirizzando…")
                  : (isPt ? "Assinar" : "Abbonati")}
                {loading !== "mensal" && <ChevronRight size={13} />}
              </button>
            </div>

          </div>

          <p className="font-sans-premium text-[9px] text-neutral-400 mt-8 text-center tracking-wide">
            {isPt
              ? "Pagamento seguro via Stripe. Após a confirmação você receberá acesso imediato."
              : "Pagamento sicuro tramite Stripe. Dopo la conferma riceverai accesso immediato."}
          </p>

        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function AcessoRotinaPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <PlanPage />
      </CartProvider>
    </AuthProvider>
  );
}
