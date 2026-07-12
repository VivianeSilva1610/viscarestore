"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { databases, storage, isAppwriteConfigured } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { Star, Loader2, Send, CheckCircle, ImagePlus, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "6a391020001d02651b57";
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "viscareelojavirtual1610";
const REVIEWS_COL_ID = "reviews";
const MAX_PHOTOS = 5;

interface Review {
  id: number | string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  pictures: string[];
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-neutral-200 fill-neutral-200"}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

interface Props {
  numericProductId: string;
  handle: string;
  productTitle: string;
}

export default function ShopifyReviews({ numericProductId, handle, productTitle }: Props) {
  const { language } = useLanguage();
  const isPt = language === "pt";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        // Fetch Judge.me reviews and Appwrite approved reviews in parallel
        const [judgeRes, appwriteDocs] = await Promise.allSettled([
          fetch(`/api/shopify/reviews?productId=${numericProductId}&handle=${encodeURIComponent(handle)}`).then((r) => r.json()),
          isAppwriteConfigured()
            ? databases.listDocuments(DB_ID, REVIEWS_COL_ID, [
                Query.equal("productId", numericProductId),
                Query.equal("approved", true),
                Query.orderDesc("$createdAt"),
                Query.limit(50),
              ])
            : Promise.resolve({ documents: [] }),
        ]);

        const judgeReviews: Review[] =
          judgeRes.status === "fulfilled" ? (judgeRes.value.reviews ?? []) : [];

        const appwriteReviews: Review[] =
          appwriteDocs.status === "fulfilled"
            ? appwriteDocs.value.documents.map((d: any) => ({
                id: d.$id,
                author: d.customerName,
                rating: d.rating,
                title: "",
                body: d.comment,
                createdAt: d.$createdAt,
                pictures: Array.isArray(d.images) ? d.images.filter(Boolean) : [],
              }))
            : [];

        const combined = [...judgeReviews, ...appwriteReviews];
        setReviews(combined);
        const t = combined.length;
        setTotal(t);
        setRating(
          t > 0 ? Math.round((combined.reduce((s, r) => s + r.rating, 0) / t) * 10) / 10 : 0
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, [numericProductId]);

  // Cleanup object URLs on unmount or when files change
  useEffect(() => {
    return () => { previews.forEach((url) => URL.revokeObjectURL(url)); };
  }, [previews]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - selectedFiles.length);
    if (!newFiles.length) return;
    const combined = [...selectedFiles, ...newFiles].slice(0, MAX_PHOTOS);
    setSelectedFiles(combined);
    setPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return combined.map((f) => URL.createObjectURL(f));
    });
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [selectedFiles]);

  const removeFile = useCallback((index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, [previews]);

  const resetForm = () => {
    setForm({ name: "", rating: 5, comment: "" });
    setSelectedFiles([]);
    setPreviews((prev) => { prev.forEach((u) => URL.revokeObjectURL(u)); return []; });
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setIsSending(true);
    setUploadProgress(0);

    try {
      const imageUrls: string[] = [];

      if (selectedFiles.length > 0 && isAppwriteConfigured()) {
        for (let i = 0; i < selectedFiles.length; i++) {
          try {
            const fileId = ID.unique();
            await storage.createFile(BUCKET_ID, fileId, selectedFiles[i]);
            const url = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
            imageUrls.push(url);
          } catch {
            // skip failed uploads — review still submits with whatever succeeded
          }
          setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
        }
      }

      if (isAppwriteConfigured()) {
        await databases.createDocument(DB_ID, REVIEWS_COL_ID, ID.unique(), {
          productId: numericProductId,
          customerName: form.name.trim(),
          rating: form.rating,
          comment: form.comment.trim(),
          approved: false,
          ...(imageUrls.length > 0 && { images: imageUrls }),
        });
      }

      setSent(true);
      setShowForm(false);
      resetForm();
    } catch {
      // silently fail
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="mt-20 border-t border-neutral-100 pt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="font-serif-premium text-2xl text-neutral-900 font-light tracking-wide mb-2">
            {isPt ? "Avaliações dos Clientes" : "Recensioni Clienti"}
          </h2>
          {!isLoading && total > 0 && (
            <div className="flex items-center gap-3">
              <Stars rating={rating} size={16} />
              <span className="font-sans-premium text-sm font-semibold text-neutral-800">{rating.toFixed(1)}</span>
              <span className="font-sans-premium text-xs text-neutral-400">
                {total} {isPt ? "avaliação(ões)" : total === 1 ? "recensione" : "recensioni"}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setSent(false); }}
          className="px-5 py-2.5 border border-[#C8A97E] text-[#C8A97E] font-sans-premium text-xs tracking-widest uppercase hover:bg-[#C8A97E] hover:text-white transition-all duration-200 rounded-xl"
        >
          {isPt ? "Avaliar produto" : "Scrivi una recensione"}
        </button>
      </div>

      {/* Thank-you message */}
      {sent && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-5 py-4 mb-8 font-sans-premium text-sm">
          <CheckCircle size={18} />
          {isPt
            ? "Obrigado! Sua avaliação será publicada após revisão."
            : "Grazie! La tua recensione sarà pubblicata dopo revisione."}
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#F8F5F2] rounded-2xl p-6 mb-10 border border-[#C8A97E]/10">
          <h3 className="font-serif-premium text-lg text-neutral-800 font-light mb-5">
            {isPt ? `Avaliar: ${productTitle}` : `Recensire: ${productTitle}`}
          </h3>

          {/* Star picker */}
          <div className="mb-4">
            <label className="font-sans-premium text-[10px] tracking-widest uppercase text-neutral-500 block mb-2">
              {isPt ? "Sua nota" : "Il tuo voto"}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setForm({ ...form, rating: i })}
                >
                  <Star
                    size={28}
                    className={i <= (hoverRating || form.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-neutral-300 fill-neutral-100"}
                    strokeWidth={0.5}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="font-sans-premium text-[10px] tracking-widest uppercase text-neutral-500 block mb-2">
              {isPt ? "Seu nome" : "Il tuo nome"} *
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-neutral-200 focus:border-[#C8A97E] outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl bg-white"
              placeholder={isPt ? "Ex: Maria S." : "Es: Maria S."}
            />
          </div>

          <div className="mb-5">
            <label className="font-sans-premium text-[10px] tracking-widest uppercase text-neutral-500 block mb-2">
              {isPt ? "Comentário" : "Commento"} *
            </label>
            <textarea
              required
              rows={4}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full border border-neutral-200 focus:border-[#C8A97E] outline-none px-4 py-3 text-sm text-neutral-800 rounded-xl resize-none bg-white"
              placeholder={isPt ? "Conte sua experiência com o produto…" : "Racconta la tua esperienza con il prodotto…"}
            />
          </div>

          {/* Image upload */}
          <div className="mb-6">
            <label className="font-sans-premium text-[10px] tracking-widest uppercase text-neutral-500 block mb-3">
              {isPt ? `Fotos (opcional, máx. ${MAX_PHOTOS})` : `Foto (opzionale, max ${MAX_PHOTOS})`}
            </label>

            {/* Previews grid */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-0.5 right-0.5 bg-neutral-900/70 hover:bg-neutral-900 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {/* Add more slot */}
                {selectedFiles.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-[#C8A97E]/50 hover:border-[#C8A97E] text-[#C8A97E] flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <ImagePlus size={18} />
                    <span className="font-sans-premium text-[9px] tracking-wide uppercase">
                      {isPt ? "Mais" : "Altra"}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Initial upload button (shown when no files selected) */}
            {previews.length === 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2.5 border-2 border-dashed border-[#C8A97E]/40 hover:border-[#C8A97E] rounded-xl px-5 py-4 text-neutral-500 hover:text-[#C8A97E] transition-colors w-full justify-center"
              >
                <ImagePlus size={18} />
                <span className="font-sans-premium text-xs tracking-widest uppercase">
                  {isPt ? "Adicionar fotos" : "Aggiungi foto"}
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload progress bar */}
            {isSending && selectedFiles.length > 0 && uploadProgress < 100 && (
              <div className="mt-2 h-1 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C8A97E] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="px-5 py-2.5 text-sm text-neutral-500 hover:text-neutral-700 font-sans-premium"
            >
              {isPt ? "Cancelar" : "Annulla"}
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-[#C8A97E] text-white font-sans-premium text-xs tracking-widest uppercase transition-colors duration-300 rounded-xl disabled:opacity-60"
            >
              {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isSending
                ? (isPt ? "Enviando…" : "Invio…")
                : (isPt ? "Enviar" : "Invia")}
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#C8A97E]" />
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <p className="font-sans-premium text-sm text-neutral-400 text-center py-10">
          {isPt ? "Sem avaliações ainda. Seja o primeiro a avaliar!" : "Nessuna recensione ancora. Sii il primo a recensire!"}
        </p>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-8">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-neutral-100 pb-8 last:border-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <Stars rating={r.rating} />
                  <p className="font-sans-premium text-sm font-semibold text-neutral-800 mt-1">{r.author}</p>
                  {r.title && (
                    <p className="font-serif-premium text-sm text-neutral-700 italic mt-0.5">{r.title}</p>
                  )}
                </div>
                {r.createdAt && (
                  <span className="font-sans-premium text-[10px] text-neutral-400 shrink-0">
                    {new Date(r.createdAt).toLocaleDateString(isPt ? "pt-BR" : "it-IT", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>

              {r.body && (
                <p className="font-sans-premium text-sm text-neutral-600 leading-relaxed mt-2">{r.body}</p>
              )}

              {r.pictures.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {r.pictures.filter(Boolean).map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={url}
                      alt=""
                      onClick={() => setSelectedPhoto(url)}
                      className="w-16 h-16 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity border border-neutral-100"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selectedPhoto} alt="" className="max-w-lg max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}
    </section>
  );
}
