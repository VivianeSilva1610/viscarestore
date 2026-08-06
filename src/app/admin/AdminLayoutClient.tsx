"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "../../context/AdminAuthContext";
import PushNotificationManager from "./PushNotificationManager";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Store,
  ImageIcon,
  Tags,
  Users,
  MessageSquare,
  Mail,
  Calculator,
  Star,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Estoque", href: "/admin/estoque", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: Tags },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Mídia", href: "/admin/midia", icon: ImageIcon },
  { label: "Rastreamento", href: "/admin/rastreamento", icon: ShoppingBag },
  { label: "Avaliações", href: "/admin/avaliacoes", icon: Star },
  { label: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Custos", href: "/admin/custos", icon: Calculator },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { adminUser, logout } = useAdminAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 min-h-screen bg-neutral-900 text-white flex flex-col flex-shrink-0 transform transition-transform duration-300 overflow-y-auto lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-serif italic text-2xl tracking-widest text-[#C8A97E]">VisCaree</p>
            <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-1 font-light">Painel de Controle</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-neutral-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-[#C8A97E]/20 text-[#C8A97E] border border-[#C8A97E]/30"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4">
          <PushNotificationManager />
        </div>

        {/* User Info & Logout */}
        <div className="px-6 py-6 border-t border-white/10 space-y-4">
          <div>
            <p className="text-xs text-neutral-400 font-light">Logado como</p>
            <p className="text-sm text-white font-medium truncate">{adminUser?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <Store size={14} />
              Ver loja
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-red-400 transition-colors ml-auto"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { adminUser, isLoading } = useAdminAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu ao trocar de página (ex.: após navegar pelo próprio menu)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Allow the login page to render freely — no auth check needed there
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-neutral-400 text-sm">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#C8A97E] font-serif italic text-2xl mb-4">VisCaree</p>
          <p className="text-neutral-400 text-sm mb-6">Acesso restrito ao Administrador</p>
          <Link
            href="/admin/login"
            className="px-6 py-3 bg-[#C8A97E] text-white text-sm tracking-widest uppercase hover:bg-[#b8976b] transition-colors rounded-xl"
          >
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F5F2]">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white sticky top-0 z-30">
          <button onClick={() => setMenuOpen(true)} className="text-neutral-300 hover:text-white">
            <Menu size={22} />
          </button>
          <p className="font-serif italic text-lg tracking-widest text-[#C8A97E]">VisCaree</p>
        </header>
        <main className="flex-1 overflow-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}


export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
