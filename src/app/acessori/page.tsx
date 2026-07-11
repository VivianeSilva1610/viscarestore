import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { fetchShopifyCollection, ShopifyProduct } from "@/lib/shopify";
import { cookies } from "next/headers";
import ShopifyLangNotice from "@/components/ShopifyLangNotice";
import AcessoriGrid from "@/components/AcessoriGrid";

export const dynamic = "force-dynamic";

const HANDLE = "acessori";

export default async function AcessoriPage() {
  const locale = (await cookies()).get("viscaree_lang")?.value ?? "it";
  const collection = await fetchShopifyCollection(HANDLE, locale);
  const products = collection?.products.edges.map((e) => e.node) ?? [];

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              <ShopifyLangNotice />

              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                  <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold">
                    Accessori
                  </span>
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                </div>
                <h1 className="font-serif-premium text-3xl sm:text-4xl text-neutral-900 font-light tracking-wide mb-4">
                  {collection?.title ?? "Acessori"}
                </h1>
                {collection?.description && (
                  <p className="font-sans-premium text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
                    {collection.description}
                  </p>
                )}
              </div>

              <AcessoriGrid products={products} />
            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
