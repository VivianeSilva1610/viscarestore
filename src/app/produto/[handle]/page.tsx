import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ShopifyProductClient from "@/components/ShopifyProductClient";
import ShopifyReviews from "@/components/ShopifyReviews";
import { fetchShopifyProduct } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export default async function ShopifyProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const locale = (await cookies()).get("viscaree_lang")?.value ?? "it";

  const product = await fetchShopifyProduct(handle, locale);
  if (!product) notFound();

  const allImages = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);
  // gid://shopify/Product/10735993815373 → "10735993815373"
  const numericProductId = product.id.split("/").pop() ?? product.id;

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

              <ShopifyProductClient
                productId={product.id}
                title={product.title}
                description={product.description}
                allImages={allImages}
                variants={variants}
              />

              <ShopifyReviews
                numericProductId={numericProductId}
                productTitle={product.title}
              />

            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
