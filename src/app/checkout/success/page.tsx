"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams.get("session_id");
    if (session) {
      setSessionId(session);
      // Esvazia o carrinho apenas quando a compra for confirmada e retornar do Stripe
      clearCart();
    }
  }, [searchParams, clearCart]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-[#F1E7E2] flex flex-col items-center justify-center p-4">
        <p className="text-neutral-500 mb-4">Redirecionando...</p>
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
