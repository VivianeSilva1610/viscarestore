"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag } from "lucide-react";

interface Props {
  productId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  variantGid: string; // full Shopify GID e.g. "gid://shopify/ProductVariant/12345"
}

export default function ShopifyAddToCartButton({
  productId,
  title,
  description,
  price,
  image,
  variantGid,
}: Props) {
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const handleAdd = () => {
    addToCart({
      id: productId,
      name: title,
      price,
      weight_kg: 0.5,
      image,
      category: "shopify",
      description,
      source: "shopify",
      shopifyVariantId: variantGid,
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-[#C8A97E] transition-colors duration-300"
    >
      <ShoppingBag size={13} />
      {language === "it" ? "Aggiungi al Carrello" : "Adicionar à Sacola"}
    </button>
  );
}
