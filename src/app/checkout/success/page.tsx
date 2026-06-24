"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";

import { databases, isAppwriteConfigured } from "../../../lib/appwrite";
import { ID, Query } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const ORDERS_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || "orders";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const session = searchParams.get("session_id");
    if (!session) return;
    
    setSessionId(session);
    
    const saveOrder = async () => {
      try {
        if (!isAppwriteConfigured()) {
          console.warn("Appwrite not configured, skipping order save");
          setIsProcessing(false);
          clearCart();
          return;
        }

        // 1. Check if order already exists
        const existing = await databases.listDocuments(DB_ID, ORDERS_COL_ID, [
          Query.equal("sessionId", session)
        ]);

        if (existing.total > 0) {
          console.log("Order already processed");
          setIsProcessing(false);
          clearCart();
          return;
        }

        // 2. Fetch session details from Stripe securely via our API route
        const res = await fetch(`/api/checkout/session?session_id=${session}`);
        if (!res.ok) throw new Error("Failed to fetch session from Stripe");
        const data = await res.json();

        // 3. Save order to Appwrite
        const address = data.shipping_details?.address 
          ? `${data.shipping_details.address.line1 || ''}, ${data.shipping_details.address.city || ''} - ${data.shipping_details.address.state || ''}, ${data.shipping_details.address.postal_code || ''}, ${data.shipping_details.address.country || ''}`
          : "Não informado";

        const itemsSummary = data.line_items 
          ? data.line_items.map((i: any) => `${i.quantity}x ${i.description}`).join(", ")
          : "Produtos não informados";

        await databases.createDocument(DB_ID, ORDERS_COL_ID, ID.unique(), {
          sessionId: session,
          customerName: data.customer_name || "Cliente",
          customerEmail: data.customer_email || "",
          amountTotal: data.amount_total || 0,
          shippingAddress: address,
          products: itemsSummary,
          status: "pago"
        });

        // 4. Deduct stock quantity
        try {
          const cartItems = JSON.parse(data.cartItems || "[]");
          for (const item of cartItems) {
            try {
              const product: any = await databases.getDocument(DB_ID, "products", item.id);
              const currentStock = product.stock_quantity ?? 0;
              const newStock = Math.max(0, currentStock - item.qty);
              await databases.updateDocument(DB_ID, "products", item.id, {
                stock_quantity: newStock,
                in_stock: newStock > 0
              });
            } catch (err) {
              console.error(`Failed to update stock for product ${item.id}`, err);
            }
          }
        } catch (e) {
          console.error("Failed to parse cart items for stock deduction", e);
        }

        console.log("Order saved and stock updated successfully");
        clearCart();
      } catch (error) {
        console.error("Error processing order:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    saveOrder();
  }, [searchParams, clearCart]);

  if (!sessionId || isProcessing) {
    return (
      <div className="min-h-screen bg-[#F1E7E2] flex flex-col items-center justify-center p-4">
        <Loader2 size={32} className="animate-spin text-[#C8A97E] mb-4" />
        <p className="text-neutral-500 mb-4">Processando seu pedido...</p>
        <button onClick={() => router.push("/")} className="text-dourado-suave hover:underline text-sm">
          Voltar para a loja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1E7E2] flex flex-col">
      <header className="py-6 text-center border-b border-[#C8A97E]/15 bg-white/50">
        <a href="/" className="font-serif italic text-3xl tracking-widest text-neutral-900 hover:text-[#C8A97E] transition-colors">
          VisCaree
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-serif-premium text-neutral-900 mb-3">Pedido Confirmado!</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            Muito obrigado por escolher a VisCaree. Seu pedido foi recebido e já estamos preparando tudo com muito carinho. O comprovante foi enviado para o seu e-mail.
          </p>

          <div className="bg-[#F8F5F2] rounded-2xl p-5 border border-[#C8A97E]/15 mb-8 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <Package size={20} className="text-[#C8A97E]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-0.5">Status</p>
                <p className="text-sm text-neutral-800 font-medium">Aguardando Envio</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/conta/perfil")}
              className="flex-1 py-4 border border-neutral-200 text-neutral-700 font-sans-premium text-xs tracking-widest uppercase hover:bg-neutral-50 font-semibold transition-colors duration-300 rounded-xl"
            >
              Meus Pedidos
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-4 bg-neutral-900 text-white font-sans-premium text-xs tracking-widest uppercase hover:bg-dourado-suave font-semibold transition-colors duration-300 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              Continuar <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F1E7E2] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#C8A97E]" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
