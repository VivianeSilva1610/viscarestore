"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { dictionary } from "../locales/dictionary";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Plus, Loader2, X } from "lucide-react";
import { databases, storage, isAppwriteConfigured } from "../lib/appwrite";
import { Query } from "appwrite";

const DB_ID = "6a390e430024feb8df57";
const COLLECTION_ID = "products";
const BUCKET_ID = "6a391020001d02651b57";
const CATEGORIES_COL_ID = "categories";

interface Product {
  id: string;
  name_pt: string;
  name_it: string;
  category: string;
  price: number;
  weight_kg?: number;
  image: string;
  description_pt: string;
  description_it: string;
  details_pt: string;
  details_it: string;
  volume?: string;
  activeIngredient?: string;
  sizes?: string[];
  inStock?: boolean;
  ingredients_pt?: string;
  ingredients_it?: string;
}

export default function ProductGrid() {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = dictionary[language].grid;

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    prod_dress: "M", // Default size for the dress
  });
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{label: string, label_it?: string, value: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [customTitle, setCustomTitle] = useState("");
  const [customTitleIt, setCustomTitleIt] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [customSubtitleIt, setCustomSubtitleIt] = useState("");

  // Listen for category change events from other components (like Categories.tsx)
  React.useEffect(() => {
    const handleCategoryChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setActiveTab(customEvent.detail);
    };
    window.addEventListener('changeCategory', handleCategoryChange);
    
    // Check URL parameters for category
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get("category");
      if (cat) {
        setActiveTab(cat);
      }
    }
    
    return () => window.removeEventListener('changeCategory', handleCategoryChange);
  }, []);

  // Load custom titles from Appwrite
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { databases, isAppwriteConfigured } = await import("../lib/appwrite");
        const { Query } = await import("appwrite");
        if (!isAppwriteConfigured()) return;
        
        const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
        const PAGES_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_PAGES_COLLECTION_ID || "pages";
        const res = await databases.listDocuments(DB_ID, PAGES_COL_ID, [Query.equal("slug", "global-settings")]);
        if (res.documents.length > 0) {
          const settings = JSON.parse(res.documents[0].content);
          if (settings.gridTitle) setCustomTitle(settings.gridTitle);
          if (settings.gridTitleIt) setCustomTitleIt(settings.gridTitleIt);
          if (settings.gridSubtitle) setCustomSubtitle(settings.gridSubtitle);
          if (settings.gridSubtitleIt) setCustomSubtitleIt(settings.gridSubtitleIt);
        }
      } catch (err) {
        console.error("Erro ao carregar configurações", err);
      }
    };
    fetchSettings();
  }, []);

  // Fetch products and categories from Appwrite
  React.useEffect(() => {
    const fetchData = async () => {
      if (!isAppwriteConfigured()) {
        setIsLoading(false);
        return;
      }
      try {
        const [prodRes, catRes] = await Promise.all([
          databases.listDocuments(DB_ID, COLLECTION_ID, [
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]),
          databases.listDocuments(DB_ID, CATEGORIES_COL_ID, [
            Query.limit(50),
          ]),
        ]);

        const formattedCategories = catRes.documents.map((c: any) => ({
          label: c.label,
          label_it: c.name_it || "",
          value: c.value,
        }));
        setCategories(formattedCategories);

        const formattedProducts = prodRes.documents.map((doc: any): Product => {
          let imageUrl = "/images/perfume.png"; // Fallback image
          if (doc.image_id) {
            imageUrl = storage.getFileView(BUCKET_ID, doc.image_id).toString();
          }

          let sizesArr = undefined;
          if (doc.sizes && doc.sizes.trim() !== "") {
            sizesArr = doc.sizes.split(",").map((s: string) => s.trim());
          }

          return {
            id: doc.$id,
            name_pt: doc.name_pt || "Sem nome",
            name_it: doc.name_it || "",
            category: doc.category || "geral",
            price: doc.price || 0,
            weight_kg: doc.weight_kg ?? 0.5,
            image: imageUrl,
            description_pt: doc.description_pt ? doc.description_pt.substring(0, 50) + "..." : "",
            description_it: doc.description_it ? doc.description_it.substring(0, 50) + "..." : "",
            details_pt: doc.description_pt || "",
            details_it: doc.description_it || "",
            sizes: sizesArr,
            inStock: doc.in_stock,
            ingredients_pt: doc.ingredients_pt || "",
            ingredients_it: doc.ingredients_it || "",
          };
        });
        
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching data from Appwrite", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductName = (p: Product) => language === "it" && p.name_it ? p.name_it : p.name_pt;
  const getProductDesc = (p: Product) => language === "it" && p.description_it ? p.description_it : p.description_pt;
  const getProductDetails = (p: Product) => language === "it" && p.details_it ? p.details_it : p.details_pt;
  const getProductIngredients = (p: Product) => language === "it" && p.ingredients_it ? p.ingredients_it : p.ingredients_pt;

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
      name: getProductName(product),
      price: product.price,
      weight_kg: product.weight_kg ?? 0.5,
      image: product.image,
      category: product.category,
      description: "",
      size: size
    });
  };

  const filteredProducts = activeTab === "todos"
    ? products
    : products.filter(p => p.category === activeTab);

  return (
    <section className="py-24 bg-white" id="products-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
          <div className="max-w-2xl">
            <span className="text-dourado-suave font-sans-premium text-xs tracking-[0.3em] uppercase font-bold mb-4 block">
              {(language === "it" && customTitleIt) ? customTitleIt : (customTitle || t.colecao_modelo)}
            </span>
            <h2 className="font-serif-premium text-3xl sm:text-4xl tracking-wide text-neutral-900 font-light">
              {(language === "it" && customSubtitleIt) ? customSubtitleIt : (customSubtitle || t.selecao_pensada)}
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-neutral-900/5 pb-2">
            <button
              onClick={() => setActiveTab("todos")}
              className={`font-sans-premium text-[10px] sm:text-xs tracking-[0.2em] uppercase py-2 px-3 transition-colors duration-300 font-medium relative ${
                activeTab === "todos" ? "text-dourado-suave" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {t.todos}
              {activeTab === "todos" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-dourado-suave"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            {categories.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`font-sans-premium text-[10px] sm:text-xs tracking-[0.2em] uppercase py-2 px-3 transition-colors duration-300 font-medium relative ${
                  activeTab === tab.value ? "text-dourado-suave" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {language === "it" && tab.label_it ? tab.label_it : tab.label}
                {activeTab === tab.value && (
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
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-dourado-suave" size={32} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 font-sans-premium tracking-wide">{t.nenhum_produto}</p>
          </div>
        ) : (
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
                <img
                  src={product.image}
                  alt={getProductName(product)}
                  className="w-full h-full object-cover zoom-image mix-blend-multiply"
                  loading="lazy"
                />

                {/* Details Floating Badge (Volume or Active Ingredient) */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
                  {product.inStock === false && (
                    <span className="bg-red-500/90 backdrop-blur-sm text-[9px] font-sans-premium tracking-widest text-white uppercase px-2.5 py-1 rounded-full font-bold">
                      {t.esgotado}
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
                      <span>{t.esgotado}</span>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>{t.adicionar_sacola}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info Description */}
              <div className="text-center px-1">
                <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">
                  {categories.find((c) => c.value === product.category)?.label || product.category}
                </span>
                
                <h3 className="font-serif-premium text-lg sm:text-xl text-neutral-900 font-light tracking-wide hover:text-dourado-suave transition-colors duration-300 cursor-pointer" onClick={() => setSelectedProductDetails(product)}>
                  {getProductName(product)}
                </h3>
                
                <p className="font-sans-premium text-[10px] text-neutral-500 tracking-wider font-light mt-1.5 mb-2.5">
                  {getProductDesc(product)}
                </p>

                <p className="font-sans-premium text-sm font-semibold tracking-widest text-neutral-900">
                  € {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        )}
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
              className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh] z-10 border border-dourado-suave/10"
            >
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md text-neutral-900 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Panel */}
                <div className="relative aspect-[3/4] bg-[#F1E7E2]">
                  <img
                    src={selectedProductDetails.image}
                    alt={getProductName(selectedProductDetails)}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>

                {/* Details Panel */}
                <div className="p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="font-sans-premium text-[10px] tracking-[0.25em] text-dourado-suave font-semibold uppercase block mb-2">
                      {categories.find((c) => c.value === selectedProductDetails.category)?.label || selectedProductDetails.category}
                    </span>
                    <h3 className="font-serif-premium text-2xl sm:text-3xl text-neutral-900 tracking-wide font-light mb-4">
                      {getProductName(selectedProductDetails)}
                    </h3>
                    <p className="font-sans-premium text-base font-semibold tracking-wider text-neutral-900 mb-6 border-b border-neutral-100 pb-4">
                      € {selectedProductDetails.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      <p className="font-sans-premium text-xs text-neutral-600 leading-relaxed font-light tracking-wide">
                        {getProductDetails(selectedProductDetails)}
                      </p>
                    </div>

                    {getProductIngredients(selectedProductDetails) && (
                      <div className="mb-6 bg-[#F1E7E2]/30 p-4 rounded-xl border border-dourado-suave/10">
                        <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-2 font-semibold">
                          {language === "it" ? "Ingredienti" : "Ingredientes"}
                        </span>
                        <p className="font-sans-premium text-[11px] text-neutral-600 leading-relaxed font-light tracking-wide">
                          {getProductIngredients(selectedProductDetails)}
                        </p>
                      </div>
                    )}

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
                        <span>{t.esgotado}</span>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>{t.adicionar_sacola}</span>
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
