"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, HelpCircle, Truck, RefreshCw } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { dictionary } from "../locales/dictionary";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { language } = useLanguage();
  const t = dictionary[language].footer;
  const tn = dictionary[language].nav;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert("Inscrição realizada com sucesso! Bem-vindo(a) ao Club VisCaree.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#E7D8D0]/30 border-t border-dourado-suave/10 pt-16 pb-8">
      
      {/* Brand values / Benefits - Premium Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-dourado-suave/10">
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 rounded-full bg-white/40 text-dourado-suave mb-4 shadow-sm">
              <Truck size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif-premium text-sm text-neutral-900 tracking-wide mb-1.5">
              {t.entrega_vip}
            </h4>
            <p className="font-sans-premium text-[10px] text-neutral-500 tracking-wider">
              {t.entrega_desc}
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 rounded-full bg-white/40 text-dourado-suave mb-4 shadow-sm">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif-premium text-sm text-neutral-900 tracking-wide mb-1.5">
              {t.autenticidade}
            </h4>
            <p className="font-sans-premium text-[10px] text-neutral-500 tracking-wider">
              {t.autenticidade_desc}
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 rounded-full bg-white/40 text-dourado-suave mb-4 shadow-sm">
              <RefreshCw size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif-premium text-sm text-neutral-900 tracking-wide mb-1.5">
              {t.troca_facilitada}
            </h4>
            <p className="font-sans-premium text-[10px] text-neutral-500 tracking-wider">
              {t.troca_desc}
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 rounded-full bg-white/40 text-dourado-suave mb-4 shadow-sm">
              <HelpCircle size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif-premium text-sm text-neutral-900 tracking-wide mb-1.5">
              {t.atendimento_exclusivo}
            </h4>
            <p className="font-sans-premium text-[10px] text-neutral-500 tracking-wider">
              {t.atendimento_desc}
            </p>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Intro & Newsletter */}
          <div className="md:col-span-5 space-y-6">
            <span className="font-serif-premium text-2xl tracking-[0.25em] text-neutral-900 italic block">
              VisCaree
            </span>
            <p className="font-sans-premium text-xs text-neutral-500 leading-relaxed tracking-wide font-light max-w-sm">
              {t.sobre_marca}
            </p>
            
            {/* Newsletter */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <label htmlFor="newsletter-email" className="font-sans-premium text-[10px] tracking-widest text-neutral-700 uppercase font-semibold block">
                {t.inscreva_se}
              </label>
              <div className="flex max-w-md relative">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder={t.email_placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-neutral-950/10 focus:border-dourado-suave focus:outline-none px-4 py-3.5 text-xs font-sans-premium tracking-wide rounded-l-lg transition-colors"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 text-white hover:bg-dourado-suave px-5 flex items-center justify-center rounded-r-lg transition-colors duration-300"
                  aria-label="Inscrever email"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="font-sans-premium text-[9px] text-neutral-400">
                {t.termos_newsletter}
              </p>
            </form>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2 space-y-4 md:ml-auto">
            <h5 className="font-sans-premium text-[10px] tracking-widest text-neutral-800 uppercase font-bold">
              {t.colecoes}
            </h5>
            <ul className="space-y-3">
              {[tn.novidades, t.alta_perfumaria, t.skincare_biologico, t.vestidos_seda, t.acessorios_ouro].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sans-premium text-xs text-neutral-500 hover:text-dourado-suave transition-colors duration-300 font-light">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2 space-y-4 md:ml-auto">
            <h5 className="font-sans-premium text-[10px] tracking-widest text-neutral-800 uppercase font-bold">
              {t.informacoes}
            </h5>
            <ul className="space-y-3">
              {[
                { label: t.sobre_viscaree, href: "/institucional/sobre-a-viscaree" },
                { label: t.nossa_missao, href: "/institucional/nossa-missao" },
                { label: t.autenticidade, href: "#" },
                { label: t.app_skincare, href: "https://viscare.vercel.app/", external: true },
                { label: t.contato, href: "/contato" }
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="font-sans-premium text-xs text-neutral-500 hover:text-dourado-suave transition-colors duration-300 font-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="md:col-span-3 space-y-4 md:ml-auto">
            <h5 className="font-sans-premium text-[10px] tracking-widest text-neutral-800 uppercase font-bold">
              {t.ajuda_suporte}
            </h5>
            <ul className="space-y-3">
              {[
                { label: t.duvidas_frequentes, href: "#" },
                { label: t.politicas_frete, href: "/institucional/politicas-de-frete" },
                { label: t.devolucoes_trocas, href: "/institucional/devolucoes-e-trocas" },
                { label: t.guia_notas, href: "#" },
                { label: t.tabela_medidas, href: "#" }
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="font-sans-premium text-xs text-neutral-500 hover:text-dourado-suave transition-colors duration-300 font-light">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dourado-suave/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans-premium text-[10px] text-neutral-400 tracking-wide text-center sm:text-left">
            {t.direitos}
          </p>
          <div className="flex space-x-6">
            <a href="#" className="font-sans-premium text-[10px] text-neutral-400 hover:text-dourado-suave transition-colors">
              {t.termos_uso}
            </a>
            <a href="#" className="font-sans-premium text-[10px] text-neutral-400 hover:text-dourado-suave transition-colors">
              {t.politicas_privacidade}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
