"use client";

import React, { useState, useEffect, useRef } from "react";
import { databases, storage, isAppwriteConfigured } from "../../../lib/appwrite";
import { ID, Query } from "appwrite";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Search,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

const DB_ID = "6a390e430024feb8df57";
const COLLECTION_ID = "products";
const BUCKET_ID = "6a391020001d02651b57";
const CATEGORIES_COL_ID = "categories";

interface Product {
  $id: string;
  name_pt: string;
  name_it: string;
  description_pt: string;
  description_it: string;
  price: number;
  weight_kg: number;
  category: string;
  image_id?: string;
  in_stock: boolean;
  featured: boolean;
  sizes?: string;
  ingredients_pt?: string;
  ingredients_it?: string;
  stock_quantity: number;
  status: string;
  cost_price: number;
  additional_costs: number;
}

const emptyProduct: Omit<Product, "$id"> = {
  name_pt: "",
  name_it: "",
  description_pt: "",
  description_it: "",
  price: 0,
  weight_kg: 0.5,
  category: "perfumes",
  image_id: "",
  in_stock: true,
  featured: false,
  sizes: "",
  ingredients_pt: "",
  ingredients_it: "",
  stock_quantity: 0,
  status: "published",
  cost_price: 0,
  additional_costs: 0,
};

