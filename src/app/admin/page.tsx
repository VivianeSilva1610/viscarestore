"use client";

import React from "react";
import Link from "next/link";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Package, ShoppingBag, Tags, TrendingUp, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const { adminUser } = useAdminAuth();

  const stats = [
    { label: "Produtos", icon: Package, value: "—", sub: "Ver produtos", href: "/admin/produtos", color: "text-[#C8A97E]", bg: "bg-[#C8A97E]/10" },
    { label: "Rastreamento", icon: ShoppingBag, value: "—", sub: "Ver rastreamentos", href: "/admin/rastreamento", color: "text-blue-400", bg: "bg-blue-50" },
    { label: "Categorias", icon: Tags, value: "4", sub: "Gerenciar", href: "/admin/categorias", color: "text-violet-400", bg: "bg-violet-50" },
    { label: "Receita (mês)", icon: TrendingUp, value: "—", sub: "Em breve", href: "#", color: "text-emerald-400", bg: "bg-emerald-50" },
  ];

  const quickLinks = [
    { label: "Adicionar novo produto", href: "/admin/produtos", desc: "Cadastre um produto com fotos, descrição em PT e IT e preço" },
    { label: "Gerenciar categorias", href: "/admin/categorias", desc: "Alta Perfumaria, Skincare, Vestidos e Acessórios" },
    { label: "Configurações do site", href: "/admin/configuracoes", desc: "Ajuste o banner, textos e informações da marca" },
  ];

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="mb-10">
        <p className="text-neutral-400 text-sm mb-1">Bem-vindo(a) de volta,</p>
        <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide">
          {adminUser?.name || adminUser?.email?.split("@")[0] || "Administradora"}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, icon: Icon, value, sub, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={20} className={color} strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-semibold text-neutral-800 mb-1">{value}</p>
            <p className="text-neutral-500 text-xs">{label}</p>
            <p className="text-[#C8A97E] text-xs font-medium mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {sub} <ArrowRight size={11} />
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-neutral-600 tracking-widest uppercase mb-5">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map(({ label, href, desc }) => (
            <Link
              key={label}
              href={href}
              className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:border-[#C8A97E]/40 hover:shadow-md transition-all duration-300 group"
            >
              <p className="font-medium text-neutral-800 text-sm mb-2 group-hover:text-[#C8A97E] transition-colors">{label}</p>
              <p className="text-neutral-400 text-xs leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 text-[#C8A97E] text-xs font-medium mt-4">
                Acessar <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-neutral-900 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#C8A97E]/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-[#C8A97E] text-lg">✦</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#C8A97E] mb-2 tracking-wide">Configuração Inicial — Appwrite Cloud</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Para ativar o gerenciamento de produtos, configure as credenciais do Appwrite no arquivo{" "}
              <code className="text-[#C8A97E] bg-neutral-800 px-2 py-0.5 rounded">.env.local</code> e crie a estrutura abaixo no Appwrite Cloud:
            </p>
            <ol className="space-y-2 text-sm text-neutral-400">
              <li><span className="text-[#C8A97E] font-semibold">1.</span> Acesse <a href="https://cloud.appwrite.io" target="_blank" className="text-[#C8A97E] underline">cloud.appwrite.io</a> e crie um Projeto</li>
              <li><span className="text-[#C8A97E] font-semibold">2.</span> Em <strong className="text-neutral-300">Databases</strong>, crie um Database e uma Collection chamada <code className="bg-neutral-800 px-1 rounded">products</code></li>
              <li><span className="text-[#C8A97E] font-semibold">3.</span> Adicione os atributos: <code className="bg-neutral-800 px-1 rounded text-xs">name_pt, name_it, description_pt, description_it, price, category, image_id, in_stock, featured, sizes</code></li>
              <li><span className="text-[#C8A97E] font-semibold">4.</span> Em <strong className="text-neutral-300">Storage</strong>, crie um Bucket chamado <code className="bg-neutral-800 px-1 rounded">product-images</code></li>
              <li><span className="text-[#C8A97E] font-semibold">5.</span> Em <strong className="text-neutral-300">Auth</strong>, crie seu usuário administrador</li>
              <li><span className="text-[#C8A97E] font-semibold">6.</span> Preencha o <code className="bg-neutral-800 px-1 rounded">.env.local</code> com os IDs obtidos e reinicie o servidor</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
