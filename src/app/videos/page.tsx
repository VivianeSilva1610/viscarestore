"use client";

import React, { useEffect, useState } from "react";
import { databases, storage, isAppwriteConfigured } from "@/lib/appwrite";
import { Query } from "appwrite";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { PlayCircle, Loader2 } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const VIDEOS_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_COLLECTION_ID || "videos";
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "";

interface VideoDoc {
  $id: string;
  title: string;
  fileId: string;
  $createdAt: string;
}

export default function VideosPage() {
  const { language } = useLanguage();
  const isPt = language === "pt";
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!isAppwriteConfigured()) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await databases.listDocuments(DB_ID, VIDEOS_COL_ID, [
          Query.orderDesc("$createdAt"),
          Query.limit(50)
        ]);
        setVideos(res.documents as unknown as VideoDoc[]);
      } catch (error) {
        console.error("Erro ao buscar vídeos na galeria", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-dourado-suave/30">
          <Navbar />

          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
              <header className="mb-16 text-center">
                <span className="text-dourado-suave font-sans-premium text-xs tracking-[0.3em] uppercase font-bold mb-4 block flex items-center justify-center gap-2">
                  <PlayCircle size={16} />
                  {isPt ? "Nossas Campanhas" : "Le Nostre Campagne"}
                </span>
                <h1 className="font-serif-premium text-4xl md:text-5xl text-neutral-900 mb-6 font-light">
                  {isPt ? "Vídeos & Mídia" : "Video e Media"}
                </h1>
                <div className="w-12 h-0.5 bg-dourado-suave mx-auto mb-8"></div>
                <p className="font-sans-premium text-sm text-neutral-500 tracking-wide max-w-lg mx-auto leading-relaxed">
                  {isPt 
                    ? "Descubra a essência da VisCaree através das nossas campanhas visuais exclusivas." 
                    : "Scopri l'essenza di VisCaree attraverso le nostre esclusive campagne visive."}
                </p>
              </header>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 size={32} className="animate-spin text-dourado-suave" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                  <PlayCircle size={48} className="mx-auto text-neutral-200 mb-4" />
                  <h3 className="font-serif-premium text-xl text-neutral-800 mb-2">
                    {isPt ? "Nenhum vídeo disponível no momento" : "Nessun video disponibile al momento"}
                  </h3>
                  <p className="font-sans-premium text-sm text-neutral-400">
                    {isPt ? "Volte em breve para conferir novidades." : "Torna presto per controllare le novità."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {videos.map((video) => {
                    const videoUrl = storage.getFileView(BUCKET_ID, video.fileId).toString();
                    return (
                      <div key={video.$id} className="group flex flex-col items-center">
                        <div className="w-full bg-black rounded-xl overflow-hidden shadow-md aspect-[9/16] relative transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
                          {videoUrl.match(/\.(mp4|webm|mov|avi|ogg)/i) ? (
                            <video 
                              src={videoUrl} 
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                              controls
                              preload="metadata"
                              controlsList="nodownload"
                            />
                          ) : (
                            <img 
                              src={videoUrl} 
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                              alt={video.title}
                            />
                          )}
                        </div>
                        <div className="mt-6 text-center w-full px-2">
                          <h3 className="font-serif-premium text-lg text-neutral-900 group-hover:text-dourado-suave transition-colors duration-300">
                            {video.title}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>

          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
