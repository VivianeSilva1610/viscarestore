"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  weight_kg: number;
  image: string;
  quantity: number;
  size?: string;
  category: string;
  description?: string;
  delivery_days?: number;
  // Bloco 2 — unified source
  source?: "shopify" | "appwrite";
  shopifyVariantId?: string; // populated only when source === "shopify"
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartTotalWeight: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  /** "shopify" | "appwrite" | null (empty cart) */
  cartSource: "shopify" | "appwrite" | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("viscare_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("viscare_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const effectiveSource = newItem.source ?? "appwrite";

    // Bloco 4 — prevent mixed carts in v1
    if (cart.length > 0) {
      const existingSource = cart[0].source ?? "appwrite";
      if (existingSource !== effectiveSource) {
        const confirmed = window.confirm(
          effectiveSource === "shopify"
            ? "O seu carrinho tem produtos próprios VisCaree. Esvazie-o para adicionar produtos do catálogo Shopify?"
            : "O seu carrinho tem produtos do catálogo Shopify. Esvazie-o para adicionar produtos próprios VisCaree?"
        );
        if (!confirmed) return;
        setCart([{ ...newItem, source: effectiveSource, quantity: newItem.quantity ?? 1 }]);
        setIsCartOpen(true);
        return;
      }
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      const qtyToAdd = newItem.quantity ?? 1;

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qtyToAdd;
        return updated;
      }

      return [...prevCart, { ...newItem, source: effectiveSource, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartTotalWeight = cart.reduce(
    (total, item) => total + (item.weight_kg || 0.5) * item.quantity,
    0
  );
  const cartSource: "shopify" | "appwrite" | null =
    cart.length === 0 ? null : (cart[0].source ?? "appwrite") === "shopify" ? "shopify" : "appwrite";

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartTotalWeight,
        isCartOpen,
        setIsCartOpen,
        cartSource,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
