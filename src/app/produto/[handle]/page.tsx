import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ShopifyVariantSelector from "@/components/ShopifyVariantSelector";
import { fetchShopifyProduct } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export default async function ShopifyProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const locale = (await cookies()).get("viscaree_lang")?.value ?? "it";
  const isPt = locale === "pt";

  const product = await fetchShopifyProduct(handle, locale);
  if (!product) notFound();

  const images = product.images.edges.map((e) => e.node);
  const mainImage = images[0] ?? product.featuredImage;

  const firstVariant = product.variants.edges[0]?.node;
  const available = firstVariant?.availableForSale ?? true;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Breadcrumb */}
              <nav className="mb-8 font-sans-premium text-[10px] tracking-widest uppercase text-neutral-400 flex items-center gap-2">
                <a href="/" className="hover:text-neutral-700 transition-colors">Home</a>
                <span>/</span>
                <span className="text-neutral-600">{product.title}</span>
              </nav>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

                {/* Gallery */}
                <div>
                  <div className="relative aspect-[3/4] bg-[#F1E7E2] rounded-2xl overflow-hidden border border-[#C8A97E]/10">
                    {mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mainImage.url}
                        alt={mainImage.altText ?? product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif-premium text-neutral-300 text-6xl italic">V</span>
                      </div>
                    )}

                    {!available && (
                      <span className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-[9px] font-sans-premium tracking-widest text-white uppercase px-2.5 py-1 rounded-full font-bold">
                        {isPt ? "Esgotado" : "Esaurito"}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                      {images.slice(1).map((img, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={img.url}
                          alt={img.altText ?? `${product.title} ${i + 2}`}
                          className="w-16 h-20 object-cover rounded-xl border border-neutral-200 flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Info panel */}
                <div className="flex flex-col">
                  <span className="font-sans-premium text-[10px] tracking-[0.25em] text-dourado-suave font-semibold uppercase block mb-2">
                    {isPt ? "Catálogo Shopify" : "Catalogo Shopify"}
                  </span>

                  <h1 className="font-serif-premium text-3xl sm:text-4xl text-neutral-900 tracking-wide font-light mb-5">
                    {product.title}
                  </h1>

                  {product.description && (
                    <p className="font-sans-premium text-sm text-neutral-600 leading-relaxed font-light tracking-wide mb-8">
                      {product.description}
                    </p>
                  )}

                  <ShopifyVariantSelector
                    productId={product.id}
                    title={product.title}
                    description={product.description}
                    image={mainImage?.url ?? ""}
                    variants={product.variants.edges.map((e) => e.node)}
                  />
                </div>
              </div>

            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
