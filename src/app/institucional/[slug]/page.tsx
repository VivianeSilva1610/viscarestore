import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { notFound } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";

// Forcing dynamic rendering and disabling fetch cache
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const DB_ID = (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "").trim();
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
              <header className="mb-12 text-center">
                <h1 className="font-serif-premium text-3xl md:text-4xl text-neutral-900 mb-4">{page.title}</h1>
                <div className="w-12 h-0.5 bg-dourado-suave mx-auto"></div>
              </header>

              <article className="prose prose-neutral prose-sm md:prose-base max-w-none prose-headings:font-serif-premium prose-headings:font-normal prose-a:text-dourado-suave hover:prose-a:text-dourado-suave/80 prose-p:font-sans-premium prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600">
                {page.content.split('\n').map((paragraph: string, index: number) => {
                  if (!paragraph.trim()) return <br key={index} />;
                  return <p key={index} className="mb-4">{paragraph}</p>;
                })}
              </article>
            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
