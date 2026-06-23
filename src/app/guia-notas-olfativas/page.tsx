"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function GuiaNotasOlfativas() {
  const { language } = useLanguage();
  const isPt = language === "pt";

  const familyImages = {
    citrica: [
      "/images/olfativas/citrica.png"
    ],
    floral: [
      "/images/olfativas/floral.png"
    ],
    oriental: [
      "/images/olfativas/oriental.png"
    ],
    amadeirada: [
      "/images/olfativas/amadeirada.png"
    ],
    gourmand: [
      "/images/olfativas/gourmand.png"
    ]
  };

  const content = {
    pt: {
      title: "Guia de Notas Olfativas VisCaree",
      introTitle: "O que são notas olfativas?",
      introText: "As notas olfativas são os aromas que compõem um perfume e aparecem em diferentes momentos após a aplicação.",
      notes: [
        {
          emoji: "🍋",
          title: "Nota de Saída",
          desc: "É a primeira impressão do perfume. Dura geralmente de 5 a 15 minutos.",
          examples: ["Limão", "Bergamota", "Laranja", "Mandarina", "Hortelã"],
          feel: "✨ Frescor, energia e leveza."
        },
        {
          emoji: "🌺",
          title: "Nota de Corpo (Coração)",
          desc: "Surge após a evaporação das notas de saída. Permanece por várias horas.",
          examples: ["Rosa", "Jasmim", "Lavanda", "Peônia", "Flor de Laranjeira"],
          feel: "✨ Personalidade e identidade do perfume."
        },
        {
          emoji: "🌳",
          title: "Nota de Fundo",
          desc: "É a base da fragrância. Pode durar muitas horas na pele.",
          examples: ["Baunilha", "Âmbar", "Musk", "Sândalo", "Patchouli"],
          feel: "✨ Profundidade, elegância e fixação."
        }
      ],
      families: [
        {
          id: "citrica",
          emoji: "🍋",
          title: "Família Cítrica",
          characteristics: ["Refrescante", "Leve", "Energizante"],
          idealFor: ["Dia a dia", "Verão", "Trabalho"],
          commonNotes: ["Limão", "Bergamota", "Laranja", "Mandarina"]
        },
        {
          id: "floral",
          emoji: "🌸",
          title: "Família Floral",
          characteristics: ["Feminina", "Delicada", "Romântica"],
          idealFor: ["Uso diário", "Encontros", "Primavera"],
          commonNotes: ["Rosa", "Jasmim", "Peônia", "Lírio"]
        },
        {
          id: "oriental",
          emoji: "🍦",
          title: "Família Oriental / Ambarada",
          characteristics: ["Sensual", "Marcante", "Sofisticada"],
          idealFor: ["Noite", "Eventos especiais", "Inverno"],
          commonNotes: ["Baunilha", "Âmbar", "Canela", "Cardamomo"]
        },
        {
          id: "amadeirada",
          emoji: "🌲",
          title: "Família Amadeirada",
          characteristics: ["Elegante", "Moderna", "Intensa"],
          idealFor: ["Trabalho", "Noite", "Outono/Inverno"],
          commonNotes: ["Sândalo", "Cedro", "Vetiver", "Patchouli"]
        },
        {
          id: "gourmand",
          emoji: "🍬",
          title: "Família Gourmand",
          characteristics: ["Doce", "Confortável", "Viciante"],
          idealFor: ["Dias frios", "Encontros", "Quem gosta de perfumes doces"],
          commonNotes: ["Caramelo", "Chocolate", "Baunilha", "Praliné"]
        }
      ],
      howToChoose: {
        title: "💡 Como escolher seu perfume?",
        tips: [
          { label: "Se você gosta de perfumes leves:", values: "🍋 Cítricos | 🌿 Verdes | 🌊 Aquáticos" },
          { label: "Se você gosta de perfumes femininos e delicados:", values: "🌸 Florais | 🌷 Floral Frutado" },
          { label: "Se você gosta de perfumes sensuais:", values: "🔥 Orientais | 🍦 Gourmand" },
          { label: "Se você gosta de perfumes elegantes:", values: "🌲 Amadeirados | 🌿 Aromáticos" }
        ]
      }
    },
    it: {
      title: "Guida alle Note Olfattive VisCaree",
      introTitle: "Cosa sono le note olfattive?",
      introText: "Le note olfattive sono gli aromi che compongono un profumo e compaiono in diversi momenti dopo l'applicazione.",
      notes: [
        {
          emoji: "🍋",
          title: "Note di Testa",
          desc: "È la prima impressione del profumo. Dura solitamente dai 5 ai 15 minuti.",
          examples: ["Limone", "Bergamotto", "Arancia", "Mandarino", "Menta"],
          feel: "✨ Freschezza, energia e leggerezza."
        },
        {
          emoji: "🌺",
          title: "Note di Cuore",
          desc: "Emergono dopo l'evaporazione delle note di testa. Permangono per diverse ore.",
          examples: ["Rosa", "Gelsomino", "Lavanda", "Peonia", "Fiore d'Arancio"],
          feel: "✨ Personalità e identità del profumo."
        },
        {
          emoji: "🌳",
          title: "Note di Fondo",
          desc: "È la base della fragranza. Può durare molte ore sulla pelle.",
          examples: ["Vaniglia", "Ambra", "Muschio", "Sandalo", "Patchouli"],
          feel: "✨ Profondità, eleganza e persistenza."
        }
      ],
      families: [
        {
          id: "citrica",
          emoji: "🍋",
          title: "Famiglia Agrumata",
          characteristics: ["Rinfrescante", "Leggera", "Energizzante"],
          idealFor: ["Uso quotidiano", "Estate", "Lavoro"],
          commonNotes: ["Limone", "Bergamotto", "Arancia", "Mandarino"]
        },
        {
          id: "floral",
          emoji: "🌸",
          title: "Famiglia Floreale",
          characteristics: ["Femminile", "Delicata", "Romantica"],
          idealFor: ["Uso quotidiano", "Appuntamenti", "Primavera"],
          commonNotes: ["Rosa", "Gelsomino", "Peonia", "Giglio"]
        },
        {
          id: "oriental",
          emoji: "🍦",
          title: "Famiglia Orientale / Ambrata",
          characteristics: ["Sensuale", "Intensa", "Sofisticata"],
          idealFor: ["Sera", "Eventi speciali", "Inverno"],
          commonNotes: ["Vaniglia", "Ambra", "Cannella", "Cardamomo"]
        },
        {
          id: "amadeirada",
          emoji: "🌲",
          title: "Famiglia Legnosa",
          characteristics: ["Elegante", "Moderna", "Intensa"],
          idealFor: ["Lavoro", "Sera", "Autunno/Inverno"],
          commonNotes: ["Sandalo", "Cedro", "Vetiver", "Patchouli"]
        },
        {
          id: "gourmand",
          emoji: "🍬",
          title: "Famiglia Gourmand",
          characteristics: ["Dolce", "Confortevole", "Creante dipendenza"],
          idealFor: ["Giornate fredde", "Appuntamenti", "Chi ama i profumi dolci"],
          commonNotes: ["Caramello", "Cioccolato", "Vaniglia", "Pralina"]
        }
      ],
      howToChoose: {
        title: "💡 Come scegliere il tuo profumo?",
        tips: [
          { label: "Se ti piacciono i profumi leggeri:", values: "🍋 Agrumati | 🌿 Verdi | 🌊 Acquatici" },
          { label: "Se ti piacciono i profumi femminili e delicati:", values: "🌸 Floreali | 🌷 Floreale Fruttato" },
          { label: "Se ti piacciono i profumi sensuali:", values: "🔥 Orientali | 🍦 Gourmand" },
          { label: "Se ti piacciono i profumi eleganti:", values: "🌲 Legnosi | 🌿 Aromatici" }
        ]
      }
    }
  };

  const t = isPt ? content.pt : content.it;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#F1E7E2]/30 flex flex-col selection:bg-dourado-suave/30">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-16">
              <header className="mb-16 text-center">
                <span className="text-dourado-suave font-sans-premium text-xs tracking-[0.3em] uppercase font-bold mb-4 block">
                  {isPt ? "Alta Perfumaria" : "Alta Profumeria"}
                </span>
                <h1 className="font-serif-premium text-3xl md:text-5xl text-neutral-900 mb-6 font-light">
                  {t.title}
                </h1>
                <div className="w-12 h-0.5 bg-dourado-suave mx-auto mb-8"></div>
              </header>

              {/* Intro */}
              <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100 mb-12">
                <h2 className="font-serif-premium text-2xl text-neutral-900 mb-4">{t.introTitle}</h2>
                <p className="font-sans-premium text-sm text-neutral-600 leading-relaxed mb-8">
                  {t.introText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {t.notes.map((note, index) => (
                    <div key={index} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                      <div className="text-3xl mb-4">{note.emoji}</div>
                      <h3 className="font-serif-premium text-lg text-neutral-900 mb-3">{note.title}</h3>
                      <p className="font-sans-premium text-xs text-neutral-500 mb-4 leading-relaxed">{note.desc}</p>
                      
                      <div className="mb-4">
                        <span className="font-sans-premium text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-2">
                          {isPt ? "Exemplos:" : "Esempi:"}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {note.examples.map((ex, i) => (
                            <span key={i} className="bg-white border border-neutral-200 text-neutral-600 px-2 py-1 rounded-md text-[10px] font-sans-premium">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p className="font-sans-premium text-[11px] text-dourado-suave font-medium bg-[#F1E7E2]/50 p-3 rounded-xl">
                        {note.feel}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Families */}
              <div className="space-y-12 mb-16">
                {t.families.map((family, index) => {
                  const images = familyImages[family.id as keyof typeof familyImages] || [];
                  
                  return (
                    <div key={index} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-neutral-100 transition-all hover:shadow-md hover:border-dourado-suave/30">
                      
                      {images.length > 0 && (
                        <div className="w-full h-48 md:h-64 mb-8 overflow-hidden rounded-2xl relative">
                          <img 
                            src={images[0]} 
                            alt={family.title} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-24 h-24 shrink-0 bg-[#F1E7E2]/50 rounded-full flex items-center justify-center text-5xl">
                          {family.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif-premium text-2xl text-neutral-900 mb-6 text-center md:text-left">{family.title}</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                              <span className="font-sans-premium text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">
                                {isPt ? "Características:" : "Caratteristiche:"}
                              </span>
                              <ul className="space-y-2">
                                {family.characteristics.map((char, i) => (
                                  <li key={i} className="font-sans-premium text-xs text-neutral-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-dourado-suave rounded-full shrink-0"></span>
                                    {char}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-sans-premium text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">
                                {isPt ? "Ideal para:" : "Ideale per:"}
                              </span>
                              <ul className="space-y-2">
                                {family.idealFor.map((ideal, i) => (
                                  <li key={i} className="font-sans-premium text-xs text-neutral-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full shrink-0"></span>
                                    {ideal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-sans-premium text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">
                                {isPt ? "Notas comuns:" : "Note comuni:"}
                              </span>
                              <ul className="space-y-2">
                                {family.commonNotes.map((note, i) => (
                                  <li key={i} className="font-sans-premium text-xs text-neutral-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#C8A97E]/50 rounded-full shrink-0"></span>
                                    {note}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* How to Choose */}
              <section className="bg-neutral-900 text-white p-8 md:p-12 rounded-3xl shadow-xl mb-12">
                <h2 className="font-serif-premium text-2xl mb-8 text-center">{t.howToChoose.title}</h2>
                <div className="space-y-6">
                  {t.howToChoose.tips.map((tip, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                      <span className="font-sans-premium text-sm text-neutral-400 mb-2 md:mb-0">{tip.label}</span>
                      <span className="font-sans-premium text-sm font-semibold tracking-wide text-dourado-suave bg-dourado-suave/10 px-4 py-2 rounded-xl text-center">
                        {tip.values}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