// Categories will be fetched from Appwrite
interface Category {
  $id: string;
  label: string;
  value: string;
}

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  type FormState = Omit<Product, "$id" | "price" | "weight_kg" | "cost_price"> & {
    price: string | number;
    weight_kg: string | number;
    cost_price: string | number;
  };

  const [form, setForm] = useState<FormState>(emptyProduct);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const configured = isAppwriteConfigured();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProducts = async () => {
    if (!configured) { setIsLoading(false); return; }
    try {
      // Fetch both products and categories in parallel
      const [productsRes, categoriesRes] = await Promise.all([
        databases.listDocuments(DB_ID, COLLECTION_ID, [
          Query.equal("status", "published"),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]),
        databases.listDocuments(DB_ID, CATEGORIES_COL_ID, [
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ])
      ]);
      setProducts(productsRes.documents as unknown as Product[]);
      setCategories(categoriesRes.documents as unknown as Category[]);
    } catch {
      showToast("error", "Erro ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getImageUrl = (imageId?: string) => {
    return `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${imageId}/view?project=viscareelojavirtual1610`;
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name_pt: product.name_pt,
      name_it: product.name_it,
      description_pt: product.description_pt,
      description_it: product.description_it,
      price: product.price,
      weight_kg: product.weight_kg ?? 0.5,
      category: product.category,
      image_id: product.image_id,
      in_stock: product.in_stock,
      featured: product.featured,
      sizes: product.sizes,
      ingredients_pt: product.ingredients_pt || "",
      ingredients_it: product.ingredients_it || "",
      stock_quantity: product.stock_quantity ?? 0,
      status: product.status || "published",
      cost_price: product.cost_price || 0,
      additional_costs: product.additional_costs || 0,
    });
    setImageFile(null);
    setImagePreview(product.image_id ? getImageUrl(product.image_id) : null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageId = form.image_id;

      // Upload image if new one selected
      if (imageFile && configured) {
        const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
        // Delete old image if editing
        if (editingProduct?.image_id) {
          await storage.deleteFile(BUCKET_ID, editingProduct.image_id).catch(() => {});
        }
        imageId = uploaded.$id;
      }

      const parseVal = (v: string | number) => typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v);
      const parsedPrice = parseVal(form.price);
      const parsedWeight = parseVal(form.weight_kg);
      const parsedCost = parseVal(form.cost_price);
      const parsedStock = parseInt(form.stock_quantity as any, 10) || 0;

      const data = { 
        ...form, 
        image_id: imageId, 
        price: isNaN(parsedPrice) ? 0 : parsedPrice, 
        weight_kg: isNaN(parsedWeight) ? 0.5 : parsedWeight,
        cost_price: isNaN(parsedCost) ? 0 : parsedCost,
        stock_quantity: parsedStock,
        in_stock: parsedStock > 0
      };

      if (editingProduct) {
        await databases.updateDocument(DB_ID, COLLECTION_ID, editingProduct.$id, data);
        showToast("success", "Produto atualizado com sucesso!");
      } else {
        await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), data);
        showToast("success", "Produto criado com sucesso!");
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      showToast("error", `Erro ao salvar: ${error.message || "Verifique o Appwrite"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Tem certeza que deseja excluir "${product.name_pt}"?`)) return;
    try {
      await databases.deleteDocument(DB_ID, COLLECTION_ID, product.$id);
      if (product.image_id) {
        await storage.deleteFile(BUCKET_ID, product.image_id).catch(() => {});
      }
      showToast("success", "Produto excluído.");
      fetchProducts();
    } catch {
      showToast("error", "Erro ao excluir produto.");
    }
  };

  const handleMoveToEstoque = async (product: Product) => {
    if (!confirm(`Mover "${product.name_pt}" para o Estoque? Ele não aparecerá mais no site.`)) return;
    try {
      await databases.updateDocument(DB_ID, COLLECTION_ID, product.$id, {
        status: "draft"
      });
      showToast("success", "Produto movido para o estoque.");
      fetchProducts();
    } catch {
      showToast("error", "Erro ao mover para o estoque.");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name_pt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide">Produtos</h1>
          <p className="text-neutral-500 text-sm mt-1">{products.length} produto(s) cadastrado(s)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white text-xs tracking-widest uppercase font-semibold rounded-xl hover:bg-[#C8A97E] transition-colors duration-300"
        >
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      {/* Appwrite Config Warning */}
      {!configured && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex gap-4">
          <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm mb-1">Configure o Appwrite para continuar</p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Crie um arquivo <code className="bg-amber-100 px-1 rounded">.env.local</code> na raiz do projeto com as suas credenciais do Appwrite Cloud.
              Veja as instruções na parte inferior da página.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm bg-white border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3 text-sm text-neutral-700 rounded-xl transition-colors"
        />
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24">
          <Package size={48} className="text-neutral-300 mx-auto mb-4" strokeWidth={1} />
          <p className="text-neutral-400 font-medium">Nenhum produto encontrado</p>
          <p className="text-neutral-400 text-sm mt-1">Clique em &ldquo;Novo Produto&rdquo; para começar</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-6 py-4 w-16">Imagem</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4">Nome (PT)</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4 hidden md:table-cell">Categoria</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4">Preço</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4 hidden sm:table-cell">Status</th>
                <th className="text-right text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const imgUrl = getImageUrl(product.image_id);
                return (
                  <tr key={product.$id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F1E7E2] flex items-center justify-center">
                        {imgUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgUrl} alt={product.name_pt} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={18} className="text-neutral-300" strokeWidth={1} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-sm text-neutral-800">{product.name_pt}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 italic">{product.name_it}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="px-3 py-1 bg-[#F1E7E2] text-[#C8A97E] text-[10px] font-semibold rounded-full uppercase tracking-wider">
                        {categories.find((c) => c.value === product.category)?.label || product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-neutral-800">
                        € {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span
                        className={`px-3 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wider ${
                          product.in_stock
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {product.in_stock ? "Em estoque" : "Sem estoque"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleMoveToEstoque(product)}
                          className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Mover para Estoque"
                        >
                          <Package size={15} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-neutral-400 hover:text-[#C8A97E] hover:bg-[#F1E7E2] rounded-lg transition-colors"
                          aria-label="Editar produto"
                        >
                          <Edit2 size={15} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Excluir produto"
                        >
                          <Trash2 size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Env Config Instructions */}
      <div className="mt-12 bg-neutral-900 text-white rounded-2xl p-8">
        <h3 className="text-[#C8A97E] font-semibold mb-4 tracking-wide">⚙️ Configuração do Appwrite (.env.local)</h3>
        <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
          Crie o arquivo <code className="text-[#C8A97E] bg-neutral-800 px-2 py-0.5 rounded">.env.local</code> na raiz do projeto com as seguintes variáveis:
        </p>
        <pre className="bg-neutral-800 rounded-xl p-5 text-xs text-neutral-300 overflow-x-auto leading-6">
{`NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=seu_project_id_aqui
NEXT_PUBLIC_APPWRITE_DATABASE_ID=seu_database_id_aqui
NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID=seu_collection_id_aqui
NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
NEXT_PUBLIC_APPWRITE_BUCKET_ID=seu_bucket_id_aqui`}
        </pre>
        <p className="text-neutral-500 text-xs mt-4">
          Encontre esses valores no console do Appwrite Cloud em{" "}
          <a href="https://cloud.appwrite.io" target="_blank" className="text-[#C8A97E] underline underline-offset-2 hover:opacity-80">
            cloud.appwrite.io
          </a>
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-800">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
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
              {/* Image Upload */}
              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-3">
                  Imagem do Produto
                </label>
                <div
                  className="relative w-full h-44 bg-[#F8F5F2] border-2 border-dashed border-neutral-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#C8A97E] transition-colors overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Prévia" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center space-y-2">
                      <Upload size={28} className="text-neutral-300 mx-auto" strokeWidth={1} />
                      <p className="text-neutral-400 text-xs">Clique para fazer upload</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Nome (Português) *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name_pt}
                    onChange={(e) => setForm({ ...form, name_pt: e.target.value })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                    placeholder="Nome em português"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Nome (Italiano) *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name_it}
                    onChange={(e) => setForm({ ...form, name_it: e.target.value })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                    placeholder="Nome in italiano"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Descrição (Português) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description_pt}
                    onChange={(e) => setForm({ ...form, description_pt: e.target.value })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors resize-none"
                    placeholder="Descrição em português..."
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Descrição (Italiano) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description_it}
                    onChange={(e) => setForm({ ...form, description_it: e.target.value })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors resize-none"
                    placeholder="Descrizione in italiano..."
                  />
                </div>
              </div>

              {/* Ingredients (optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Ingredientes (Português) <span className="text-neutral-400 normal-case">(opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.ingredients_pt}
                    onChange={(e) => setForm({ ...form, ingredients_pt: e.target.value })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors resize-none"
                    placeholder="Ingredientes..."
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Ingredientes (Italiano) <span className="text-neutral-400 normal-case">(opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.ingredients_it}
                    onChange={(e) => setForm({ ...form, ingredients_it: e.target.value })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors resize-none"
                    placeholder="Ingredienti..."
                  />
                </div>
              </div>


              {/* Price, Weight, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Preço (€) *
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^0-9.,]/g, '') })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Peso (Kg) *
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="decimal"
                    value={form.weight_kg}
                    onChange={(e) => setForm({ ...form, weight_kg: e.target.value.replace(/[^0-9.,]/g, '') })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                    placeholder="0.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Categoria *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors bg-white"
                  >
                      <option value="" disabled>Selecione uma categoria...</option>
                    {categories.map((c) => (
                      <option key={c.$id} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizes (optional) */}
              <div>
                <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                  Tamanhos disponíveis <span className="text-neutral-400 normal-case">(opcional — separados por vírgula: PP, P, M, G)</span>
                </label>
                <input
                  type="text"
                  value={form.sizes || ""}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="w-full border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors"
                  placeholder="Ex: PP, P, M, G, GG"
                />
              </div>

              {/* Toggles and Stock */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block mb-2">
                    Quantidade em Estoque *
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock_quantity}
                      onChange={(e) => setForm({ ...form, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="w-24 border border-neutral-200 focus:border-[#C8A97E] focus:outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl transition-colors text-center"
                    />
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${form.stock_quantity > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                      {form.stock_quantity > 0 ? "Em Estoque" : "Esgotado"}
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer mt-4 sm:mt-0">
                  <div
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-[#C8A97E]" : "bg-neutral-200"}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
                  </div>
                  <span className="text-sm text-neutral-700">Destaque</span>
                </label>
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
                  disabled={isSaving}
                  className="flex items-center gap-2 px-7 py-3 bg-neutral-900 hover:bg-[#C8A97E] disabled:opacity-60 text-white text-xs tracking-widest uppercase font-semibold rounded-xl transition-colors duration-300"
                >
                  {isSaving ? (
                    <><Loader2 size={14} className="animate-spin" /> A guardar...</>
                  ) : (
                    editingProduct ? "Salvar Alterações" : "Criar Produto"
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
