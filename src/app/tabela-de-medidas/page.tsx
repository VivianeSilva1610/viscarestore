"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Ruler } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function TabelaMedidasPage() {
  const { language } = useLanguage();
  const isPt = language === "pt";

  const sizeData = [
    { letter: "PP (XS)", br: "36", it: "40" },
    { letter: "P (S)", br: "38", it: "42" },
    { letter: "M (M)", br: "40", it: "44" },
    { letter: "G (L)", br: "42", it: "46" },
    { letter: "GG (XL)", br: "44", it: "48" },
    { letter: "XGG (XXL)", br: "46", it: "50" },
  ];

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-dourado-suave/30">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 sm:px-12">
              
              <header className="mb-16 text-center">
                <span className="text-dourado-suave font-sans-premium text-xs tracking-[0.3em] uppercase font-bold mb-4 block flex items-center justify-center gap-2">
                  <Ruler size={16} />
                  VisCaree
                </span>
                <h1 className="font-serif-premium text-4xl md:text-5xl text-neutral-900 mb-6 font-light">
                  {isPt ? "Tabela de Medidas" : "Guida alle Taglie"}
                </h1>
                <div className="w-12 h-0.5 bg-dourado-suave mx-auto mb-8"></div>
                <p className="font-sans-premium text-sm text-neutral-500 tracking-wide max-w-lg mx-auto leading-relaxed">
                  {isPt 
                    ? "Encontre o tamanho perfeito para você comparando as numerações entre Brasil e Itália." 
                    : "Trova la taglia perfetta per te confrontando le numerazioni tra Brasile e Italia."}
                </p>
              </header>

              <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F5F2] border-b border-neutral-100">
                        <th className="py-5 px-6 font-sans-premium text-[10px] tracking-widest text-neutral-700 uppercase font-bold text-center">
                          {isPt ? "Tamanho (Letra)" : "Taglia (Lettera)"}
                        </th>
                        <th className="py-5 px-6 font-sans-premium text-[10px] tracking-widest text-neutral-700 uppercase font-bold text-center border-l border-neutral-100">
                          {isPt ? "Numeração Brasil (BR)" : "Numerazione Brasile (BR)"}
                        </th>
                        <th className="py-5 px-6 font-sans-premium text-[10px] tracking-widest text-neutral-700 uppercase font-bold text-center border-l border-neutral-100">
                          {isPt ? "Numeração Itália (IT)" : "Numerazione Italia (IT)"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {sizeData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                          <td className="py-4 px-6 font-sans-premium text-sm text-neutral-900 font-semibold text-center">
                            {row.letter}
                          </td>
                          <td className="py-4 px-6 font-sans-premium text-sm text-neutral-500 text-center border-l border-neutral-100">
                            {row.br}
                          </td>
                          <td className="py-4 px-6 font-sans-premium text-sm text-neutral-500 text-center border-l border-neutral-100">
                            {row.it}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="font-sans-premium text-xs text-neutral-400">
                  {isPt 
                    ? "Dúvidas sobre o tamanho? Entre em contato com nosso atendimento."
                    : "Dubbi sulla taglia? Contatta il nostro servizio clienti."}
                </p>
              </div>

            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
