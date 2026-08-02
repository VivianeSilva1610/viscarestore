"use client";

import React, { useEffect, useState, Suspense } from "react";
import { account } from "../../../lib/appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { AuthProvider } from "../../../context/AuthContext";

function ConfirmarEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const verify = async () => {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");

      if (!userId || !secret) {
        setStatus("error");
        setErrorMsg("Link de confirmação inválido ou expirado.");
        return;
      }

      try {
        await account.updateVerification(userId, secret);
        setStatus("success");
        setTimeout(() => {
          router.replace("/conta/perfil");
        }, 3000);
      } catch (err: unknown) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("already verified")) {
          setStatus("success");
          setTimeout(() => {
            router.replace("/conta/perfil");
          }, 2000);
        } else {
          setErrorMsg("Não foi possível confirmar o e-mail. O link pode ter expirado.");
        }
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#F1E7E2] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 text-center">
        <header className="mb-6">
          <a href="/" className="font-serif italic text-3xl tracking-widest text-neutral-900 hover:text-[#C8A97E] transition-colors">
            VisCaree
          </a>
        </header>

        {status === "verifying" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-8 flex flex-col items-center">
            <Loader2 className="animate-spin text-[#C8A97E]" size={36} strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-neutral-800">Verificando e-mail...</h2>
            <p className="text-neutral-500 text-sm">Aguarde um instante enquanto confirmamos seu cadastro.</p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 py-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-neutral-800">E-mail verificado!</h2>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Sua conta foi ativada com sucesso. Você será redirecionada para o seu perfil em instantes.
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 py-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <XCircle size={32} className="text-red-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-neutral-800">Ocorreu um problema</h2>
            <p className="text-red-500 text-sm leading-relaxed">{errorMsg}</p>
            <div className="pt-4 w-full">
              <button
                onClick={() => router.replace("/conta")}
                className="w-full py-3.5 bg-neutral-900 hover:bg-[#C8A97E] text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300"
              >
                Voltar para a página de login
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmarEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F1E7E2] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C8A97E]" size={28} />
      </div>
    }>
      <AuthProvider>
        <ConfirmarEmailContent />
      </AuthProvider>
    </Suspense>
  );
}
