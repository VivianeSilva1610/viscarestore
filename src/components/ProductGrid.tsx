"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  details: string;
  volume?: string;
  activeIngredient?: string;
  sizes?: string[];
  inStock?: boolean;
}

export default function ProductGrid() {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    prod_dress: "M", // Default size for the dress
  });
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: "prod_perfume",
      name: "L'Élixir d'Aura",
      category: "Perfumes",
      price: 890.0,
      image: "/images/perfume.png",
      description: "Alta Perfumaria • 100ml",
      details: "Notas Olfativas: Jasmin Imperial, Sândalo de Mysore e Bergamota da Calábria. Uma fragrância marcante e sofisticada desenvolvida sob medida para a alma contemporânea.",
      volume: "100ml",
      inStock: false,
    },
    {
      id: "prod_serum",
      name: "Sérum Facial Regenerador",
      category: "Skincare",
      price: 420.0,
      image: "/images/serum.png",
      description: "Alta Tecnologia • 30ml",
      details: "Indicação Técnica: Ácido Hialurônico Concentrado 2% + Niacinamida 5%. Estimula a regeneração celular profunda, devolvendo viço, elasticidade e luminosidade natural à pele.",
      activeIngredient: "Ácido Hialurônico",
      inStock: false,
    },
    {
      id: "prod_dress",
      name: "Vestido Fluído em Seda Nude",
      category: "Vestidos",
      price: 1850.0,
      image: "/images/dress.png",
      description: "Seda Pura 100%",
      details: "Vestido fluído drapeado em seda pura na cor Nude Rosé. Modelagem premium que abraça as curvas com leveza, toque aveludado e movimento sofisticado.",
      sizes: ["P", "M", "G"],
      inStock: false,
    },
    {
      id: "prod_bag",
      name: "Bolsa Estruturada Minimalista",
      category: "Acessórios",
      price: 2400.0,
      image: "/images/handbag.png",
      description: "Couro Legítimo Italiano",
      details: "Design atemporal estruturado em couro nobre cor areia, com fecho e detalhes finos em metal banhado a ouro suave. Perfeita para finalizar visuais elegantes.",
      inStock: false,
    },
  ];

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleAddToCart = (product: Product) => {
    const size = product.sizes ? selectedSizes[product.id] : undefined;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      size,
    });
  };

  const filteredProducts =
    activeTab === "todos"
      ? products
      : products.filter((p) => p.category.toLowerCase() === activeTab);

  return (
    <section className="py-24 bg-white" id="new-arrivals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-dourado-suave font-semibold block mb-4">
              Coleção Modelo
            </span>
            <h2 className="font-serif-premium text-3xl sm:text-4xl tracking-wide text-neutral-900 font-light">
              Nossa Curadoria Exclusiva
            </h2>
          </div>
          
          {/* Navigation Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-neutral-900/5 pb-2">
            {["todos", "perfumes", "skincare", "vestidos", "acessórios"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-sans-premium text-[10px] sm:text-xs tracking-[0.2em] uppercase py-2 px-3 transition-colors duration-300 font-medium relative ${
                  activeTab === tab ? "text-dourado-suave" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-dourado-suave"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="group flex flex-col justify-between"
            >
              {/* Product Card Container */}
              <div className="relative aspect-[3/4] bg-[#F1E7E2] rounded-2xl overflow-hidden mb-5 border border-[#C8A97E]/10 group shadow-sm hover:shadow-md transition-shadow duration-500">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-w-768px) 100vw, 25vw"
                  className="object-cover zoom-image mix-blend-multiply"
                />

                {/* Details Floating Badge (Volume or Active Ingredient) */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
                  {product.inStock === false && (
                    <span className="bg-red-500/90 backdrop-blur-sm text-[9px] font-sans-premium tracking-widest text-white uppercase px-2.5 py-1 rounded-full font-bold">
                      Esgotado
                    </span>
                  )}
                  {product.volume && (
                    <span className="glass-card text-[9px] font-sans-premium tracking-widest text-neutral-800 uppercase px-2.5 py-1 rounded-full font-semibold">
                      {product.volume}
                    </span>
                  )}
                  {product.activeIngredient && (
                    <span className="glass-card text-[9px] font-sans-premium tracking-widest text-dourado-suave uppercase px-2.5 py-1 rounded-full font-semibold">
                      {product.activeIngredient}
                    </span>
                  )}
                </div>

                {/* Quick Info Hover Action */}
                <button
                  onClick={() => setSelectedProductDetails(product)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full glass-card text-neutral-700 hover:text-dourado-suave hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                  aria-label="Ver detalhes rápidos"
                >
                  <Eye size={16} strokeWidth={2} />
                </button>

                {/* Dynamic "Add to Bag" Hover Overlay Button */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#F1E7E2]/90 via-[#F1E7E2]/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col items-center">
                  
                  {/* Silk Dress Size Selector inside Hover */}
                  {product.sizes && (
                    <div className="w-full flex flex-col items-center mb-4">
                      <span className="font-sans-premium text-[9px] tracking-widest text-neutral-600 uppercase mb-2">
                        Selecione o tamanho:
                      </span>
                      <div className="flex space-x-2">
                        {product.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSizeSelect(product.id, sz);
                            }}
                            className={`w-7 h-7 rounded-full text-[10px] font-sans-premium font-semibold flex items-center justify-center border transition-all duration-300 ${
                              selectedSizes[product.id] === sz
                                ? "bg-dourado-suave border-dourado-suave text-white shadow-sm"
                                : "bg-white/60 border-neutral-900/10 hover:border-dourado-suave text-neutral-800"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.inStock === false}
                    className="w-full py-3 bg-neutral-900 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-sans-premium text-[10px] tracking-[0.25em] uppercase hover:bg-dourado-suave font-semibold transition-colors duration-300 shadow-lg rounded-xl flex items-center justify-center space-x-2"
                  >
                    {product.inStock === false ? (
                      <span>Esgotado</span>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Adicionar à Sacola</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info Description */}
              <div className="text-center px-1">
                <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">
                  {product.category}
                </span>
                
                <h3 className="font-serif-premium text-lg sm:text-xl text-neutral-900 font-light tracking-wide hover:text-dourado-suave transition-colors duration-300 cursor-pointer" onClick={() => setSelectedProductDetails(product)}>
                  {product.name}
                </h3>
                
                <p className="font-sans-premium text-[10px] text-neutral-500 tracking-wider font-light mt-1.5 mb-2.5">
                  {product.description}
                </p>

                <p className="font-sans-premium text-sm font-semibold tracking-widest text-neutral-900">
                  R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Details Modal (Quick View) */}
      <AnimatePresence>
        {selectedProductDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductDetails(null)}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-dourado-suave/10"
            >
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-5 right-5 z-20 text-neutral-400 hover:text-neutral-900 p-2 transition-colors"
                aria-label="Fechar modal"
              >
                &times;
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Panel */}
                <div className="relative aspect-[3/4] bg-[#F1E7E2]">
                  <Image
                    src={selectedProductDetails.image}
                    alt={selectedProductDetails.name}
                    fill
                    className="object-cover mix-blend-multiply"
                  />
                </div>

                {/* Details Panel */}
                <div className="p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="font-sans-premium text-[10px] tracking-[0.25em] text-dourado-suave font-semibold uppercase block mb-2">
                      {selectedProductDetails.category}
                    </span>
                    <h3 className="font-serif-premium text-2xl sm:text-3xl text-neutral-900 tracking-wide font-light mb-4">
                      {selectedProductDetails.name}
                    </h3>
                    <p className="font-sans-premium text-base font-semibold tracking-wider text-neutral-900 mb-6 border-b border-neutral-100 pb-4">
                      R$ {selectedProductDetails.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      <p className="font-sans-premium text-xs text-neutral-600 leading-relaxed font-light tracking-wide">
                        {selectedProductDetails.details}
                      </p>
                    </div>

                    {/* Sizelist inside modal */}
                    {selectedProductDetails.sizes && (
                      <div className="mb-6">
                        <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-3">
                          Selecione o tamanho:
                        </span>
                        <div className="flex space-x-3">
                          {selectedProductDetails.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeSelect(selectedProductDetails.id, sz)}
                              className={`w-9 h-9 rounded-full text-[11px] font-sans-premium font-semibold flex items-center justify-center border transition-all duration-300 ${
                                selectedSizes[selectedProductDetails.id] === sz
                                  ? "bg-dourado-suave border-dourado-suave text-white shadow-sm"
                                  : "bg-white border-neutral-900/10 hover:border-dourado-suave text-neutral-800"
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProductDetails);
                        setSelectedProductDetails(null);
                      }}
                      disabled={selectedProductDetails.inStock === false}
                      className="w-full py-4 bg-neutral-900 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-sans-premium text-xs tracking-[0.25em] uppercase hover:bg-dourado-suave font-semibold transition-colors duration-300 shadow-md rounded-xl flex items-center justify-center space-x-2"
                    >
                      {selectedProductDetails.inStock === false ? (
                        <span>Esgotado</span>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Adicionar à Sacola</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
