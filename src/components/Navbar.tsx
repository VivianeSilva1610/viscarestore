"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Search, User, Menu, X, LogOut, ChevronDown, Globe, Truck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { dictionary } from "../locales/dictionary";

export default function Navbar() {
  const { setIsCartOpen, cartCount } = useCart();
  const { isLoggedIn, profile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = dictionary[language].nav;

  const navLinks = [
    { name: t.novidades, href: "/#products-section", categoryId: "todos" },
    { name: t.perfumes, href: "/?category=perfumes#products-section", categoryId: "perfumes" },
    { name: t.skincare, href: "/?category=skincare#products-section", categoryId: "skincare" },
    { name: t.vestidos, href: "/?category=moda#products-section", categoryId: "moda" },
    { name: t.acessorios, href: "/?category=acessorios#products-section", categoryId: "acessorios" },
    { name: language === "pt" ? "VÍDEOS" : "VIDEO", href: "/videos" },
    { name: t.rotina_skincare, href: "https://viscare.vercel.app/", external: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    if (link.external || !link.categoryId) return;
    
    if (window.location.pathname === "/" || window.location.pathname === "") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('changeCategory', { detail: link.categoryId }));
      setIsMobileMenuOpen(false);
      
      setTimeout(() => {
        const section = document.getElementById('products-section');
        if (section) {
          const yOffset = -80; 
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "glass-nav py-3 shadow-sm"
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Desktop Menu - Left Side */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 3).map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={(e) => handleNavClick(e, link)}
                  className="font-sans-premium text-xs tracking-[0.2em] text-neutral-800 hover:text-dourado-suave uppercase transition-colors duration-300 font-medium"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button - Left Side */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-800 hover:text-dourado-suave p-2 transition-colors duration-300"
                aria-label="Menu principal"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Logo - Centered */}
            <div className="flex-1 lg:flex-none text-center">
              <a
                href="/"
                className="font-serif-premium text-3xl sm:text-4xl md:text-5xl tracking-[0.25em] text-neutral-900 hover:text-dourado-suave transition-colors duration-500 font-normal italic inline-block"
              >
                VisCaree
              </a>
            </div>

            {/* Desktop Menu - Right Side Links (Complement) */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(3).map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`font-sans-premium text-xs tracking-[0.2em] uppercase transition-colors duration-300 font-medium ${
                    link.external
                      ? "text-dourado-suave border-b border-dourado-suave/20 hover:border-dourado-suave pb-0.5"
                      : "text-neutral-800 hover:text-dourado-suave"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Icons Actions - Right Side */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Language Switcher */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1 text-neutral-800 hover:text-dourado-suave p-1.5 transition-colors duration-300"
                  aria-label="Idioma"
                >
                  <Globe size={18} strokeWidth={1.5} />
                  <span className="text-xs font-semibold uppercase">{language}</span>
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-32 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50 overflow-hidden">
                    <button
                      onClick={() => { setLanguage("pt"); setIsLangMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === "pt" ? "text-dourado-suave font-bold bg-[#F1E7E2]" : "text-neutral-700 hover:bg-neutral-50"}`}
                    >
                      🇧🇷 PT-BR
                    </button>
                    <button
                      onClick={() => { setLanguage("it"); setIsLangMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === "it" ? "text-dourado-suave font-bold bg-[#F1E7E2]" : "text-neutral-700 hover:bg-neutral-50"}`}
                    >
                      🇮🇹 IT
                    </button>
                  </div>
                )}
              </div>

              <button
                className="text-neutral-800 hover:text-dourado-suave p-1.5 transition-colors duration-300"
                aria-label="Buscar"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>

              <a
                href="/rastreio"
                className="text-neutral-800 hover:text-dourado-suave p-1.5 transition-colors duration-300"
                aria-label={language === "it" ? "Traccia ordine" : "Rastrear pedido"}
              >
                <Truck size={19} strokeWidth={1.5} />
              </a>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 text-neutral-800 hover:text-dourado-suave p-1.5 transition-colors duration-300 hidden sm:flex"
                  aria-label="Minha conta"
                >
                  <User size={19} strokeWidth={1.5} />
                  {isLoggedIn && <ChevronDown size={12} strokeWidth={2} className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />}
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 overflow-hidden">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-neutral-50">
                          <p className="text-xs text-neutral-400 font-light">{t.bem_vinda}</p>
                          <p className="text-sm font-semibold text-neutral-800 truncate">{profile?.name}</p>
                        </div>
                        <a href="/conta/perfil"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-[#F1E7E2] hover:text-[#C8A97E] transition-colors">
                          <User size={15} strokeWidth={1.5} />
                          {t.meu_perfil}
                        </a>
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <LogOut size={15} strokeWidth={1.5} />
                          {t.sair}
                        </button>
                      </>
                    ) : (
                      <>
                        <a href="/conta"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-[#F1E7E2] hover:text-[#C8A97E] transition-colors font-medium">
                          <User size={15} strokeWidth={1.5} />
                          {t.entrar}
                        </a>
                        <a href="/conta"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-500 hover:bg-[#F1E7E2] hover:text-[#C8A97E] transition-colors">
                          {t.criar_conta}
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="text-neutral-800 hover:text-dourado-suave p-1.5 transition-colors duration-300 relative"
                aria-label="Ver sacola"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-dourado-suave text-white font-sans-premium text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div
          className={`absolute top-0 left-0 w-4/5 max-w-sm h-full bg-[#F1E7E2] shadow-2xl flex flex-col justify-between p-8 transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-dourado-suave/10 pb-6">
              <span className="font-serif-premium text-xl tracking-[0.2em] text-neutral-900 italic">
                VisCaree
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-800 hover:text-dourado-suave transition-colors"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!link.categoryId && !link.external) setIsMobileMenuOpen(false);
                    handleNavClick(e, link);
                  }}
                  className={`font-sans-premium text-sm tracking-[0.2em] uppercase font-medium border-b border-neutral-900/5 pb-2 inline-block transition-all duration-300 ${
                    link.external
                      ? "text-dourado-suave font-semibold"
                      : "text-neutral-800 hover:text-dourado-suave"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="border-t border-dourado-suave/15 pt-6 space-y-4">
            <a
              href="/conta"
              className="flex items-center space-x-3 text-neutral-800 hover:text-dourado-suave font-sans-premium text-xs tracking-wider uppercase font-medium transition-colors"
            >
              <User size={18} strokeWidth={1.5} />
              <span>{t.minha_conta}</span>
            </a>
            <a
              href="/rastreio"
              className="flex items-center space-x-3 text-neutral-800 hover:text-dourado-suave font-sans-premium text-xs tracking-wider uppercase font-medium transition-colors"
            >
              <Truck size={18} strokeWidth={1.5} />
              <span>{language === "it" ? "Traccia ordine" : "Rastrear pedido"}</span>
            </a>
            <p className="text-[10px] text-neutral-500 font-sans-premium tracking-widest uppercase">
              Curadoria de Luxo VisCaree
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
