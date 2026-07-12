"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { dictionary } from "../locales/dictionary";

export default function Categories() {
  const { language } = useLanguage();
  const t = dictionary[language].categories;

  const categories = [
    {
      id: "perfumes",
      title: t.items.perfumes.title,
      subtitle: t.items.perfumes.subtitle,
      description: t.items.perfumes.description,
      details: t.items.perfumes.details,
      image: "/images/cat-perfumes.png",
      link: "/profumi",
      gridClass: "lg:col-span-8 lg:row-span-1 h-[450px] lg:h-[500px]",
    },
    {
      id: "skincare",
      title: t.items.skincare.title,
      subtitle: t.items.skincare.subtitle,
      description: t.items.skincare.description,
      details: t.items.skincare.details,
      image: "/images/cat-skincare.png",
      link: "#skincare",
      gridClass: "lg:col-span-4 lg:row-span-2 h-[450px] lg:h-[770px]",
    },
    {
      id: "fashion",
      title: t.items.fashion.title,
      subtitle: t.items.fashion.subtitle,
      description: t.items.fashion.description,
      details: t.items.fashion.details,
      image: "/images/cat-fashion.png",
      link: "#dresses",
      gridClass: "lg:col-span-8 lg:row-span-1 h-[450px] lg:h-[500px] lg:-mt-[230px]",
    },
  ];

  const handleExplore = (e: React.MouseEvent<HTMLAnchorElement>, link: string, categoryId: string) => {
    if (!link.startsWith("#")) return; // let the browser navigate normally
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('changeCategory', { detail: categoryId }));
    setTimeout(() => {
      const section = document.getElementById('products-section');
      if (section) {
        const yOffset = -80;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section className="py-24 bg-[#E7D8D0]/30 relative" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-dourado-suave font-semibold block mb-4">
            {t.destaque}
          </span>
          <h2 className="font-serif-premium text-3xl sm:text-4xl tracking-wide text-neutral-900 font-light">
            {t.sinergia}
          </h2>
          <div className="h-[1px] w-20 bg-dourado-suave mx-auto mt-6" />
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className={`group relative overflow-hidden rounded-2xl shadow-lg border border-white/10 flex flex-col justify-end p-6 sm:p-10 ${cat.gridClass}`}
            >
              {/* Category Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                  className="object-cover zoom-image"
                />
                {/* Overlay: Dark glassmorphism/gradient on bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/5 group-hover:from-black/80 transition-all duration-500" />
              </div>

              {/* Category Content */}
              <div className="relative z-10 text-white space-y-3 max-w-xl">
                <span className="font-sans-premium text-[9px] tracking-[0.25em] uppercase text-dourado-suave font-semibold block">
                  {cat.subtitle}
                </span>
                
                <h3 className="font-serif-premium text-2xl sm:text-3xl tracking-wide font-light">
                  {cat.title}
                </h3>
                
                <p className="font-sans-premium text-xs leading-relaxed text-white/70 font-light tracking-wide max-w-md opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all duration-500 ease-in-out">
                  {cat.description}
                </p>

                <div className="border-t border-white/10 pt-3 mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="font-serif-premium text-xs italic text-white/60">
                    {cat.details}
                  </span>
                  
                  <a
                    href={cat.link}
                    onClick={(e) => handleExplore(e, cat.link, cat.id)}
                    className="font-sans-premium text-[10px] tracking-[0.2em] uppercase text-dourado-suave hover:text-white font-medium inline-flex items-center space-x-1.5 transition-colors duration-300 self-start sm:self-auto"
                  >
                    <span>{t.explorar}</span>
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
