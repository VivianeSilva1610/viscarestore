"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateTexts } from "@/lib/translate";

// Extracts the block matching [PT], [IT] or [EN] markers from a multi-language description.
// Returns null if no markers are found (caller should fall back to translation).
function extractLanguageSection(text: string, lang: string): string | null {
  const marker = `[${lang.toUpperCase()}]`;
  const allMarkers = ["[PT]", "[IT]", "[EN]"];
  if (!allMarkers.some((m) => text.includes(m))) return null;
  const idx = text.indexOf(marker);
  if (idx === -1) return null;
  const start = idx + marker.length;
  const others = allMarkers.filter((m) => m !== marker);
  let end = text.length;
  for (const m of others) {
    const i = text.indexOf(m, start);
    if (i !== -1 && i < end) end = i;
  }
  return text.slice(start, end).trim();
}

interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  image: ShopifyImage | null;
}

interface Props {
  productId: string;
  title: string;
  description: string;       // pre-extracted by server for initial locale
  rawDescription: string;    // full original text, used for client-side language toggle
  featuredImage?: ShopifyImage | null;
  allImages: ShopifyImage[];
  variants: Variant[];
}

export default function ShopifyProductClient({ productId, title, description, rawDescription, featuredImage, allImages, variants }: Props) {
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0];
  const [selected, setSelected] = useState<Variant>(firstAvailable);

  // Build complete gallery: product images + unique variant images (deduplicated by URL)
  const variantImages = variants
    .map((v) => v.image)
    .filter((img): img is ShopifyImage => !!img);
  const seenUrls = new Set(allImages.map((i) => i.url));
  const extraVariantImages = variantImages.filter((img) => !seenUrls.has(img.url));
  const thumbnails = [...allImages, ...extraVariantImages];

  // Initial image: variant image → product gallery → featuredImage
  const [displayImage, setDisplayImage] = useState<ShopifyImage | null>(
    firstAvailable.image ?? thumbnails[0] ?? featuredImage ?? null
  );

  const { addToCart } = useCart();
  const { language } = useLanguage();
  const isPt = language === "pt";

  const [displayDesc, setDisplayDesc] = useState<string>(description);

  // Re-extract/translate when user switches language on the client
  useEffect(() => {
    const src = rawDescription || description;
    if (!src) return;
    const section = extractLanguageSection(src, language);
    if (section) {
      setDisplayDesc(section);
      return;
    }
    // No markers: translate automatically
    translateTexts([src], language).then(([t]) => setDisplayDesc(t ?? src));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const price = parseFloat(selected.price.amount);
  const formattedPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: selected.price.currencyCode,
  }).format(price);

  const handleAdd = () => {
    addToCart({
      id: productId,
      name: variants.length > 1 ? `${title} — ${selected.title}` : title,
      price,
      weight_kg: 0.5,
      image: displayImage?.url ?? "",
      category: "shopify",
      description,
      source: "shopify",
      shopifyVariantId: selected.id,
    });
  };

  const handleVariantClick = (v: Variant) => {
    if (!v.availableForSale) return;
    setSelected(v);
    // Switch to variant's own image, or keep current if it doesn't have one
    if (v.image) setDisplayImage(v.image);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
      {/* Galeria */}
      <div>
        <div className="relative aspect-[3/4] bg-[#F1E7E2] rounded-2xl overflow-hidden border border-[#C8A97E]/10">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImage.url}
              alt={displayImage.altText ?? title}
              className="w-full h-full object-cover transition-opacity duration-300"
              key={displayImage.url}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif-premium text-neutral-300 text-6xl italic">V</span>
            </div>
          )}

          {!selected.availableForSale && (
            <span className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-[9px] font-sans-premium tracking-widest text-white uppercase px-2.5 py-1 rounded-full font-bold">
              {isPt ? "Esgotado" : "Esaurito"}
            </span>
          )}
        </div>

        {/* Miniaturas */}
        {thumbnails.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
            {thumbnails.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img.url}
                alt={img.altText ?? `${title} ${i + 1}`}
                onClick={() => setDisplayImage(img)}
                className={`w-16 h-20 object-cover rounded-xl border-2 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  displayImage?.url === img.url
                    ? "border-[#C8A97E] opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100 hover:border-[#C8A97E]/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Painel de informações */}
      <div className="flex flex-col">
        <span className="font-sans-premium text-[10px] tracking-[0.25em] text-dourado-suave font-semibold uppercase block mb-2">
          {isPt ? "Catálogo Shopify" : "Catalogo Shopify"}
        </span>

        <h1 className="font-serif-premium text-3xl sm:text-4xl text-neutral-900 tracking-wide font-light mb-5">
          {title}
        </h1>

        {/* Preço da variante selecionada */}
        <p className="font-sans-premium text-2xl font-semibold tracking-widest text-neutral-900 mb-6 border-b border-neutral-100 pb-5">
          {formattedPrice}
        </p>

        {displayDesc && (
          <p className="font-sans-premium text-sm text-neutral-600 leading-relaxed font-light tracking-wide mb-8 whitespace-pre-line">
            {displayDesc}
          </p>
        )}

        {/* Seletor de variantes */}
        {variants.length > 1 && (
          <div className="mb-6">
            <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">
              {isPt ? "Variante selecionada:" : "Variante selezionata:"}
            </span>
            <span className="font-sans-premium text-xs text-neutral-800 font-semibold block mb-3">
              {selected.title}
            </span>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const isSelected = v.id === selected.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleVariantClick(v)}
                    disabled={!v.availableForSale}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans-premium border transition-all duration-200 ${
                      isSelected
                        ? "border-[#C8A97E] bg-[#C8A97E]/10 text-[#8B6E4E] font-semibold"
                        : v.availableForSale
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
        )}

        {/* Botão */}
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

        <p className="font-sans-premium text-[9px] text-neutral-400 mt-4 text-center tracking-wide">
          {isPt
            ? "O checkout será processado com segurança pelo Shopify."
            : "Il checkout verrà elaborato in modo sicuro da Shopify."}
        </p>
      </div>
    </div>
  );
}
