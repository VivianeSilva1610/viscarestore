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
      "https://images.openai.com/static-rsc-4/5Uf7MLgxjiJA_L2I72K8StS11lWGaicY27E_fSQJiZ1s993Sxx0jbXJNd2wEdI2WD4QurU21kAy3WYzB_T19J_y9tOgGOTJm6SSmXnZ9ijrcoB1-IhmPare6zPUM8RE-r2FTiUg9bRsyhs0x7COlDzOxBfAq4Nexqxo8Dw2eIAv64H2p4BQRYME8VkcbHIMx?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/UQs2fHJm39JDDOcE7_nxWC74btl4tyjLfIe7FqrcjhlVDX-EUiazh6214dA7nIipufntrRhlgouYEtqx41gStfLx8Ys2MB7sc3A75J1ocBjqSWV1alhy3hl7_rMUW_77BPTWTCxyS6yJUPQxxdyFZMt5KAqU_gwbRH8kHNC6SXb9bVz3ttK8av61Hvy0qmF-?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/7IFg30Hil_j3KtQ6PihAbptuOLaWcTI5urzHIz-bObCSbuRRnDybQYmqHYnBu8vBtChSU2xc0-apWyw6LPwqiYpjKcI5m8ErvV54KB4mLH1OAFJr-yKduaT58vnNG0rwPbLUC1d0opELgAqT4LoF-FEtbbGfbezBG90rVYVpHNGutcOQlhes_yW6ZW3P0sgl?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/QtpRxYuKV1us_XJnFt0bPYNJpRzhfq0mZEq0rR78qneJkIyaohLWLVjcCot_JL6sScE-zdksIrnwqduvRiBHVEUDtGATYHgpZ6PdUECISXoznvH8F8fbnzxx6x_cKPiD4WpEeu9DX2ZCCxFIQSyklic_jD28_736WVQGHNPMSvVsA3eC8nOAwtiIlL09BOAt?purpose=fullsize"
    ],
    floral: [
      "https://images.openai.com/static-rsc-4/AZr-PFxvLd3vQQeQwOsstIqjBIcOT5k3IoTi16pjiq3Ilq8nry5yPGfOAfbFv-8sMa12xBtNxi6AXtiFibfFLGUxTXLAx99TRLFkDLv7PeBc4i4hkg3dVCwuRnzA8P16yBjeAZeNj-vkva1137VZy215yHQJJpt-dHSf-POM3UNotFygDbaiGhtqQSaxf6TG?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/Ir4IkqPi58STT2cTMEnLy67F-yWB6zwBt5z9N7WeyjoPMYYdVJzpzt6u7z3LFjpXKeLxq2_zCTK1nXnYgisjrlGmFEGHXS0K0sGtFt1WjUlpKwAXtg4nKVhmcm5waZi91CDEXYRP5p1Lmrz3ISL3PIprTOM9wew0xB9AeymS2QIFakevbuvUqujQdzv6odS3?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/BwczkaCbOdcVKTYTsO0oK1yWQyAL5fqAbnUVTdhBiH5dlnf2CvX6CShZfTdEmlBoDkL6_1zR9B9on8MDqgI8kXGAUGvGcSS6cgaJATIyU4_jnEAW3xbQPaDeWzhH_rDsNm79Q7GjDK9953wrMsiI7FCNau7OVTYnabnZsu4gA3oj0uKzFuHb8zK8KkpJ2yOL?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/EnAAaTJqkyRGctoABtlf4hjFksxdjxLczceZ4S_B8YruMK0-VSrfp32i2N2BNrvDoHf6CJfPyZ3XfqMDneQRdBO6EN88JrkBOWXzRWkN9ieRHzssg0KGhyfm17GIJD8cx8QQ-5sWRa8CNbG26hHk97jHmqpuTBQaKUQ-NaPLOh3uVFnaxZ-UwU_S7mJn3r4b?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/uenESSpcJ_2VrMTXbeGnS324awlJ0icdMpoFuW3n--clJp8ju-cmC7Om0oSrNgluhN37Jki04Xdl99I405V2iuRIQvunWDOweopmnPqh8gEjoByWsy3ZChZAbc_wJzCjYFfqFKpfHbFDdlqeOInqnS4AGsR7IXlJYnGgG7QcR4vO3QOED7LaJkW4eHA3HQbd?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/qPKLgmVzClDKCwPgbOABzowi_Ke-ULDRj13c350NFSut5pTKY7bg1JUCR2CEw1Mo2o2HZgWOLRjwCZWRDANOrfxXi-TQWbU6kRy-xCKdUH_HEU5ZEl-77o27G0_kAFQAu827SErh-i2eH-7Ycx9Cx9yx7t5P8dgjHSIMsh3o1Uo7kfv3689NheeP7LqxyABS?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/wG-yHulb8jdtyl0ZTAz2IBmFCLVPLgBVr6Kg2-DO7XPnVb2Bcl0LWJY_AJpScCQ8bdaymxp9mBNx07ssw5hLpddwUHhNQqq4-BZ0gQ9ztMnPJ-_-REgcuCUZdIElo-ehpMwtyD2v5e5LzFjwr2BL7T5PfZJbxvEyEWbB9u47n5FW4TANJnmYBVLziEYUm1PN?purpose=fullsize"
    ],
    oriental: [
      "https://images.openai.com/static-rsc-4/T7jLJ7zw32AxZi9whxA6-r28_YeZHyI_iH9-m2e693th4KgG-UqI34VpZEIbEvhGlBlU5R5MRddAuTWyY6h2HZeZAyqxPt1-7QbUlL0CvzXAAMCYHH6Zix02frvlVFURawQy9fH8Gdp723jz7JCEuxYm-yvw7PRd6M_q7gWRDDjc2frtHNDt_cbZ8fOKI-dg?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/HhaFZ0RrsZ3rcPQKaUXw9Wc29_-VfX_lk0dHJRhH9kkfjoKzkvpm_W67aLRVlRiO9lksEH4mRwDsGOuVYQQ3Lgonv_YS9xoa32exXvmg8TKOrBLWeDSAAnGtaMVa1qk8ogdg_DJaWWGYpoQNHxjddbdean6ThsEWHnT0z7yTLo_6vhXIu5z0Upme5ISp5LwK?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/Wemsb4pu_HpHnrcrxtGgs0jQQA3P0v2qnrScygGaw9HzjZ6R-PFiRMQcNdEFQR2xe7VX1ei3jabPOu51efltg4_8wBW19pIfoZNFRjSJS-sDdbqJFGE2HAbCjOCQBxGVfxwVq3f8Td10UNGfiKfEMzTJv4mp0q_tJG6MwojtysiRUC6ggopqMbNm9JdbWeUT?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/5V_VYrz1q3U_iE8p0zvhpNvX9U19RXEJmcfIl-6oHflrobuDEpX7Tl5IVSQiFFKsRk1RdHvobSO8iUA7Zxh1fapaE1JeZgH8_IdgM29ybENI0OvFLk3f_kEtwpoqKmcmHvaA1nEngcyBuHxvRjlEDXXizxUfa-9FPDR5IPcOUNf5ugiYJkuvBYA9BhFJ0XXC?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/vnnJ2U8eBuvPr5PmOJz-ONmW6Qkoe4wGlgvWRcBqDp-HhgL8YAYkPGEFvK94f96DQozi0PhT1kVR4Fiyzf3M_Lywlec2DXcgD0xF1k_e_1RqPJJ9Lt_ViFmOKbfvjC9MbnleN7iD_kqJrkJ4nvZBVr7miWYiCcH8uqbdxmEa3f9j2Mm8YtV--HsUO0NFTCDa?purpose=fullsize"
    ],
    amadeirada: [
      "https://images.openai.com/static-rsc-4/0I-RWs4qWmn-sdDDBeDJA4iX18zzaexut8Q4JmI1CJUdg3Yx5H5HPKGA0Q6wJedGO6m4orayh_BVOVfjJD7XV5eoUliQB2P4Cfva-u6Z4N1387Luz3N9HdqdOzT6xluqWi532br26cXx_c8tr0pjqCwI94_n4uMLynRc7Bs9ZzNzl42X2RFmpnyanx7a9hkM?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/o5bqSw5mOXWTPbt6pulP3r3MIjBErBtfPyBpktIgKHJnEqD8F88T2VaEZYOrVXv92toHdVwqADU372zJCKvka0fHDOHT0zv7XPsahrp9AiJecxSa1mR_bI8uBeJ8p_nYH4ONIppdhL-v3iDkQjnaTiGC7_4SF8It6ENEJi7w93SCcwqfHlLyYZjxldBDYWfV?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/XRGFwC1MZ67U9hcqlG29GRPGEmRPyb1j5KYFuRcE4tFPDZUvIrMU9Dg-VVhWEgawvjtLqC_zSOgp5hMu25IwUr755GGnz61xFcVA7sTvo58YD4I0fgXsSzhTjc9CPSTIOKHU9qAVHsAR4c1aM8XMg2cOxCF5CsqvpJET1TSDAC77zrWMRvm_bR6wUH9q2_Y2?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/JodRwQOfwD5Z2zFjP2qf8D11FbzsIZVt-uf5XNh3fDN-rVLyPLtnvB5bQjSZo-7Y6_kHczSjUxgg6MFOT5RLA5zRWr-xvQlw88vhKit9b-ykVn_ztDde2M3JuyQVu55HIXLsTMAajUONr1k-VRCnq-K5CpJOO8ShPd1KXvFzVWT1HWed3Kxm7fOMqAuwWnKU?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/hY7Z6vZEcfs0eEjzzPyEw0YgbaSalExcTwEGRucycp57V3paMvxR_lmvUb5tKZTL0Uy24HZTAeZ3I-zid3Ti-LKwj9znHyqQXared9gdmcHi-NN67Y5ynsaAETwxJAlYMDCGxs-EKbnoOOqsyjP4k3CAFVpJ_Tqh9YlAMBgY6OkqpoJ6sIRNdtpcAx_GLtgd?purpose=fullsize"
    ],
    gourmand: [
      "https://images.openai.com/static-rsc-4/jaxhTk6b-rzHodU-kK7nCEtwGIwhq_FzZ55TrnRL6eiCO9E-wYQ1lit-sV_2Vc9DWaCV6jPsaFPPcLoKt8MJiKkO2EKL4GONboD-ZK-1Wwi4BgAF7vzqnpnwjUcjHWYxMPjfW8pt-3NIqu2COLAApJNaISuagJtYf_AoS7wY7am2Os_gzxlKRVce0ItUJWPM?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/paDWNq9uYxmkzLmret42McBrF5HR77vrrlNsF45VYltz7L9gJdt4yVcAP2ZCCd3aGNDFZ0zEBJaR0xBUxrpZG4c3u_e-hvBU1mLCoqzPaC7UOcL80qxu7xGtvTejt_s4AJSkkpGR8Y_8ijwd5hEkpapOkByPUyEnHFIWACpUyyeR6QX54ovr5ZdEcIrAC50O?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/nqZz7B5iz9doXCq3Eg9Ibm8rClvMUS_riSqV1YaANuzeYTidRQMJRKdYV0vEEPdoKfc88G0X29ukLNU-j6wcUA9sf_2NKhaYpID-bW2dqkbcv7luT0Aid72sRldnBHGQLlTGFrhpaUg9xLtIWz-1z3DKoEH_J5g_YNbHKAvsLBb6qSfkfZA9FtM_4xAT7NIf?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/ippLeIUbJ5bVFRIvnD1wxnx9z7de3fxq366vLW3mEXawb_So-ALGQUCcQ2zufAY1DVRpmfIsiy7YnayCxH9ibC_IvA0eq7N2FGr6e16ZJqDItSnBO3qpDuzOOlSD0rDXImftq96xK-q0YdnPSCFkYGxMRzrvsllEsRwZNDLL6MklOAJPkj76E1MYP4Oon4UH?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/j7sPjUKFB6q9QxySEhlnQmkUwIV00K-bncfnAQqBNeZ4WDmFPgfoaGMbNzVtZ6PqNT8GlTMfjpE_QaujhRUCeuDXdvlZpBKrfdgNYlQqPxpjGJIqaTggY94bsFD7RR008IEBv_D-iidogVsigghGzt1miK0PgZS0JV8tJUBXw50AGw73RlabDVbILKEIHL5v?purpose=fullsize",
      "https://images.openai.com/static-rsc-4/nFSax2tb5Ywc29Xf3CPMIfDSs8ZX0mmfFl0SCMZiL2tGX1gVsqlTxLUCYZ9TVh-p0Dq6TwOjD7dHUDyugNoO4c58voTF5jt9kUCpgd_jS1RXVGIowWKCoPPeJdrm-v-XHRYbg5TOOsy74ji_pZ0aXnU_dmwWUbnDFpNf-838HIuSSYVW8RrJnc-APLbLQlHv?purpose=fullsize"
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
                      
                      {/* Imagens no topo (com rolagem horizontal suave no mobile) */}
                      {images.length > 0 && (
                        <div className="flex overflow-x-auto gap-4 pb-6 mb-6 border-b border-neutral-100 snap-x hide-scrollbar">
                          {images.map((img, imgIndex) => (
                            <div key={imgIndex} className="shrink-0 snap-start">
                              <img 
                                src={img} 
                                alt={family.title} 
                                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl border border-neutral-100 shadow-sm"
                                loading="lazy"
                              />
                            </div>
                          ))}
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
