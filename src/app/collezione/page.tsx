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
import ShopifyAddToCartButton from "@/components/ShopifyAddToCartButton";

export const dynamic = "force-dynamic";

const HANDLE = "collezione-di-cura-per-il-viso-e-pelle";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function ProductCard({ product }: { product: ShopifyProduct }) {
  const { amount, currencyCode } = product.priceRange.minVariantPrice;
  const variantGid = product.variants.edges[0]?.node.id ?? "";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-neutral-100 flex flex-col">
      <Link href={`/produto/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#F1E7E2]">
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
    </div>
  );
}

export default async function CollezionePage() {
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
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                  <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold">
                    Skincare
                  </span>
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                </div>
                <h1 className="font-serif-premium text-3xl sm:text-4xl text-neutral-900 font-light tracking-wide mb-4">
                  {collection?.title ?? "Cura per il Viso e Pelle"}
                </h1>
                {collection?.description && (
                  <p className="font-sans-premium text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
                    {collection.description}
                  </p>
                )}
              </div>

              {/* Grid */}
              {products.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-sans-premium text-neutral-400 text-sm tracking-wide">
                    Nessun prodotto disponibile al momento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
