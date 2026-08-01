import React from "react";
import { cookies } from "next/headers";
import { CheckCircle, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import stripe from "@/lib/stripe";

export const dynamic = "force-dynamic";

const APP_URL = "https://www.viscare.app.br/";

export default async function AcessoSucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; plan?: string }>;
}) {
  const { session_id, plan } = await searchParams;
  const isMonthly = plan === "mensal";
  const lang = (await cookies()).get("viscaree_lang")?.value ?? "it";
  const isPt = lang === "pt";

  let customerName = "";
  let customerEmail = "";
  let valid = false;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid" || session.status === "complete") {
        valid = true;
        customerName = session.customer_details?.name || "";
        customerEmail = session.customer_details?.email || "";
      }
    } catch { /* session inválida */ }
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
          <Navbar />

          <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
            <div className="max-w-lg mx-auto px-4 text-center">

              {valid ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>

                  <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] block mb-4">
                    {isPt ? "Pagamento confirmado" : "Pagamento confermato"}
                  </span>

                  <h1 className="font-serif-premium text-3xl sm:text-4xl text-neutral-900 font-light tracking-wide mb-4">
                    {isPt ? "Bem-vinda ao App!" : "Benvenuta nell'App!"}
                  </h1>

                  {customerName && (
                    <p className="font-sans-premium text-sm text-neutral-600 mb-2">
                      {isPt ? "Olá" : "Ciao"}, <strong>{customerName}</strong>!
                    </p>
                  )}

                  <p className="font-sans-premium text-sm text-neutral-500 leading-relaxed mb-8">
                    {isMonthly
                      ? (isPt
                          ? "Sua assinatura mensal da Rotina Skincare VisCaree está ativa. Você será cobrada automaticamente todo mês."
                          : "Il tuo abbonamento mensile alla Routine Skincare VisCaree è attivo. Verrai addebitata automaticamente ogni mese.")
                      : (isPt
                          ? "Seu acesso de 30 dias à Rotina Skincare VisCaree está ativo. Clique abaixo para começar."
                          : "Il tuo accesso di 30 giorni alla Routine Skincare VisCaree è attivo. Clicca qui sotto per iniziare.")}
                    {customerEmail && (
                      <>
                        {" "}
                        {isPt ? "Enviamos uma confirmação para" : "Abbiamo inviato una conferma a"}{" "}
                        <strong>{customerEmail}</strong>.
                      </>
                    )}
                  </p>

                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-[#C8A97E] transition-colors duration-300 rounded-xl font-semibold"
                  >
                    {isPt ? "Acessar App" : "Accedi all'App"}
                    <ExternalLink size={13} />
                  </a>

                  <p className="font-sans-premium text-[9px] text-neutral-400 mt-6 tracking-wide">
                    {isMonthly
                      ? (isPt ? "Assinatura mensal · Cancele quando quiser." : "Abbonamento mensile · Cancella quando vuoi.")
                      : (isPt ? "Acesso válido por 30 dias a partir de hoje." : "Accesso valido per 30 giorni da oggi.")}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="font-serif-premium text-3xl text-neutral-900 font-light tracking-wide mb-4">
                    {isPt ? "Pagamento não confirmado" : "Pagamento non confermato"}
                  </h1>
                  <p className="font-sans-premium text-sm text-neutral-500 mb-8">
                    {isPt
                      ? "Não foi possível confirmar seu pagamento. Tente novamente."
                      : "Non è stato possibile confermare il pagamento. Riprova."}
                  </p>
                  <a
                    href="/acesso-rotina"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-[#C8A97E] transition-colors duration-300 rounded-xl font-semibold"
                  >
                    {isPt ? "Tentar novamente" : "Riprova"}
                  </a>
                </>
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
