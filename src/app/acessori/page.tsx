import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { fetchShopifyCollection, ShopifyProduct, SHOP_URL } from "@/lib/shopify";
import { cookies } from "next/headers";
import ShopifyLangNotice from "@/components/ShopifyLangNotice";

export const dynamic = "force-dynamic";

const HANDLE = "acessori";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function getVariantNumericId(gid: string): string {
  return gid.split("/").pop() ?? "";
}

function ProductCard({ product }: { product: ShopifyProduct }) {
  const { amount, currencyCode } = product.priceRange.minVariantPrice;
  const productUrl = `${SHOP_URL}/products/${product.handle}`;
  const firstVariantGid = product.variants.edges[0]?.node.id ?? "";
  const variantId = getVariantNumericId(firstVariantGid);
  const checkoutUrl = variantId
    ? `${SHOP_URL}/cart/${variantId}:1`
    : productUrl;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-neutral-100 flex flex-col">
      <a href={productUrl} target="_blank" rel="noopener noreferrer" className="block">
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
      </a>

      <div className="px-5 pb-5">
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-[#C8A97E] transition-colors duration-300"
        >
          Comprar
        </a>
      </div>
    </div>
  );
}

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
              <div className="text-center mb-16">
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
