"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { databases, isAppwriteConfigured } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { Star, Plus, Loader2, Truck, MessageSquare, Play } from "lucide-react";
import CurationCriteria from "./CurationCriteria";
import SecurityBadges from "./SecurityBadges";
import { getEstimatedDeliveryDate, formatDeliveryDate } from "../lib/delivery";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const REVIEWS_COL_ID = "reviews";

export interface ProductPageProduct {
  id: string;
  name_pt: string;
  name_it: string;
  category: string;
  categoryLabelPt: string;
  categoryLabelIt: string;
  price: number;
  weight_kg: number;
  image: string;
  video?: string;
  description_pt: string;
  description_it: string;
  ingredients_pt: string;
  ingredients_it: string;
  sizes?: string[];
  inStock?: boolean;
  delivery_days: number;
}

interface Review {
  $id: string;
  customerName: string;
  rating: number;
  comment: string;
  $createdAt: string;
}

export default function ProductPageContent({ product }: { product: ProductPageProduct }) {
  const { addToCart } = useCart();
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isPt = language === "pt";

  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeMedia, setActiveMedia] = useState<"image" | "video">(product.video ? "video" : "image");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeMedia === "video" && videoRef.current) {
      // iOS Safari is unreliable with the autoPlay attribute on mount;
      // calling play() explicitly after the element exists works consistently.
      videoRef.current.play().catch(() => {});
    }
  }, [activeMedia]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isAppwriteConfigured()) {
        setIsLoadingReviews(false);
        return;
      }
      try {
        const res = await databases.listDocuments(DB_ID, REVIEWS_COL_ID, [
          Query.equal("productId", product.id),
          Query.equal("approved", true),
          Query.orderDesc("$createdAt"),
          Query.limit(50),
        ]);
        setReviews(res.documents as unknown as Review[]);
      } catch (error) {
        console.error("Erro ao buscar avaliações", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product.id]);

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const productName = isPt ? product.name_pt : product.name_it || product.name_pt;
  const productDescription = isPt ? product.description_pt : product.description_it || product.description_pt;
  const productIngredients = isPt ? product.ingredients_pt : product.ingredients_it || product.ingredients_pt;
  const categoryLabel = isPt ? product.categoryLabelPt : product.categoryLabelIt;

  const estimatedDate = getEstimatedDeliveryDate(product.delivery_days);
  const estimatedDateLabel = formatDeliveryDate(estimatedDate, language);

  const buildCartItem = () => ({
    id: product.id,
    name: productName,
    price: product.price,
    weight_kg: product.weight_kg,
    image: product.image,
    category: product.category,
    description: "",
    size: selectedSize,
    delivery_days: product.delivery_days,
  });

  const handleAddToCart = () => {
    addToCart(buildCartItem());
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ ...buildCartItem(), quantity: 1 }],
          customerEmail: user?.email || "",
          customerName: profile?.name || "",
          customerProfile: profile,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout: " + (data.error || "Tente novamente."));
        setIsBuyingNow(false);
      }
    } catch {
      alert("Erro de conexão ao processar o checkout.");
      setIsBuyingNow(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      await databases.createDocument(DB_ID, REVIEWS_COL_ID, ID.unique(), {
        productId: product.id,
        customerName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        approved: false,
      });
      setReviewSubmitted(true);
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error("Erro ao enviar avaliação", error);
      alert(isPt ? "Erro ao enviar sua avaliação. Tente novamente." : "Errore nell'invio della recensione.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[3/4] bg-[#F1E7E2] rounded-2xl overflow-hidden border border-[#C8A97E]/10">
            {activeMedia === "video" && product.video ? (
              <video
                ref={videoRef}
                src={product.video}
                className="w-full h-full object-cover"
                controls
                muted
                loop
                playsInline
                preload="auto"
                onClick={(e) => (e.currentTarget as HTMLVideoElement).play()}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={productName} className="w-full h-full object-cover mix-blend-multiply" />
            )}
            {product.inStock === false && (
              <span className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-[9px] font-sans-premium tracking-widest text-white uppercase px-2.5 py-1 rounded-full font-bold">
                {isPt ? "Esgotado" : "Esaurito"}
              </span>
            )}
          </div>

          {product.video && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActiveMedia("image")}
                className={`flex-1 aspect-square w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                  activeMedia === "image" ? "border-dourado-suave" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={productName} className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => setActiveMedia("video")}
                className={`flex-1 aspect-square w-16 rounded-xl overflow-hidden border-2 bg-neutral-900 flex items-center justify-center transition-colors ${
                  activeMedia === "video" ? "border-dourado-suave" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Play size={18} className="text-white" fill="white" />
              </button>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="flex flex-col">
          <span className="font-sans-premium text-[10px] tracking-[0.25em] text-dourado-suave font-semibold uppercase block mb-2">
            {categoryLabel}
          </span>
          <h1 className="font-serif-premium text-3xl sm:text-4xl text-neutral-900 tracking-wide font-light mb-3">
            {productName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= Math.round(avgRating) ? "text-dourado-suave fill-dourado-suave" : "text-neutral-200"}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500 font-sans-premium">
              {reviews.length > 0
                ? `${avgRating.toFixed(1)} (${reviews.length} ${isPt ? "avaliações" : "recensioni"})`
                : isPt ? "Sem avaliações ainda" : "Nessuna recensione"}
            </span>
          </div>

          <p className="font-sans-premium text-2xl font-semibold tracking-widest text-neutral-900 mb-5 border-b border-neutral-100 pb-5">
            € {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>

          {/* Delivery badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl mb-6 self-start">
            <Truck size={16} />
            <span className="text-xs font-sans-premium font-semibold">
              {isPt
                ? `Tempo de entrega: ${product.delivery_days} dias úteis — chegará por volta de ${estimatedDateLabel}`
                : `Consegna: ${product.delivery_days} giorni lavorativi — arriverà intorno al ${estimatedDateLabel}`}
            </span>
          </div>

          {productDescription && (
            <p className="font-sans-premium text-sm text-neutral-600 leading-relaxed font-light tracking-wide mb-6">
              {productDescription}
            </p>
          )}

          {productIngredients && (
            <div className="mb-6 bg-[#F1E7E2]/30 p-4 rounded-xl border border-dourado-suave/10">
              <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-2 font-semibold">
                {isPt ? "Ingredientes" : "Ingredienti"}
              </span>
              <p className="font-sans-premium text-[11px] text-neutral-600 leading-relaxed font-light tracking-wide">
                {productIngredients}
              </p>
            </div>
          )}

          {product.sizes && (
            <div className="mb-6">
              <span className="font-sans-premium text-[10px] tracking-widest text-neutral-500 uppercase block mb-3">
                {isPt ? "Selecione o tamanho:" : "Seleziona la taglia:"}
              </span>
              <div className="flex space-x-3">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-9 h-9 rounded-full text-[11px] font-sans-premium font-semibold flex items-center justify-center border transition-all duration-300 ${
                      selectedSize === sz
                        ? "bg-dourado-suave border-dourado-suave text-white shadow-sm"
                        : "bg-white border-neutral-900/10 hover:border-dourado-suave text-neutral-800"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4 border-t border-neutral-100">
            <button
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className="flex-1 py-4 border border-neutral-900 disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed text-neutral-900 font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-neutral-900 hover:text-white font-semibold transition-colors duration-300 rounded-xl flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              {isPt ? "Adicionar à Sacola" : "Aggiungi al Carrello"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.inStock === false || isBuyingNow}
              className="flex-1 py-4 bg-neutral-900 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-sans-premium text-xs tracking-[0.2em] uppercase hover:bg-dourado-suave font-semibold transition-colors duration-300 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              {isBuyingNow ? <Loader2 size={14} className="animate-spin" /> : null}
              {isPt ? "Comprar Agora" : "Acquista Ora"}
            </button>
          </div>

          <SecurityBadges compact />
        </div>
      </div>

      {/* Curation Criteria */}
      <div className="border-t border-neutral-100 pt-12 mb-12">
        <CurationCriteria />
      </div>

      {/* Reviews Section */}
      <div className="border-t border-neutral-100 pt-12">
        <h2 className="font-serif-premium text-2xl text-neutral-900 mb-8 flex items-center gap-2">
          <MessageSquare size={20} className="text-dourado-suave" />
          {isPt ? "Avaliações de Clientes" : "Recensioni dei Clienti"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reviews list */}
          <div className="space-y-6">
            {isLoadingReviews ? (
              <Loader2 size={24} className="animate-spin text-dourado-suave" />
            ) : reviews.length === 0 ? (
              <p className="text-neutral-400 text-sm font-sans-premium">
                {isPt ? "Seja o primeiro a avaliar este produto." : "Sii il primo a recensire questo prodotto."}
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.$id} className="bg-white border border-neutral-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-neutral-800">{review.customerName}</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= review.rating ? "text-dourado-suave fill-dourado-suave" : "text-neutral-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Submit review form */}
          <div className="bg-[#F8F5F2] rounded-2xl p-6 sm:p-8 border border-[#C8A97E]/15">
            <h3 className="font-serif-premium text-lg text-neutral-900 mb-4">
              {isPt ? "Deixe seu comentário" : "Lascia il tuo commento"}
            </h3>
            {reviewSubmitted ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm">
                {isPt
                  ? "Obrigado! Sua avaliação foi enviada e está aguardando moderação."
                  : "Grazie! La tua recensione è in attesa di moderazione."}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder={isPt ? "Seu nome" : "Il tuo nome"}
                  className="w-full bg-white border border-neutral-200 focus:border-dourado-suave focus:outline-none px-4 py-3 text-sm rounded-xl transition-colors"
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)}>
                      <Star
                        size={20}
                        className={star <= reviewRating ? "text-dourado-suave fill-dourado-suave" : "text-neutral-300"}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={isPt ? "Conte sua experiência com o produto..." : "Racconta la tua esperienza..."}
                  className="w-full bg-white border border-neutral-200 focus:border-dourado-suave focus:outline-none px-4 py-3 text-sm rounded-xl transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-3.5 bg-neutral-900 disabled:opacity-60 text-white font-sans-premium text-xs tracking-widest uppercase hover:bg-dourado-suave font-semibold transition-colors duration-300 rounded-xl"
                >
                  {isSubmittingReview
                    ? (isPt ? "Enviando..." : "Invio...")
                    : (isPt ? "Enviar Avaliação" : "Invia Recensione")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
