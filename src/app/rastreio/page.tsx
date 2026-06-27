"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Loader2, Package, Truck, CheckCircle2, XCircle } from "lucide-react";

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
}

interface TrackingResult {
  trackingCode: string;
  trackingStatus: string;
  statusHistory: StatusHistoryEntry[];
  estimatedDeliveryDate: string | null;
  customerName: string;
}

const STAGES = [
  { key: "preparando", labelPt: "Preparando entrega", labelIt: "Preparazione spedizione", icon: Package },
  { key: "em_transito", labelPt: "Percurso em andamento", labelIt: "In transito", icon: Truck },
  { key: "concluido", labelPt: "Concluído", labelIt: "Consegnato", icon: CheckCircle2 },
];

function RastreioContent() {
  const { language } = useLanguage();
  const isPt = language === "pt";
  const searchParams = useSearchParams();

  const [code, setCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (trackingCode: string) => {
    if (!trackingCode.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking?code=${encodeURIComponent(trackingCode.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(isPt ? "Código de rastreio não encontrado." : "Codice di tracciamento non trovato.");
        return;
      }
      setResult(data);
    } catch {
      setError(isPt ? "Erro ao buscar rastreio." : "Errore nella ricerca.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fromUrl = searchParams.get("code");
    if (fromUrl) {
      setCode(fromUrl);
      lookup(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const currentStageIndex = result
    ? STAGES.findIndex((s) => s.key === result.trackingStatus)
    : -1;
  const isTerminalIssue = result?.trackingStatus === "reembolsado" || result?.trackingStatus === "cancelado";

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-dourado-suave/30">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-16">
              <header className="mb-12 text-center">
                <span className="text-dourado-suave font-sans-premium text-xs tracking-[0.3em] uppercase font-bold mb-4 block">
                  {isPt ? "Acompanhe sua compra" : "Segui il tuo ordine"}
                </span>
                <h1 className="font-serif-premium text-4xl md:text-5xl text-neutral-900 mb-6 font-light">
                  {isPt ? "Rastreio de Pedido" : "Tracciamento Ordine"}
                </h1>
                <div className="w-12 h-0.5 bg-dourado-suave mx-auto"></div>
              </header>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  lookup(code);
                }}
                className="flex gap-3 mb-12"
              >
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={isPt ? "Digite seu código (ex: VSCA-20260627-AB12C)" : "Inserisci il codice (es: VSCA-20260627-AB12C)"}
                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:border-dourado-suave"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-neutral-900 text-white font-sans-premium text-xs tracking-widest uppercase hover:bg-dourado-suave font-semibold transition-colors duration-300 rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : isPt ? "Rastrear" : "Traccia"}
                </button>
              </form>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-5 text-center mb-8">
                  {error}
                </div>
              )}

              {result && !isTerminalIssue && (
                <div className="glass-card rounded-3xl p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-neutral-900/5 pb-6">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-dourado-suave uppercase mb-1">
                        {isPt ? "Código" : "Codice"}
                      </p>
                      <p className="text-lg font-serif-premium text-neutral-900">{result.trackingCode}</p>
                    </div>
                    {result.estimatedDeliveryDate && (
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
                          {isPt ? "Previsão de entrega" : "Consegna prevista"}
                        </p>
                        <p className="text-sm text-neutral-800 font-medium">
                          {new Date(result.estimatedDeliveryDate).toLocaleDateString(isPt ? "pt-BR" : "it-IT", {
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    {STAGES.map((stage, idx) => {
                      const Icon = stage.icon;
                      const isDone = idx <= currentStageIndex;
                      const historyEntry = result.statusHistory.find((h) => h.status === stage.key);
                      return (
                        <div key={stage.key} className="flex-1 flex flex-col items-center text-center relative">
                          {idx > 0 && (
                            <div
                              className={`absolute top-6 right-1/2 w-full h-0.5 -z-10 ${
                                idx <= currentStageIndex ? "bg-dourado-suave" : "bg-neutral-200"
                              }`}
                            />
                          )}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 bg-white ${
                              isDone ? "border-dourado-suave text-dourado-suave" : "border-neutral-200 text-neutral-300"
                            }`}
                          >
                            <Icon size={20} />
                          </div>
                          <p className={`text-xs font-sans-premium tracking-wide font-semibold ${isDone ? "text-neutral-900" : "text-neutral-400"}`}>
                            {isPt ? stage.labelPt : stage.labelIt}
                          </p>
                          {historyEntry && (
                            <p className="text-[10px] text-neutral-400 mt-1">
                              {new Date(historyEntry.timestamp).toLocaleDateString(isPt ? "pt-BR" : "it-IT", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {result && isTerminalIssue && (
                <div className="glass-card rounded-3xl p-10 text-center">
                  <XCircle size={40} className="text-rose-500 mx-auto mb-4" />
                  <p className="text-neutral-800 font-medium">
                    {result.trackingStatus === "cancelado"
                      ? isPt ? "Este pedido foi cancelado." : "Questo ordine è stato annullato."
                      : isPt ? "Este pedido foi reembolsado." : "Questo ordine è stato rimborsato."}
                  </p>
                </div>
              )}
            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default function RastreioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-dourado-suave" />
        </div>
      }
    >
      <RastreioContent />
    </Suspense>
  );
}
