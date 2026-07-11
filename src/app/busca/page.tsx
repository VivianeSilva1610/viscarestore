"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Loader2, Package } from "lucide-react";
import ShopifyAddToCartButton from "@/components/ShopifyAddToCartButton";

interface AppwriteResult {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
}

interface ShopifyResult {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  collections: { edges: Array<{ node: { title: string; handle: string } }> };
  variants: { edges: Array<{ node: { id: string } }> };
}

function BuscaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isPt = language === "pt";

  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(q);
  const [isLoading, setIsLoading] = useState(false);
  const [appwrite, setAppwrite] = useState<AppwriteResult[]>([]);
  const [shopify, setShopify] = useState<ShopifyResult[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>("all");

  useEffect(() => {
    setQuery(q);
    if (!q || q.length < 2) {
      setAppwrite([]);
      setShopify([]);
      return;
    }
    setIsLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setAppwrite(data.appwrite ?? []);
        setShopify(data.shopify ?? []);
        setActiveCollection("all");
      })
      .finally(() => setIsLoading(false));
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
  };

  // Unique Shopify collections from results
  const collections = Array.from(
    new Map(
      shopify.flatMap((p) => p.collections.edges.map((e) => [e.node.handle, e.node.title]))
    ).entries()
  );

  const filteredShopify =
    activeCollection === "all"
      ? shopify
      : shopify.filter((p) =>
          p.collections.edges.some((e) => e.node.handle === activeCollection)
        );

  const totalResults = appwrite.length + filteredShopify.length;

  return (
    <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-3 mb-10 max-w-xl">
            <div className="flex-grow flex items-center bg-white border border-neutral-200 rounded-xl px-4 py-3 focus-within:border-[#C8A97E] transition-colors">
              <Search size={16} className="text-[#C8A97E] mr-3 shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isPt ? "Buscar produtos…" : "Cerca prodotti…"}
                className="flex-grow text-sm text-neutral-800 placeholder-neutral-400 outline-none font-sans-premium tracking-wide"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-neutral-900 text-white text-xs tracking-widest uppercase font-sans-premium hover:bg-[#C8A97E] transition-colors rounded-xl"
            >
              {isPt ? "Buscar" : "Cerca"}
            </button>
          </form>

          {q && !isLoading && (
            <p className="font-sans-premium text-xs text-neutral-400 tracking-wide mb-8">
              {totalResults > 0
                ? `${totalResults} ${isPt ? "resultado(s) para" : "risultato/i per"} "${q}"`
                : `${isPt ? "Nenhum resultado para" : "Nessun risultato per"} "${q}"`}
            </p>
          )}

          {isLoading && (
            <div className="flex justify-center py-24">
              <Loader2 size={28} className="animate-spin text-[#C8A97E]" />
            </div>
          )}

          {!isLoading && q && (
            <>
              {/* ── Produtos VisCaree (Appwrite) ── */}
              {appwrite.length > 0 && (
                <section className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-6 h-[1px] bg-[#C8A97E]" />
                    <h2 className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold">
                      {isPt ? "Coleção VisCaree" : "Collezione VisCaree"}
                    </h2>
                    <span className="w-6 h-[1px] bg-[#C8A97E]" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {appwrite.map((p) => (
                      <Link
                        key={p.id}
                        href={`/produtos/${p.id}`}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-neutral-100 flex flex-col"
                      >
                        <div className="aspect-square bg-[#F1E7E2] overflow-hidden">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={32} className="text-neutral-300" strokeWidth={1} />
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-grow">
                          <p className="font-serif-premium text-neutral-900 text-sm font-light leading-snug mb-1">{p.name}</p>
                          <p className="font-sans-premium text-[#C8A97E] text-xs font-semibold tracking-wide">
                            {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(p.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Produtos Shopify ── */}
              {shopify.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-6 h-[1px] bg-[#C8A97E]" />
                    <h2 className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold">
                      {isPt ? "Catálogo Shopify" : "Catalogo Shopify"}
                    </h2>
                    <span className="w-6 h-[1px] bg-[#C8A97E]" />
                  </div>

                  {/* Filtros por coleção Shopify */}
                  {collections.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button
                        onClick={() => setActiveCollection("all")}
                        className={`px-4 py-1.5 rounded-full text-xs font-sans-premium tracking-widest uppercase transition-colors ${
                          activeCollection === "all"
                            ? "bg-neutral-900 text-white"
                            : "bg-white border border-neutral-200 text-neutral-600 hover:border-[#C8A97E]"
                        }`}
                      >
                        {isPt ? "Todos" : "Tutti"}
                      </button>
                      {collections.map(([handle, title]) => (
                        <button
                          key={handle}
                          onClick={() => setActiveCollection(handle)}
                          className={`px-4 py-1.5 rounded-full text-xs font-sans-premium tracking-widest uppercase transition-colors ${
                            activeCollection === handle
                              ? "bg-neutral-900 text-white"
                              : "bg-white border border-neutral-200 text-neutral-600 hover:border-[#C8A97E]"
                          }`}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredShopify.map((p) => {
                      const { amount, currencyCode } = p.priceRange.minVariantPrice;
                      const variantGid = p.variants.edges[0]?.node.id ?? "";
                      return (
                        <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-neutral-100 flex flex-col">
                          <Link href={`/produto/${p.handle}`} className="block">
                            <div className="aspect-square bg-[#F1E7E2] overflow-hidden">
                              {p.featuredImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={32} className="text-neutral-300" strokeWidth={1} />
                                </div>
                              )}
                            </div>
                            <div className="p-4 flex-grow">
                              <p className="font-serif-premium text-neutral-900 text-sm font-light leading-snug mb-1">{p.title}</p>
                              <p className="font-sans-premium text-[#C8A97E] text-xs font-semibold tracking-wide">
                                {new Intl.NumberFormat("it-IT", { style: "currency", currency: currencyCode }).format(parseFloat(amount))}
                              </p>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <ShopifyAddToCartButton
                              productId={p.id}
                              title={p.title}
                              description={p.description}
                              price={parseFloat(amount)}
                              image={p.featuredImage?.url ?? ""}
                              variantGid={variantGid}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {totalResults === 0 && (
                <div className="text-center py-24">
                  <Search size={48} className="text-neutral-200 mx-auto mb-4" strokeWidth={1} />
                  <p className="font-sans-premium text-neutral-400 text-sm tracking-wide">
                    {isPt ? "Nenhum produto encontrado." : "Nessun prodotto trovato."}
                  </p>
                </div>
              )}
            </>
          )}

          {!q && (
            <div className="text-center py-24">
              <Search size={48} className="text-neutral-200 mx-auto mb-4" strokeWidth={1} />
              <p className="font-sans-premium text-neutral-400 text-sm tracking-wide">
                {isPt ? "Digite algo para buscar em todo o site." : "Digita qualcosa per cercare in tutto il sito."}
              </p>
            </div>
          )}
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function BuscaPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-[#C8A97E]" />
          </div>
        }>
          <BuscaContent />
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}
