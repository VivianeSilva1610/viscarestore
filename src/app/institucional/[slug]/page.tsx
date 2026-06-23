import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { notFound } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";

import InstitutionalContent from "@/components/InstitutionalContent";

// Forcing dynamic rendering and disabling fetch cache
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const DB_ID = (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57").trim();
const PAGES_COL_ID = (process.env.NEXT_PUBLIC_APPWRITE_PAGES_COLLECTION_ID || "pages").trim();

async function getPageData(slug: string) {
  try {
    const res = await databases.listDocuments(DB_ID, PAGES_COL_ID, [
      Query.equal("slug", slug),
      Query.limit(1)
    ]);
    if (res.documents.length === 0) return null;
    return res.documents[0];
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export default async function InstitutionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const normalizedSlug = decodeURIComponent(resolvedParams.slug).replace(/\s+/g, '-').toLowerCase();
  const page = await getPageData(normalizedSlug);

  if (!page) {
    notFound();
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-dourado-suave/30">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-16">
              <InstitutionalContent page={page as any} />
            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
