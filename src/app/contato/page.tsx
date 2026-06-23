"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function ContactPage() {
  const { language } = useLanguage();
  const isPt = language === "pt";

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  useEffect(() => {
    const localEmail = localStorage.getItem("viscare_contact_email");
    const localPhone = localStorage.getItem("viscare_contact_phone");
    const localInstagram = localStorage.getItem("viscare_instagram_url");

    if (localEmail) setContactEmail(localEmail);
    if (localPhone) setContactPhone(localPhone);
    if (localInstagram) setInstagramUrl(localInstagram);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-dourado-suave/30">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-16">
              <header className="mb-16 text-center">
                <span className="text-dourado-suave font-sans-premium text-xs tracking-[0.3em] uppercase font-bold mb-4 block">
                  {isPt ? "Fale Conosco" : "Contattaci"}
                </span>
                <h1 className="font-serif-premium text-4xl md:text-5xl text-neutral-900 mb-6 font-light">
                  {isPt ? "Contato" : "Contatti"}
                </h1>
                <div className="w-12 h-0.5 bg-dourado-suave mx-auto mb-8"></div>
                <p className="font-sans-premium text-sm text-neutral-500 tracking-wide max-w-lg mx-auto leading-relaxed">
                  {isPt 
                    ? "Estamos à disposição para esclarecer dúvidas, oferecer auxílio olfativo ou ajudar com qualquer outra necessidade." 
                    : "Siamo a disposizione per chiarire dubbi, offrire assistenza olfattiva o aiutarti con qualsiasi altra necessità."}
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Email */}
                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:border-dourado-suave/30">
                  <div className="w-12 h-12 bg-[#F1E7E2] rounded-full flex items-center justify-center text-dourado-suave mb-6">
                    <Mail size={20} />
                  </div>
                  <h3 className="font-serif-premium text-xl text-neutral-900 mb-2">E-mail</h3>
                  <p className="font-sans-premium text-xs text-neutral-500 mb-4 tracking-wide">
                    {isPt ? "Para dúvidas gerais e suporte" : "Per domande generali e supporto"}
                  </p>
                  {contactEmail ? (
                    <a href={`mailto:${contactEmail}`} className="font-sans-premium text-sm font-medium text-neutral-800 hover:text-dourado-suave transition-colors">
                      {contactEmail}
                    </a>
                  ) : (
                    <span className="font-sans-premium text-sm text-neutral-400 italic">
                      {isPt ? "Não informado" : "Non informato"}
                    </span>
                  )}
                </div>

                {/* Phone / WhatsApp */}
                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:border-dourado-suave/30">
                  <div className="w-12 h-12 bg-[#F1E7E2] rounded-full flex items-center justify-center text-dourado-suave mb-6">
                    <Phone size={20} />
                  </div>
                  <h3 className="font-serif-premium text-xl text-neutral-900 mb-2">WhatsApp</h3>
                  <p className="font-sans-premium text-xs text-neutral-500 mb-4 tracking-wide">
                    {isPt ? "Atendimento exclusivo" : "Assistenza esclusiva"}
                  </p>
                  {contactPhone ? (
                    <a 
                      href={`https://wa.me/${contactPhone.replace(/\D/g, '')}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans-premium text-sm font-medium text-neutral-800 hover:text-dourado-suave transition-colors"
                    >
                      {contactPhone}
                    </a>
                  ) : (
                    <span className="font-sans-premium text-sm text-neutral-400 italic">
                      {isPt ? "Não informado" : "Non informato"}
                    </span>
                  )}
                </div>

                {/* Instagram */}
                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:border-dourado-suave/30">
                  <div className="w-12 h-12 bg-[#F1E7E2] rounded-full flex items-center justify-center text-dourado-suave mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <h3 className="font-serif-premium text-xl text-neutral-900 mb-2">Instagram</h3>
                  <p className="font-sans-premium text-xs text-neutral-500 mb-4 tracking-wide">
                    {isPt ? "Acompanhe nossas novidades" : "Segui le nostre novità"}
                  </p>
                  {instagramUrl ? (
                    <a 
                      href={instagramUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans-premium text-sm font-medium text-neutral-800 hover:text-dourado-suave transition-colors truncate w-full"
                    >
                      @viscaree
                    </a>
                  ) : (
                    <span className="font-sans-premium text-sm text-neutral-400 italic">
                      {isPt ? "Não informado" : "Non informato"}
                    </span>
                  )}
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
