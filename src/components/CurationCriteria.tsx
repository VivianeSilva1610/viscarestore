"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const criteria = {
  pt: [
    { label: "Testado pela nossa equipe", detail: "Cada item é avaliado antes de entrar no catálogo." },
    { label: "Ingredientes / materiais verificados", detail: "Priorizamos ativos com eficácia comprovada e tecidos com qualidade verificada." },
    { label: "Avaliações reais de clientes", detail: "Produtos com feedback positivo de quem comprou e usou." },
    { label: "Relação custo-benefício honesta", detail: "Não cobramos pelo nome da marca — cobramos pela qualidade real." },
  ],
  it: [
    { label: "Testato dal nostro team", detail: "Ogni articolo viene valutato prima di entrare nel catalogo." },
    { label: "Ingredienti / materiali verificati", detail: "Priorità agli attivi con efficacia comprovata e tessuti di qualità verificata." },
    { label: "Recensioni reali dei clienti", detail: "Prodotti con feedback positivo da chi ha comprato e usato." },
    { label: "Rapporto qualità-prezzo onesto", detail: "Non facciamo pagare il nome del brand — facciamo pagare la qualità reale." },
  ],
};

interface Props {
  compact?: boolean;
  className?: string;
}

export default function CurationCriteria({ compact = false, className = "" }: Props) {
  const { language } = useLanguage();
  const items = criteria[language];

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {items.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-sans-premium text-[10px] tracking-wide px-3 py-1.5 rounded-full"
          >
            <CheckCircle size={11} strokeWidth={2.5} />
            {item.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-neutral-100 bg-neutral-50 p-6 ${className}`}>
      <p className="font-sans-premium text-[10px] tracking-[0.25em] uppercase text-[#C8A97E] font-semibold mb-4">
        {language === "it" ? "Perché è nel nostro catalogo" : "Por que está no nosso catálogo"}
      </p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <CheckCircle size={15} strokeWidth={2} className="text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-sans-premium text-xs font-semibold text-neutral-800">{item.label}</span>
              <p className="font-sans-premium text-xs text-neutral-500 leading-relaxed mt-0.5">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
