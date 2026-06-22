"use client";

import React from "react";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-[#F1E7E2] selection:bg-[#C8A97E] selection:text-white">
          
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            {/* Hero Banner Section */}
            <Hero />

            {/* Luxury Categories Grid Section */}
            <Categories />

            {/* Dynamic Interactive Product Grid */}
            <ProductGrid />
          </main>

          {/* Sliding Shopping Cart Panel */}
          <CartDrawer />

          {/* Footer Area */}
          <Footer />
          
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

