"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { dictionary } from "../locales/dictionary";

export default function Hero() {
  const { language } = useLanguage();
  const t = dictionary[language].hero;

  return (
    <section className="relative w-full min-h-[90vh] flex items-center bg-[#F1E7E2] pt-20 overflow-hidden">
      
      {/* Absolute Decorative Details */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#E7D8D0]/40 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full bg-white/20 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-12">
          
          {/* Text Content - Left Side */}
          <div className="col-span-1 lg:col-span-6 z-10 text-center lg:text-left flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center justify-center lg:justify-start space-x-2 mb-6"
            >
              <span className="w-8 h-[1px] bg-dourado-suave" />
              <span className="font-sans-premium text-[10px] sm:text-xs tracking-[0.3em] uppercase text-dourado-suave font-semibold">
                {t.curadoria}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
              className="font-serif-premium text-3xl sm:text-4xl md:text-5xl tracking-wide leading-[1.15] text-neutral-900 font-light mb-8"
            >
              {t.titulo1}<br />
              <span className="italic font-normal text-dourado-suave">{t.titulo_destaque}</span>{t.titulo2}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="font-sans-premium text-neutral-600 text-sm sm:text-base leading-relaxed tracking-wide font-light max-w-lg mx-auto lg:mx-0 mb-10"
            >
              {t.descricao}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <a
                href="/collezione"
                className="luxury-btn w-full sm:w-auto text-center px-8 py-4 border border-dourado-suave bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.25em] uppercase hover:text-neutral-900 font-semibold shadow-lg transition-all duration-300 z-10"
              >
                {t.botao}
              </a>
            </motion.div>
            
          </div>

          {/* Conceptual Visual - Right Side */}
          <div className="col-span-1 lg:col-span-6 flex justify-center lg:justify-end items-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full aspect-[4/5] max-w-[420px] lg:max-w-[480px] bg-neutral-200/40 rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl border border-white/20"
            >
              <Image
                src="/images/hero-banner.png"
                alt="VisCaree Coleção de Luxo - Alta Perfumaria e Skincare"
                fill
                priority
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover zoom-image"
              />
              
              {/* Overlay elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Small floating detail card */}
              <div className="absolute bottom-6 left-6 right-6 glass-card p-5 rounded-xl text-neutral-900 flex justify-between items-center transition-all duration-500 hover:bg-white/80">
                <div>
                  <p className="font-serif-premium italic text-sm tracking-wide">
                    {t.sinergia}
                  </p>
                  <p className="font-sans-premium text-[10px] tracking-widest uppercase text-neutral-500 mt-1">
                    {t.edicao}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-dourado-suave animate-ping" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
