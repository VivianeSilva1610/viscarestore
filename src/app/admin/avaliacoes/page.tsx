"use client";

import React, { useState, useEffect } from "react";
import { databases, isAppwriteConfigured } from "../../../lib/appwrite";
import { Query } from "appwrite";
import { Star, Loader2, MessageSquare, CheckCircle2, Trash2, Search } from "lucide-react";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const REVIEWS_COL_ID = "reviews";

interface ReviewDoc {
  $id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  $createdAt: string;
}

export default function AdminAvaliacoesPage() {
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"pendente" | "aprovado">("pendente");

  const fetchReviews = async () => {
    if (!isAppwriteConfigured()) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await databases.listDocuments(DB_ID, REVIEWS_COL_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]);
      setReviews(res.documents as unknown as ReviewDoc[]);
    } catch (error) {
      console.error("Erro ao buscar avaliações", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateApproval = async (id: string, approved: boolean) => {
    try {
      await databases.updateDocument(DB_ID, REVIEWS_COL_ID, id, { approved });
      setReviews((prev) => prev.map((r) => (r.$id === id ? { ...r, approved } : r)));
    } catch (error) {
      console.error("Erro ao atualizar avaliação", error);
      alert("Erro ao atualizar a avaliação.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;
    try {
      await databases.deleteDocument(DB_ID, REVIEWS_COL_ID, id);
      setReviews((prev) => prev.filter((r) => r.$id !== id));
    } catch (error) {
      console.error("Erro ao excluir avaliação", error);
      alert("Erro ao excluir a avaliação.");
    }
  };

  const filteredReviews = reviews
    .filter((r) => (activeTab === "pendente" ? !r.approved : r.approved))
    .filter(
      (r) =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.productId.includes(searchTerm)
    );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide font-serif flex items-center gap-2">
            <MessageSquare size={24} className="text-[#C8A97E]" />
            Avaliações
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Modere os comentários enviados pelos clientes nas páginas de produto.
          </p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar avaliação ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A97E] w-full sm:w-64"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("pendente")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "pendente" ? "border-[#C8A97E] text-[#C8A97E]" : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Pendentes ({reviews.filter((r) => !r.approved).length})
        </button>
        <button
          onClick={() => setActiveTab("aprovado")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "aprovado" ? "border-[#C8A97E] text-[#C8A97E]" : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Aprovadas ({reviews.filter((r) => r.approved).length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-serif-premium text-neutral-800 mb-2">Nenhuma avaliação aqui</h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            {activeTab === "pendente"
              ? "Quando um cliente enviar um comentário, ele aparecerá aqui para moderação."
              : "Ainda não há avaliações aprovadas."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.$id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-sm font-semibold text-neutral-800">{review.customerName}</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        className={star <= review.rating ? "text-[#C8A97E] fill-[#C8A97E]" : "text-neutral-200"}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                    Produto: {review.productId.slice(0, 8)}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                <p className="text-[10px] text-neutral-400 mt-2">
                  {new Date(review.$createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!review.approved ? (
                  <button
                    onClick={() => updateApproval(review.$id, true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 size={14} /> Aprovar
                  </button>
                ) : (
                  <button
                    onClick={() => updateApproval(review.$id, false)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-xs font-semibold rounded-xl hover:bg-amber-100 transition-colors"
                  >
                    Despublicar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.$id)}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Excluir avaliação"
                >
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
