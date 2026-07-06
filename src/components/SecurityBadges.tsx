"use client";

import React from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SecurityBadges({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();

  const labels = {
    ssl: language === "it" ? "Connessione sicura SSL" : "Conexão segura SSL",
    verified: language === "it" ? "Acquisto Verificato" : "Compra Verificada",
    cards: language === "it" ? "Pagamenti accettati" : "Pagamentos aceitos",
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <span className="inline-flex items-center gap-1.5 text-neutral-500 font-sans-premium text-[10px] tracking-wide">
          <Lock size={12} className="text-emerald-600" />
          {labels.ssl}
        </span>
        <span className="inline-flex items-center gap-1.5 text-neutral-500 font-sans-premium text-[10px] tracking-wide">
          <ShieldCheck size={12} className="text-emerald-600" />
          {labels.verified}
        </span>
        <span className="flex items-center gap-1.5 font-sans-premium text-[10px] tracking-wide text-neutral-500">
          <CardIcons />
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 py-4">
      <div className="flex flex-col items-center gap-1.5">
        <Lock size={20} className="text-emerald-600" />
        <span className="font-sans-premium text-[9px] tracking-widest uppercase text-neutral-400">{labels.ssl}</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <ShieldCheck size={20} className="text-emerald-600" />
        <span className="font-sans-premium text-[9px] tracking-widest uppercase text-neutral-400">{labels.verified}</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <CardIcons size="lg" />
        <span className="font-sans-premium text-[9px] tracking-widest uppercase text-neutral-400">{labels.cards}</span>
      </div>
    </div>
  );
}

function CardIcons({ size = "sm" }: { size?: "sm" | "lg" }) {
  const h = size === "lg" ? "h-5" : "h-3.5";
  return (
    <div className="flex items-center gap-1">
      {/* Visa */}
      <svg className={`${h} w-auto`} viewBox="0 0 48 16" fill="none">
        <rect width="48" height="16" rx="2" fill="#1A1F71"/>
        <text x="5" y="12" fontSize="10" fontWeight="bold" fill="white" fontFamily="sans-serif">VISA</text>
      </svg>
      {/* Mastercard */}
      <svg className={`${h} w-auto`} viewBox="0 0 32 20" fill="none">
        <circle cx="12" cy="10" r="9" fill="#EB001B"/>
        <circle cx="20" cy="10" r="9" fill="#F79E1B"/>
        <path d="M16 4.5a9 9 0 0 1 0 11A9 9 0 0 1 16 4.5z" fill="#FF5F00"/>
      </svg>
      {/* Amex */}
      <svg className={`${h} w-auto`} viewBox="0 0 48 16" fill="none">
        <rect width="48" height="16" rx="2" fill="#2E77BC"/>
        <text x="4" y="12" fontSize="8" fontWeight="bold" fill="white" fontFamily="sans-serif">AMEX</text>
      </svg>
    </div>
  );
}
