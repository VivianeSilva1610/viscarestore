"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { CheckCircle, Sparkles, Leaf, Clock, ChevronRight } from "lucide-react";

const FEATURES = {
  it: [
    "Routine skincare personalizzata per il tuo tipo di pelle",
    "Accesso illimitato per 30 giorni",
    "Consigli di esperti aggiornati settimanalmente",
    "Prodotti selezionati con ingredienti autentici",
    "Guida passo per passo mattina e sera",
  ],
  pt: [
    "Rotina de skincare personalizada para seu tipo de pele",
    "Acesso ilimitado por 30 dias",
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail: email || undefined, language }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || (isPt ? "Erro ao iniciar pagamento." : "Errore nel pagamento."));
      }
    } catch {
      setError(isPt ? "Erro de conexão." : "Errore di connessione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
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

          {/* Card principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Features */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#F1E7E2] flex items-center justify-center">
                  <Leaf size={18} className="text-[#C8A97E]" />
                </div>
                <div>
                  <p className="font-sans-premium text-xs tracking-widest uppercase text-neutral-500">
                    {isPt ? "O que está incluído" : "Cosa è incluso"}
                  </p>
                </div>
              </div>

              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#C8A97E] shrink-0 mt-0.5" />
                  <p className="font-sans-premium text-sm text-neutral-700 leading-relaxed">{f}</p>
                </div>
              ))}

              <div className="mt-8 p-4 bg-[#F1E7E2]/60 rounded-2xl border border-[#C8A97E]/20 flex items-center gap-3">
                <Clock size={16} className="text-[#C8A97E] shrink-0" />
                <p className="font-sans-premium text-xs text-neutral-600 leading-relaxed">
                  {isPt
                    ? "Acesso válido por 30 dias a partir da compra. Sem renovação automática."
                    : "Accesso valido per 30 giorni dall'acquisto. Nessun rinnovo automatico."}
                </p>
              </div>
            </div>

            {/* Checkout box */}
            <div className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8">
              <div className="text-center mb-8">
                <span className="font-sans-premium text-[10px] tracking-[0.2em] uppercase text-neutral-400 block mb-2">
                  {isPt ? "Plano" : "Piano"} · 30 {isPt ? "dias" : "giorni"}
                </span>
                <p className="font-sans-premium text-xs text-neutral-500 mt-2">
                  {isPt ? "Pagamento único · Sem surpresas" : "Pagamento unico · Nessuna sorpresa"}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-sans-premium text-[10px] tracking-widest uppercase text-neutral-500 block mb-2">
                    E-mail {isPt ? "(opcional)" : "(opzionale)"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isPt ? "seu@email.com" : "tua@email.com"}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
              </div>

              {error && (
                <p className="font-sans-premium text-xs text-red-500 text-center mb-4">{error}</p>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-[#C8A97E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {loading
                  ? (isPt ? "Redirecionando…" : "Reindirizzando…")
                  : (isPt ? "Comprar acesso" : "Acquista accesso")}
                {!loading && <ChevronRight size={14} />}
              </button>

              <p className="font-sans-premium text-[9px] text-neutral-400 mt-4 text-center tracking-wide">
                {isPt
                  ? "Pagamento seguro via Stripe. Após a confirmação você receberá acesso imediato."
                  : "Pagamento sicuro tramite Stripe. Dopo la conferma riceverai accesso immediato."}
              </p>
            </div>
          </div>
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
