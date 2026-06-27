import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databases, storage } from "@/lib/appwrite";
import { notFound } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import ProductPageContent from "@/components/ProductPageContent";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const DB_ID = (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57").trim();
const PRODUCTS_COL_ID = (process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID || "products").trim();
const CATEGORIES_COL_ID = (process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || "categories").trim();
const BUCKET_ID = (process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "6a391020001d02651b57").trim();

async function getProductData(id: string) {
  try {
    const doc: any = await databases.getDocument(DB_ID, PRODUCTS_COL_ID, id);
    if (doc.status && doc.status !== "published") return null;
    return doc;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getCategoryLabel(categoryValue: string) {
  try {
    const { Query } = await import("appwrite");
    const res = await databases.listDocuments(DB_ID, CATEGORIES_COL_ID, [
      Query.equal("value", categoryValue),
      Query.limit(1),
    ]);
    if (res.documents.length === 0) return { label: categoryValue, label_it: categoryValue };
    const cat: any = res.documents[0];
    return { label: cat.label, label_it: cat.name_it || cat.label };
  } catch {
    return { label: categoryValue, label_it: categoryValue };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductData(id);

  if (!product) {
    notFound();
  }

  const category = await getCategoryLabel(product.category);
  const imageUrl = product.image_id
    ? storage.getFileView(BUCKET_ID, product.image_id).toString()
    : "/images/perfume.png";

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-dourado-suave/30">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <ProductPageContent
              product={{
                id: product.$id,
                name_pt: product.name_pt || "Sem nome",
                name_it: product.name_it || "",
                category: product.category || "geral",
                categoryLabelPt: category.label,
                categoryLabelIt: category.label_it,
                price: product.price || 0,
                weight_kg: product.weight_kg ?? 0.5,
                image: imageUrl,
                description_pt: product.description_pt || "",
                description_it: product.description_it || "",
                ingredients_pt: product.ingredients_pt || "",
                ingredients_it: product.ingredients_it || "",
                sizes: product.sizes && product.sizes.trim() !== "" ? product.sizes.split(",").map((s: string) => s.trim()) : undefined,
                inStock: product.in_stock,
                delivery_days: product.delivery_days ?? 5,
              }}
            />
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
