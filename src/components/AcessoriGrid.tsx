"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShopifyProduct } from "@/lib/shopify";
import ShopifyAddToCartButton from "@/components/ShopifyAddToCartButton";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: currencyCode }).format(Number(amount));
}

interface Props {
  products: ShopifyProduct[];
}

export default function AcessoriGrid({ products }: Props) {
  const { language } = useLanguage();
  const isPt = language === "pt";

  // Unique product types from the collection (ignoring empty strings)
  const types = Array.from(
    new Set(products.map((p) => p.productType).filter(Boolean))
  ).sort();

  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? products : products.filter((p) => p.productType === active);

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-sans-premium text-neutral-400 text-sm tracking-wide">
          Nessun prodotto disponibile al momento.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filter tabs */}
      {types.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActive("all")}
            className={`relative px-5 py-2 font-sans-premium text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
              active === "all" ? "text-[#C8A97E]" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {isPt ? "Todos" : "Tutti"}
            {active === "all" && (
              <motion.span layoutId="acessoriTab" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C8A97E]" />
            )}
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActive(type)}
              className={`relative px-5 py-2 font-sans-premium text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                active === type ? "text-[#C8A97E]" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {type}
              {active === type && (
                <motion.span layoutId="acessoriTab" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C8A97E]" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => {
            const { amount, currencyCode } = product.priceRange.minVariantPrice;
            const variantGid = product.variants.edges[0]?.node.id ?? "";
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500 border border-neutral-100 flex flex-col"
              >
                <Link href={`/produto/${product.handle}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-[#F1E7E2]">
                    {product.productType && (
                      <span className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-sm text-[9px] font-sans-premium tracking-widest uppercase text-neutral-600 px-2 py-1 rounded-full">
                        {product.productType}
                      </span>
                    )}
                    {product.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif-premium text-neutral-300 text-4xl italic">V</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-grow">
                    <h3 className="font-serif-premium text-neutral-900 text-base font-light tracking-wide leading-snug mb-2">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="font-sans-premium text-neutral-500 text-xs leading-relaxed mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <p className="font-sans-premium text-[#C8A97E] font-semibold text-sm tracking-wide">
                      {formatPrice(amount, currencyCode)}
                    </p>
                  </div>
                </Link>

                <div className="px-5 pb-5">
                  <ShopifyAddToCartButton
                    productId={product.id}
                    title={product.title}
                    description={product.description}
                    price={parseFloat(amount)}
                    image={product.featuredImage?.url ?? ""}
                    variantGid={variantGid}
                  />
                </div>
              </motion.div>
            );
          })}
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
