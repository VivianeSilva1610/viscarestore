"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2 } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartTotalWeight,
    cartCount,
  } = useCart();
  const { user, profile } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingCountry, setShippingCountry] = useState<"BR" | "IT" | "">("");
  const [shippingMethod, setShippingMethod] = useState<"PAC" | "SEDEX" | "POSTE" | "">("");

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customerEmail: user?.email || "",
          customerName: profile?.name || "",
          customerProfile: profile, // Pass profile to check address
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout: " + (data.error || "Tente novamente."));
        setIsCheckingOut(false);
      }
    } catch (error) {
      alert("Erro de conexão ao processar o checkout.");
      setIsCheckingOut(false);
    }
  };

  // Premium feature: Free shipping for orders above € 1500
  const freeShippingThreshold = 1500;
  const progressToFreeShipping = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - cartTotal;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-neutral-950/30 backdrop-blur-sm"
          />

          {/* Slider Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-[#F1E7E2] shadow-2xl flex flex-col border-l border-dourado-suave/10"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-dourado-suave/10 flex items-center justify-between bg-white/40">
                <div className="flex items-center space-x-3">
                  <ShoppingBag size={20} className="text-neutral-800" />
                  <h2 className="font-serif-premium text-xl tracking-wider text-neutral-900 font-light">
                    Sua Sacola ({cartCount})
                  </h2>
                </div>
                
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-neutral-500 hover:text-neutral-900 p-2 transition-colors duration-300"
                  aria-label="Fechar carrinho"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress Bar (Luxury Detail) */}
              {cart.length > 0 && (
                <div className="bg-white/60 px-6 py-4 border-b border-dourado-suave/5">
                  <p className="font-sans-premium text-[10px] tracking-wide text-neutral-600 mb-2">
                    {cartTotal >= freeShippingThreshold ? (
                      <span className="text-dourado-suave font-semibold">
                        Parabéns! Você garantiu Frete Cortesia de Luxo.
                      </span>
                    ) : (
                      <span>
                        Faltam <span className="font-semibold text-neutral-800">€ {remainingForFreeShipping.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> para desbloquear o <span className="text-dourado-suave">Frete Cortesia</span>.
                      </span>
                    )}
                  </p>
                  <div className="w-full bg-neutral-200 h-[3px] rounded-full overflow-hidden">
                    <div
                      className="bg-dourado-suave h-full transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="p-5 rounded-full bg-[#E7D8D0]/50 text-neutral-400">
                      <ShoppingBag size={36} strokeWidth={1} />
                    </div>
                    <div>
                      <p className="font-serif-premium text-lg text-neutral-800 italic">
                        Sua sacola está vazia.
                      </p>
                      <p className="font-sans-premium text-xs text-neutral-500 mt-2 max-w-[240px] leading-relaxed">
                        Navegue por nossas curadorias de luxo e adicione fórmulas ou tecidos à sua sacola.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 border border-dourado-suave hover:bg-neutral-900 hover:text-white text-dourado-suave font-sans-premium text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300 rounded-lg"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size || "nosize"}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="flex space-x-4 bg-white/40 p-4 rounded-xl border border-white/20 shadow-sm"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-24 bg-[#F1E7E2] rounded-lg overflow-hidden flex-shrink-0 border border-neutral-900/5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </div>

                      {/* Info Panel */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif-premium text-sm text-neutral-900 leading-snug tracking-wide font-medium">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-neutral-400 hover:text-red-500 p-1 transition-colors duration-300 ml-2"
                              aria-label="Remover item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="font-sans-premium text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
                            {item.category} {item.size && `• Tamanho ${item.size}`}
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          {/* Quantity selector */}
                          <div className="flex items-center space-x-1.5 bg-white/80 rounded-lg p-1 border border-neutral-900/5 shadow-inner">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                              className="w-5 h-5 rounded flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="font-sans-premium text-xs font-semibold text-neutral-800 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                              className="w-5 h-5 rounded flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <p className="font-sans-premium text-xs font-semibold tracking-wider text-neutral-900">
                            € {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Checkout Panel Footer */}
              {cart.length > 0 && (() => {
                
                const getPosteItalianeRateEUR = (weight: number) => {
                  if (weight <= 1) return 32.80;
                  if (weight <= 3) return 40.35;
                  if (weight <= 5) return 64.00;
                  if (weight <= 10) return 84.40;
                  if (weight <= 15) return 109.15;
                  return 132.25;
                };

                // No conversion needed since store is in Euro

                let shippingCost = 0;
                let shippingName = "A calcular";

                if (shippingCountry === "BR") {
                  if (shippingMethod === "PAC") {
                    shippingCost = cartTotal >= freeShippingThreshold ? 0 : 25.00;
                    shippingName = "Correios PAC";
                  } else if (shippingMethod === "SEDEX") {
                    shippingCost = 45.00;
                    shippingName = "Correios SEDEX";
                  } else if (shippingMethod === "POSTE") {
                    shippingCost = getPosteItalianeRateEUR(cartTotalWeight);
                    shippingName = "Poste Italiane (Internacional)";
                  }
                } else if (shippingCountry === "IT") {
                  shippingCost = 10.00; // €10 fixed for Italy
                  shippingName = "Poste Italiane (Local)";
                }

                const finalTotal = cartTotal + shippingCost;

                return (
                  <div className="px-6 py-6 border-t border-dourado-suave/10 bg-white/50 space-y-4">
                    
                    {/* Shipping Calculator UI */}
                    <div className="bg-[#F8F5F2] p-4 rounded-xl border border-dourado-suave/20 space-y-3">
                      <h4 className="font-sans-premium text-[10px] tracking-widest text-neutral-800 uppercase font-bold">
                        Calcule seu Frete
                      </h4>
                      <p className="font-sans-premium text-[9px] text-neutral-500">
                        Peso total: <span className="font-semibold text-neutral-700">{cartTotalWeight.toFixed(2)} kg</span>
                      </p>
                      
                      <select 
                        className="w-full text-xs font-sans-premium p-2 rounded-lg border border-neutral-200 focus:border-dourado-suave focus:outline-none"
                        value={shippingCountry}
                        onChange={(e) => {
                          setShippingCountry(e.target.value as any);
                          setShippingMethod("");
                        }}
                      >
                        <option value="">Selecione o País de Destino...</option>
                        <option value="BR">Brasil 🇧🇷</option>
                        <option value="IT">Itália 🇮🇹</option>
                      </select>

                      {shippingCountry === "BR" && (
                        <select 
                          className="w-full text-xs font-sans-premium p-2 rounded-lg border border-neutral-200 focus:border-dourado-suave focus:outline-none"
                          value={shippingMethod}
                          onChange={(e) => setShippingMethod(e.target.value as any)}
                        >
                          <option value="">Selecione o método de envio...</option>
                          <option value="PAC">Correios PAC (Nacional)</option>
                          <option value="SEDEX">Correios SEDEX (Nacional)</option>
                          <option value="POSTE">Poste Italiane (Internacional &rarr; Brasil)</option>
                        </select>
                      )}
                    </div>

                    <div className="flex justify-between font-sans-premium text-xs tracking-wider uppercase text-neutral-600 pt-2">
                      <span>Subtotal</span>
                      <span className="text-neutral-900 font-semibold">
                        € {cartTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between font-sans-premium text-xs tracking-wider uppercase text-neutral-600">
                      <span>Frete</span>
                      <span className="text-dourado-suave font-semibold text-[10px] text-right">
                        {shippingCost === 0 && shippingMethod ? "GRATUITO" : shippingCost > 0 ? `€ ${shippingCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "A calcular"}
                        {shippingMethod === "POSTE" && <span className="block text-[8px] text-neutral-400 normal-case mt-0.5">(Aprox. €{getPosteItalianeRateEUR(cartTotalWeight).toFixed(2)})</span>}
                      </span>
                    </div>

                    <div className="border-t border-dashed border-dourado-suave/10 pt-4 flex justify-between font-serif-premium text-lg tracking-wide text-neutral-900">
                      <span>Total Estimado</span>
                      <span className="font-sans-premium text-base font-bold">
                        € {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <p className="font-sans-premium text-[9px] text-neutral-400 leading-relaxed text-center tracking-wide">
                      Transação de alta segurança • Embalagem exclusiva de presente VisCaree inclusa.
                    </p>

                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut || (!shippingCountry)}
                      className="w-full py-4 bg-neutral-900 text-white font-sans-premium text-xs tracking-[0.25em] uppercase hover:bg-dourado-suave disabled:opacity-70 disabled:hover:bg-neutral-900 font-semibold transition-colors duration-300 rounded-xl shadow-lg flex items-center justify-center space-x-2"
                    >
                      {isCheckingOut ? (
                        <><Loader2 size={16} className="animate-spin" /> <span>Processando...</span></>
                      ) : (
                        <span>{!shippingCountry ? "Calcule o Frete para Finalizar" : "Finalizar Pedido"}</span>
                      )}
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
