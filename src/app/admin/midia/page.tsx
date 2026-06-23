"use client";

import React, { useState, useEffect } from "react";
import { databases, storage, isAppwriteConfigured } from "../../../lib/appwrite";
import { Query, ID } from "appwrite";
import { Video, UploadCloud, Trash2, Edit2, Loader2, PlayCircle, Save, X } from "lucide-react";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const VIDEOS_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_COLLECTION_ID || "videos";
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "";

interface AppwriteVideo {
  $id: string;
  title: string;
  fileId: string;
  $createdAt: string;
}

export default function MidiaPage() {
  const [videos, setVideos] = useState<AppwriteVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const fetchVideos = async () => {
    if (!isAppwriteConfigured()) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await databases.listDocuments(DB_ID, VIDEOS_COL_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(100)
      ]);
      setVideos(res.documents as unknown as AppwriteVideo[]);
    } catch (error) {
      console.error("Erro ao buscar vídeos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        if (!newTitle) setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
      } else {
        alert("Por favor, selecione um arquivo de vídeo (mp4, webm, etc).");
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newTitle) return;

    setIsUploading(true);
    try {
      // 1. Upload to Storage
      const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), selectedFile);
      
      // 2. Save metadata to Database
      const newVideo = await databases.createDocument(DB_ID, VIDEOS_COL_ID, ID.unique(), {
        title: newTitle,
        fileId: uploadedFile.$id
      });

      setVideos(prev => [newVideo as unknown as AppwriteVideo, ...prev]);
      setNewTitle("");
      setSelectedFile(null);
      alert("Vídeo enviado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer upload do vídeo", error);
      alert("Erro ao fazer upload. Verifique o tamanho do arquivo e tente novamente. Detalhes: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (videoId: string, fileId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este vídeo? Ele sairá do ar imediatamente.")) return;
    try {
      // Delete from Database
      await databases.deleteDocument(DB_ID, VIDEOS_COL_ID, videoId);
      // Delete from Storage
      await storage.deleteFile(BUCKET_ID, fileId);
      
      setVideos(prev => prev.filter(v => v.$id !== videoId));
    } catch (error) {
      console.error("Erro ao excluir vídeo", error);
      alert("Erro ao excluir o vídeo.");
    }
  };

  const startEditing = (video: AppwriteVideo) => {
    setEditingId(video.$id);
    setEditingTitle(video.title);
  };

  const saveEdit = async (videoId: string) => {
    if (!editingTitle.trim()) return;
    try {
      await databases.updateDocument(DB_ID, VIDEOS_COL_ID, videoId, { title: editingTitle });
      setVideos(prev => prev.map(v => v.$id === videoId ? { ...v, title: editingTitle } : v));
      setEditingId(null);
    } catch (error) {
      console.error("Erro ao editar título", error);
      alert("Erro ao editar o título.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide font-serif flex items-center gap-2">
          <Video size={24} className="text-[#C8A97E]" />
          Mídia e Vídeos
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Gerencie os vídeos que aparecerão na página "Vídeos" da sua loja.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm mb-12">
        <h3 className="text-lg font-serif-premium text-neutral-800 mb-4 flex items-center gap-2">
          <UploadCloud size={20} className="text-[#C8A97E]" />
          Enviar Novo Vídeo
        </h3>
        
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-1">
              Arquivo de Vídeo
            </label>
            <input 
              type="file" 
              accept="video/*"
              onChange={handleFileChange}
              required
              className="w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C8A97E]/10 file:text-[#C8A97E] hover:file:bg-[#C8A97E]/20"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-1">
              Título do Vídeo
            </label>
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Coleção de Verão 2026"
              required
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-[#C8A97E] focus:bg-white focus:outline-none px-4 py-2.5 text-sm rounded-xl transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={isUploading || !selectedFile || !newTitle}
            className="w-full md:w-auto px-6 py-2.5 bg-neutral-900 disabled:bg-neutral-400 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#C8A97E] transition-colors flex items-center justify-center gap-2"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : "Enviar"}
          </button>
        </form>
      </div>

      {/* Videos List */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-serif-premium text-neutral-800">Vídeos Publicados ({videos.length})</h3>
        <button 
          onClick={fetchVideos}
          className="text-xs text-neutral-500 hover:text-[#C8A97E] transition-colors"
        >
          Atualizar lista
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <Video size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-serif-premium text-neutral-800 mb-2">Nenhum vídeo ainda</h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Faça o upload do seu primeiro vídeo acima para ele aparecer no site.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const videoUrl = storage.getFileView(BUCKET_ID, video.fileId).toString();
            return (
              <div key={video.$id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden group">
                <div className="relative bg-neutral-950 aspect-video flex items-center justify-center">
                  <video 
                    src={videoUrl} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    controls
                    preload="metadata"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">
                    Vídeo
                  </div>
                </div>
                
                <div className="p-5">
                  {editingId === video.$id ? (
                    <div className="flex items-center gap-2 mb-4">
                      <input 
                        type="text" 
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 border-b border-[#C8A97E] focus:outline-none text-sm text-neutral-900 pb-1"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(video.$id)} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded">
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-neutral-400 hover:bg-neutral-100 p-1.5 rounded">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <h4 className="font-semibold text-neutral-800 text-sm line-clamp-2" title={video.title}>
                        {video.title}
                      </h4>
                      <button 
                        onClick={() => startEditing(video)} 
                        className="text-neutral-400 hover:text-[#C8A97E] transition-colors shrink-0"
                        title="Editar Título"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-neutral-400">
                      {new Date(video.$createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleDelete(video.$id, video.fileId)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
