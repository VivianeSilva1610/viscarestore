import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { adminDatabases, DB_ID, PRODUCTS_COL_ID, BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/appwrite-admin";
import { Query } from "node-appwrite";
import ProfumiGrid from "@/components/ProfumiGrid";

export const dynamic = "force-dynamic";

const PERFUME_CATEGORIES = ["perfumes", "alta-perfumaria"];

function imageUrl(imageId: string) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${imageId}/view?project=${PROJECT_ID}`;
}

export default async function ProfumiPage() {
  let products: any[] = [];
  try {
    const res = await adminDatabases.listDocuments(DB_ID, PRODUCTS_COL_ID, [
      Query.equal("status", "published"),
      Query.limit(200),
    ]);
    products = res.documents
      .filter((doc: any) => PERFUME_CATEGORIES.includes(doc.category))
      .map((doc: any) => ({
        id: doc.$id,
        name_pt: doc.name_pt || "",
        name_it: doc.name_it || "",
        category: doc.category || "",
        price: doc.price || 0,
        image: doc.image ? imageUrl(doc.image) : "",
        description_pt: doc.description_pt || "",
        description_it: doc.description_it || "",
        sizes: doc.sizes || [],
        inStock: doc.inStock !== false,
        delivery_days: doc.delivery_days ?? 5,
        weight_kg: doc.weight_kg ?? 0,
      }));
  } catch { /* returns empty list on error */ }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                  <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold">
                    Fragranze
                  </span>
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                </div>
                <h1 className="font-serif-premium text-3xl sm:text-4xl text-neutral-900 font-light tracking-wide mb-4">
                  Profumi & Alta Profumeria
                </h1>
                <p className="font-sans-premium text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
                  Fragranze selezionate per durata, materie prime e autenticità — senza pagare il nome del brand.
                </p>
              </div>

              <ProfumiGrid products={products} />
            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
