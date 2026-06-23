"use client";

import React, { useState, useEffect } from "react";
import { databases, isAppwriteConfigured } from "../../../lib/appwrite";
import { ID, Query } from "appwrite";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Tags,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || "categories";

interface Category {
  $id: string;
  label: string;
  value: string;
  description?: string;
}

const emptyCategory: Omit<Category, "$id"> = {
  label: "",
  value: "",
  description: "",
};

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const configured = isAppwriteConfigured();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCategories = async () => {
    if (!configured) { setIsLoading(false); return; }
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]);
      setCategories(res.documents as unknown as Category[]);
    } catch {
      showToast("error", "Erro ao carregar categorias.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyCategory);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({
      label: category.label,
      value: category.value,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  // Helper to generate a slug (value) from label
  const generateSlug = (text: string) => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setForm({
      ...form,
      label: newLabel,
      // Auto-update value if creating a new category
      value: editingCategory ? form.value : generateSlug(newLabel)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingCategory) {
        await databases.updateDocument(DB_ID, COLLECTION_ID, editingCategory.$id, form);
        showToast("success", "Categoria atualizada com sucesso!");
      } else {
        await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), form);
        showToast("success", "Categoria criada com sucesso!");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      if (err.code === 409) {
          showToast("error", "Já existe uma categoria com este valor/slug.");
      } else {
          showToast("error", "Erro ao salvar categoria.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${category.label}"?`)) return;
    try {
      await databases.deleteDocument(DB_ID, COLLECTION_ID, category.$id);
      showToast("success", "Categoria excluída.");
      fetchCategories();
    } catch {
      showToast("error", "Erro ao excluir categoria.");
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 min-h-full">
      {/* Toast */}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide">Categorias</h1>
          <p className="text-neutral-500 text-sm mt-1">{categories.length} categoria(s) cadastrada(s)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white text-xs tracking-widest uppercase font-semibold rounded-xl hover:bg-[#C8A97E] transition-colors duration-300"
        >
          <Plus size={16} />
          Nova Categoria
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Pesquisar categorias..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm bg-white border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3 text-sm text-neutral-700 rounded-xl transition-colors"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <Tags size={48} className="text-neutral-300 mx-auto mb-4" strokeWidth={1} />
          <p className="text-neutral-400 font-medium">Nenhuma categoria encontrada</p>
          <p className="text-neutral-400 text-sm mt-1">Clique em &ldquo;Nova Categoria&rdquo; para começar</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-6 py-4 w-12">Ícone</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4">Nome da Categoria</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4 hidden md:table-cell">Identificador (Slug)</th>
                <th className="text-right text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.$id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <Tags size={16} className="text-neutral-400" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-sm text-neutral-800">{category.label}</p>
                    {category.description && (
                        <p className="text-xs text-neutral-400 mt-1 max-w-md truncate">{category.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-mono rounded">
                      {category.value}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 text-neutral-400 hover:text-[#C8A97E] hover:bg-[#F1E7E2] rounded-lg transition-colors"
                        aria-label="Editar categoria"
                      >
                        <Edit2 size={15} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Excluir categoria"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-800">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                aria-label="Fechar modal"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                  Nome da Categoria *
                </label>
                <input
                  required
                  type="text"
                  value={form.label}
                  onChange={handleLabelChange}
                  className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  placeholder="Ex: Alta Perfumaria"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                  Identificador Único (Slug) *
                </label>
                <input
                  required
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors bg-neutral-50"
                  placeholder="ex: alta-perfumaria"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Usado internamente. Ex: "alta-perfumaria"</p>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                  Descrição (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors resize-none"
                  placeholder="Uma breve descrição da categoria..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !form.label || !form.value}
                  className="flex items-center gap-2 px-7 py-3 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-60 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300"
                >
                  {isSaving ? (
                    <><Loader2 size={14} className="animate-spin" /> Salvando...</>
                  ) : (
                    editingCategory ? "Salvar Alterações" : "Criar Categoria"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
