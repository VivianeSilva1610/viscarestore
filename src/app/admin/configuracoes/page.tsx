"use client";

import React, { useState, useEffect } from "react";
import { account } from "../../../lib/appwrite";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Activity,
  Database,
  CreditCard,
  Store,
  Save,
  Key,
  FileText,
} from "lucide-react";
import { databases, isAppwriteConfigured } from "../../../lib/appwrite";
import { ID, Query } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const PAGES_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_PAGES_COLLECTION_ID || "pages";

interface PageDoc {
  $id: string;
  slug: string;
  title: string;
  content: string;
}

interface Diagnostics {
  appwrite: {
    configured: boolean;
    endpoint: string;
    projectId: string;
    databaseId: string;
    bucketId: string;
  };
  stripe: {
    configured: boolean;
    hasPublishableKey: boolean;
    hasSecretKey: boolean;
    publishableKey: string;
  };
}

export default function AdminSettingsPage() {
  // Passwords State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Diagnostics State
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(true);

  // Local Store Info State
  const [storeName, setStoreName] = useState("VisCaree");
  const [contactEmail, setContactEmail] = useState("contato@viscaree.com.br");
  const [contactPhone, setContactPhone] = useState("(11) 99999-9999");
  const [freeShippingMin, setFreeShippingMin] = useState(1500);
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/viscaree");
  const [gridTitle, setGridTitle] = useState("");
  const [gridSubtitle, setGridSubtitle] = useState("");

  // Notifications State
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Institutional Pages State
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>("sobre-a-viscaree");
  const [pageTitle, setPageTitle] = useState("");
  const [pageTitleIt, setPageTitleIt] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pageContentIt, setPageContentIt] = useState("");
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(true);

  const availablePages = [
    { slug: "sobre-a-viscaree", title: "Sobre a VisCaree" },
    { slug: "nossa-missao", title: "Nossa Missão" },
    { slug: "politicas-de-frete", title: "Políticas de Frete" },
    { slug: "devolucoes-e-trocas", title: "Devoluções & Trocas" },
  ];

  // Fetch connectivity status and pages
  const fetchDiagnostics = async () => {
    try {
      const res = await fetch("/api/admin/check-config");
      if (res.ok) {
        const data = await res.json();
        setDiagnostics(data);
      }
    } catch {
      showToast("error", "Erro ao verificar diagnóstico do sistema.");
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  const fetchPages = async () => {
    if (!isAppwriteConfigured()) { setIsLoadingPages(false); return; }
    try {
      const res = await databases.listDocuments(DB_ID, PAGES_COL_ID, [Query.limit(100)]);
      setPages(res.documents as unknown as PageDoc[]);
    } catch {
      console.error("Erro ao carregar páginas.");
    } finally {
      setIsLoadingPages(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    fetchPages();
  }, []);

  // Use the fetched pages to populate the global settings
  useEffect(() => {
    const p = pages.find((page) => page.slug === selectedPageSlug) as any;
    setPageTitle(p ? p.title : availablePages.find(ap => ap.slug === selectedPageSlug)?.title || "");
    setPageTitleIt(p && p.title_it ? p.title_it : "");
    setPageContent(p ? p.content : "");
    setPageContentIt(p && p.content_it ? p.content_it : "");

    // Load global settings
    const settingsPage = pages.find((page) => page.slug === "global-settings");
    if (settingsPage) {
      try {
        const settings = JSON.parse(settingsPage.content);
        if (settings.storeName) setStoreName(settings.storeName);
        if (settings.contactEmail) setContactEmail(settings.contactEmail);
        if (settings.contactPhone) setContactPhone(settings.contactPhone);
        if (settings.freeShippingMin) setFreeShippingMin(Number(settings.freeShippingMin));
        if (settings.instagramUrl) setInstagramUrl(settings.instagramUrl);
        if (settings.gridTitle) setGridTitle(settings.gridTitle);
        if (settings.gridSubtitle) setGridSubtitle(settings.gridSubtitle);
      } catch (e) {
        console.error("Error parsing global settings", e);
      }
    }
  }, [selectedPageSlug, pages]);

  // Save general store settings
  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const settingsStr = JSON.stringify({
      storeName, contactEmail, contactPhone, freeShippingMin, instagramUrl, gridTitle, gridSubtitle
    });
    
    try {
      const existingPage = pages.find((p) => p.slug === "global-settings");
      if (existingPage) {
        await databases.updateDocument(DB_ID, PAGES_COL_ID, existingPage.$id, { content: settingsStr });
      } else {
        await databases.createDocument(DB_ID, PAGES_COL_ID, ID.unique(), {
          slug: "global-settings",
          title: "Global Settings",
          content: settingsStr
        });
      }
      showToast("success", "Configurações da loja salvas com sucesso!");
      fetchPages(); // refresh
    } catch (err) {
      showToast("error", "Erro ao salvar as configurações.");
    }
  };

  // Update password in Appwrite
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("error", "A nova senha e a confirmação não coincidem.");
      return;
    }
    if (newPassword.length < 8) {
      showToast("error", "A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await account.updatePassword(newPassword, oldPassword);
      showToast("success", "Senha atualizada com sucesso!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast("error", err.message || "Erro ao atualizar senha. Verifique a senha atual.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Save Institutional Page
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAppwriteConfigured()) return showToast("error", "Appwrite não configurado.");
    
    setIsSavingPage(true);
    const existingPage = pages.find((p) => p.slug === selectedPageSlug);
    const title = pageTitle || availablePages.find((p) => p.slug === selectedPageSlug)?.title || "Página";

    try {
      if (existingPage) {
        await databases.updateDocument(DB_ID, PAGES_COL_ID, existingPage.$id, { 
          title,
          content: pageContent,
          title_it: pageTitleIt,
          content_it: pageContentIt
        });
      } else {
        await databases.createDocument(DB_ID, PAGES_COL_ID, ID.unique(), {
          slug: selectedPageSlug,
          title,
          content: pageContent,
          title_it: pageTitleIt,
          content_it: pageContentIt
        });
      }
      showToast("success", "Página salva com sucesso!");
      fetchPages();
    } catch (err) {
      showToast("error", "Erro ao salvar a página.");
      console.error(err);
    } finally {
      setIsSavingPage(false);
    }
  };

  return (
    <div className="p-8 min-h-full max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
              : "bg-red-900 text-red-300 border border-red-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide font-serif">Configurações</h1>
        <p className="text-neutral-500 text-sm mt-1">Gerencie a segurança da sua conta, conexões com APIs e informações da loja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Forms */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Card 1: Store Information */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50">
              <Store size={18} className="text-neutral-600" />
              <h2 className="text-sm font-semibold text-neutral-800 tracking-wider uppercase">Informações Gerais da Loja</h2>
            </div>
            
            <form onSubmit={handleSaveStoreSettings} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Nome da Loja
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    E-mail de Contato
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    WhatsApp de Suporte
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Frete Grátis a partir de (€)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={freeShippingMin}
                    onChange={(e) => setFreeShippingMin(Number(e.target.value))}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                  Instagram da Loja (URL)
                </label>
                <input
                  type="url"
                  required
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  placeholder="https://instagram.com/sualoja"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Título da Coleção na Home (ex: Coleção Modelo)
                  </label>
                  <input
                    type="text"
                    value={gridTitle}
                    onChange={(e) => setGridTitle(e.target.value)}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                    placeholder="Deixe em branco para o padrão"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Subtítulo da Coleção na Home
                  </label>
                  <input
                    type="text"
                    value={gridSubtitle}
                    onChange={(e) => setGridSubtitle(e.target.value)}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                    placeholder="Deixe em branco para o padrão"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-neutral-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-[#C8A97E] text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300"
                >
                  <Save size={14} />
                  Salvar Informações
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Security & Password Update */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50">
              <Lock size={18} className="text-neutral-600" />
              <h2 className="text-sm font-semibold text-neutral-800 tracking-wider uppercase">Alterar Senha do Administrador</h2>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                  Senha Atual *
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Nova Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo de 8 caracteres"
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-50 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300"
                >
                  {isUpdatingPassword ? (
                    <><Loader2 size={14} className="animate-spin" /> Atualizando...</>
                  ) : (
                    <>
                      <Key size={14} />
                      Atualizar Senha
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card 3: Institutional Pages Editor */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50">
              <FileText size={18} className="text-neutral-600" />
              <h2 className="text-sm font-semibold text-neutral-800 tracking-wider uppercase">Páginas Institucionais (Rodapé)</h2>
            </div>

            <form onSubmit={handleSavePage} className="p-6 space-y-5">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                  Selecione a Página para Editar
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {availablePages.map((page) => (
                    <button
                      key={page.slug}
                      type="button"
                      onClick={() => setSelectedPageSlug(page.slug)}
                      className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        selectedPageSlug === page.slug
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {page.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Título da Página (PT)
                  </label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Título da Página (IT)
                  </label>
                  <input
                    type="text"
                    value={pageTitleIt}
                    onChange={(e) => setPageTitleIt(e.target.value)}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Conteúdo da Página (PT)
                  </label>
                  {isLoadingPages ? (
                    <div className="w-full h-64 border border-neutral-200 rounded-xl flex items-center justify-center bg-neutral-50">
                      <Loader2 size={24} className="animate-spin text-neutral-300" />
                    </div>
                  ) : (
                    <textarea
                      value={pageContent}
                      onChange={(e) => setPageContent(e.target.value)}
                      rows={12}
                      className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors resize-y bg-white"
                      placeholder="Conteúdo em Português..."
                    />
                  )}
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Conteúdo da Página (IT)
                  </label>
                  {isLoadingPages ? (
                    <div className="w-full h-64 border border-neutral-200 rounded-xl flex items-center justify-center bg-neutral-50">
                      <Loader2 size={24} className="animate-spin text-neutral-300" />
                    </div>
                  ) : (
                    <textarea
                      value={pageContentIt}
                      onChange={(e) => setPageContentIt(e.target.value)}
                      rows={12}
                      className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors resize-y bg-white"
                      placeholder="Contenuto in Italiano..."
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={isSavingPage || isLoadingPages}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C8A97E] hover:bg-[#b0946d] disabled:opacity-50 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300"
                >
                  {isSavingPage ? (
                    <><Loader2 size={14} className="animate-spin" /> Salvando...</>
                  ) : (
                    <>
                      <Save size={14} />
                      Salvar Página
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Side: Diagnostics Info */}
        <div className="space-y-8">
          
          {/* Card 3: System Diagnostics */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-neutral-600" />
                <h2 className="text-sm font-semibold text-neutral-800 tracking-wider uppercase">Diagnóstico</h2>
              </div>
              <button 
                onClick={() => { setIsLoadingDiagnostics(true); fetchDiagnostics(); }}
                className="text-[10px] font-semibold text-[#C8A97E] hover:underline"
              >
                Atualizar
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Appwrite Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 flex items-center gap-2">
                    <Database size={14} className="text-neutral-500" />
                    Appwrite Database
                  </span>
                  {isLoadingDiagnostics ? (
                    <Loader2 size={14} className="animate-spin text-neutral-400" />
                  ) : diagnostics?.appwrite.configured ? (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-full uppercase">Conectado</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-500 font-bold rounded-full uppercase">Desconectado</span>
                  )}
                </div>

                {!isLoadingDiagnostics && diagnostics?.appwrite.configured && (
                  <div className="bg-neutral-50 rounded-xl p-3 space-y-1.5 text-[10px] text-neutral-500 font-mono">
                    <p className="truncate"><span className="font-semibold text-neutral-700 font-sans">Project:</span> {diagnostics.appwrite.projectId}</p>
                    <p className="truncate"><span className="font-semibold text-neutral-700 font-sans">DB:</span> {diagnostics.appwrite.databaseId}</p>
                    <p className="truncate"><span className="font-semibold text-neutral-700 font-sans">Bucket:</span> {diagnostics.appwrite.bucketId}</p>
                  </div>
                )}
                
                {!isLoadingDiagnostics && !diagnostics?.appwrite.configured && (
                  <p className="text-[11px] text-neutral-400">Variáveis do Appwrite ausentes no arquivo .env.local.</p>
                )}
              </div>

              <hr className="border-neutral-100" />

              {/* Stripe Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 flex items-center gap-2">
                    <CreditCard size={14} className="text-neutral-500" />
                    Stripe Checkout
                  </span>
                  {isLoadingDiagnostics ? (
                    <Loader2 size={14} className="animate-spin text-neutral-400" />
                  ) : diagnostics?.stripe.configured ? (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-full uppercase">Ativo</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-500 font-bold rounded-full uppercase">Inativo</span>
                  )}
                </div>

                {!isLoadingDiagnostics && diagnostics?.stripe.configured && (
                  <div className="bg-neutral-50 rounded-xl p-3 space-y-1.5 text-[10px] text-neutral-500 font-mono">
                    <p className="truncate"><span className="font-semibold text-neutral-700 font-sans">Key:</span> {diagnostics.stripe.publishableKey}</p>
                    <p><span className="font-semibold text-neutral-700 font-sans">Secret Key:</span> Presente (Servidor)</p>
                  </div>
                )}

                {!isLoadingDiagnostics && !diagnostics?.stripe.configured && (
                  <p className="text-[11px] text-neutral-400">Verifique se as chaves públicas e secretas do Stripe estão no arquivo .env.local.</p>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
