"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ShopifyLangNotice() {
  const { language } = useLanguage();
  if (language !== "pt") return null;

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3 mb-10 text-center">
      <p className="font-sans-premium text-xs text-neutral-500 tracking-wide">
        As descrições destes produtos estão em italiano — a tradução para português está em andamento.
      </p>
    </div>
  );
}
