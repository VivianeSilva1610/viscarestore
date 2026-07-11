"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
}

interface Props {
  productId: string;
  title: string;
  description: string;
  image: string;
  variants: Variant[];
}

export default function ShopifyVariantSelector({ productId, title, description, image, variants }: Props) {
  const available = variants.filter((v) => v.availableForSale);
  const [selected, setSelected] = useState<Variant>(available[0] ?? variants[0]);
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const isPt = language === "pt";

  const price = parseFloat(selected.price.amount);
  const formattedPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: selected.price.currencyCode,
  }).format(price);

  const handleAdd = () => {
    addToCart({
      id: productId,
      name: `${title} — ${selected.title}`,
      price,
      weight_kg: 0.5,
      image,
      category: "shopify",
      description,
      source: "shopify",
      shopifyVariantId: selected.id,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Preço da variante selecionada */}
      <p className="font-sans-premium text-2xl font-semibold tracking-widest text-neutral-900 border-b border-neutral-100 pb-5">
        {formattedPrice}
      </p>

      {/* Seletor de variantes */}
      <div>
        <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-3">
          {isPt ? "Variante selecionada:" : "Variante selezionata:"}
          <span className="ml-2 text-neutral-800 normal-case tracking-normal font-semibold">{selected.title}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const isSelected = v.id === selected.id;
            const isAvailable = v.availableForSale;
            return (
              <button
                key={v.id}
                onClick={() => isAvailable && setSelected(v)}
                disabled={!isAvailable}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans-premium border transition-all duration-200 ${
                  isSelected
                    ? "border-[#C8A97E] bg-[#C8A97E]/10 text-[#8B6E4E] font-semibold"
                    : isAvailable
                    ? "border-neutral-300 text-neutral-700 hover:border-[#C8A97E]/60 hover:bg-[#F8F5F2]"
                    : "border-neutral-100 text-neutral-300 line-through cursor-not-allowed"
                }`}
              >
                {v.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão adicionar */}
      <div className="mt-auto pt-4 border-t border-neutral-100">
        {selected.availableForSale ? (
          <button
            onClick={handleAdd}
            className="w-full py-4 bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-[#C8A97E] transition-colors duration-300 rounded-xl font-semibold"
          >
            {isPt ? "Adicionar à Sacola" : "Aggiungi alla Borsa"}
          </button>
        ) : (
          <div className="w-full py-4 bg-neutral-200 text-neutral-400 font-sans-premium text-xs tracking-widest uppercase text-center rounded-xl">
            {isPt ? "Variante Esgotada" : "Variante Esaurita"}
          </div>
        )}
      </div>

      <p className="font-sans-premium text-[9px] text-neutral-400 text-center tracking-wide">
        {isPt
          ? "O checkout será processado com segurança pelo Shopify."
          : "Il checkout verrà elaborato in modo sicuro da Shopify."}
      </p>
    </div>
  );
}
