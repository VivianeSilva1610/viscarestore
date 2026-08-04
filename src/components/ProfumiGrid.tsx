"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { PERFUME_SUBCATEGORIES } from "@/lib/productSubcategories";

interface Product {
  id: string;
  name_pt: string;
  name_it: string;
  category: string;
  price: number;
  price_brl?: number;
  image: string;
  description_pt: string;
  description_it: string;
  sizes?: string[];
  inStock?: boolean;
  delivery_days?: number;
  weight_kg?: number;
  subcategory?: string;
}

const TABS = [
  { id: "all",             labelPt: "Todos",           labelIt: "Tutti" },
  { id: "Perfumes",        labelPt: "Perfumes",         labelIt: "Profumi" },
  { id: "Alta-perfumaria", labelPt: "Alta Perfumaria",  labelIt: "Alta Profumeria" },
];

export default function ProfumiGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const isPt = language === "pt";

  const [active, setActive] = useState<string>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("todas");

  React.useEffect(() => {
    setActiveSubcategory("todas");
  }, [active]);

  const productsInTab = active === "all" ? products : products.filter((p) => p.category === active);
  const filtered =
    activeSubcategory === "todas"
      ? productsInTab
      : productsInTab.filter((p) => (p.subcategory || "") === activeSubcategory);

  const availableSubcategories = PERFUME_SUBCATEGORIES.filter((s) =>
    productsInTab.some((p) => (p.subcategory || "") === s.value)
  );

  const label = (p: Product) => (isPt ? p.name_pt : p.name_it) || p.name_pt;
  const desc  = (p: Product) => (isPt ? p.description_pt : p.description_it) || p.description_pt;
  const formatPrice = (p: Product) => {
    if (isPt && p.price_brl) {
      return `R$ ${p.price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    }
    return `€ ${p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };
  const cartPrice = (p: Product) => (isPt && p.price_brl ? p.price_brl : p.price);

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-sans-premium text-neutral-400 text-sm tracking-wide">
          {isPt ? "Nenhum produto disponível." : "Nessun prodotto disponibile."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-1 mb-10">
        {TABS.map((tab) => {
          const count = tab.id === "all" ? products.length : products.filter((p) => p.category === tab.id).length;
          if (count === 0 && tab.id !== "all") return null;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative px-5 py-2 font-sans-premium text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                active === tab.id ? "text-[#C8A97E]" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {isPt ? tab.labelPt : tab.labelIt}
              {active === tab.id && (
                <motion.span
                  layoutId="profumiTab"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C8A97E]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Subcategory filter (Feminino/Masculino/Unissex) */}
      {availableSubcategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          <button
            onClick={() => setActiveSubcategory("todas")}
            className={`font-sans-premium text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-colors duration-300 ${
              activeSubcategory === "todas"
                ? "border-[#C8A97E] text-[#C8A97E] bg-[#C8A97E]/5"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
            }`}
          >
            {isPt ? "Todos" : "Tutti"}
          </button>
          {availableSubcategories.map((s) => (
            <button
              key={s.value}
              onClick={() => setActiveSubcategory(s.value)}
              className={`font-sans-premium text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-colors duration-300 ${
                activeSubcategory === s.value
                  ? "border-[#C8A97E] text-[#C8A97E] bg-[#C8A97E]/5"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
              }`}
            >
              {isPt ? s.label_pt : s.label_it}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500 border border-neutral-100 flex flex-col"
            >
              <Link href={`/produtos/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-[#F1E7E2]">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={label(product)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif-premium text-neutral-300 text-4xl italic">V</span>
                    </div>
                  )}
                  {product.inStock === false && (
                    <span className="absolute top-3 left-3 bg-red-500/90 text-[9px] font-sans-premium tracking-widest text-white uppercase px-2 py-1 rounded-full">
                      {isPt ? "Esgotado" : "Esaurito"}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-grow">
                  <h3 className="font-serif-premium text-neutral-900 text-base font-light tracking-wide leading-snug mb-2">
                    {label(product)}
                  </h3>
                  {desc(product) && (
                    <p className="font-sans-premium text-neutral-500 text-xs leading-relaxed mb-3 line-clamp-2">
                      {desc(product)}
                    </p>
                  )}
                  <p className="font-sans-premium text-[#C8A97E] font-semibold text-sm tracking-wide">
                    {formatPrice(product)}
                  </p>
                </div>
              </Link>

              <div className="px-5 pb-5">
                <button
                  disabled={product.inStock === false}
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: label(product),
                      price: cartPrice(product),
                      weight_kg: product.weight_kg ?? 0,
                      image: product.image,
                      category: product.category,
                      description: desc(product),
                      delivery_days: product.delivery_days ?? 5,
                    })
                  }
                  className="w-full py-2.5 border border-neutral-900 disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed text-neutral-900 font-sans-premium text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-900 hover:text-white transition-colors duration-300 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus size={12} />
                  {isPt ? "Adicionar" : "Aggiungi"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-sans-premium text-neutral-400 text-sm">
            {isPt ? "Nenhum produto nesta categoria." : "Nessun prodotto in questa categoria."}
          </p>
        </div>
      )}
    </>
  );
}
