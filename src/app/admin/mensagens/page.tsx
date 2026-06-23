"use client";

import React, { useState, useEffect } from "react";
import { databases, isAppwriteConfigured } from "../../../lib/appwrite";
import { Query } from "appwrite";
import { MessageSquare, Mail, Calendar, Check, Loader2, Trash2 } from "lucide-react";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const MESSAGES_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || "messages";

interface AppwriteMessage {
  $id: string;
  email: string;
  message: string;
  status: string;
  $createdAt: string;
}

export default function MensagensPage() {
  const [messages, setMessages] = useState<AppwriteMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    if (!isAppwriteConfigured()) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await databases.listDocuments(DB_ID, MESSAGES_COL_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(100)
      ]);
      setMessages(res.documents as unknown as AppwriteMessage[]);
    } catch (error) {
      console.error("Erro ao buscar mensagens", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await databases.updateDocument(DB_ID, MESSAGES_COL_ID, id, { status: "read" });
      setMessages(prev => prev.map(m => m.$id === id ? { ...m, status: "read" } : m));
    } catch (error) {
      console.error("Erro ao atualizar status", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) return;
    try {
      await databases.deleteDocument(DB_ID, MESSAGES_COL_ID, id);
      setMessages(prev => prev.filter(m => m.$id !== id));
    } catch (error) {
      console.error("Erro ao excluir mensagem", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide font-serif flex items-center gap-2">
            <MessageSquare size={24} className="text-[#C8A97E]" />
            Dúvidas e Mensagens
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Gerencie as perguntas enviadas pelos clientes no rodapé da loja.
          </p>
        </div>
        <button 
          onClick={fetchMessages}
          className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-xs font-semibold uppercase tracking-widest rounded-lg hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors"
        >
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-serif-premium text-neutral-800 mb-2">Nenhuma mensagem ainda</h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Quando seus clientes enviarem dúvidas através do rodapé do site, elas aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((msg) => (
            <div 
              key={msg.$id} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                msg.status === "new" ? "border-[#C8A97E]/40 shadow-sm" : "border-neutral-200 shadow-sm opacity-70"
              }`}
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    {msg.status === "new" && (
                      <span className="bg-[#C8A97E] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                        Nova
                      </span>
                    )}
                    <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(msg.$createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-neutral-400" />
                    <a href={`mailto:${msg.email}`} className="text-neutral-900 font-semibold hover:text-[#C8A97E] transition-colors">
                      {msg.email}
                    </a>
                  </div>

                  <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-100 relative">
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-end md:justify-center gap-3 md:w-48 border-t md:border-t-0 md:border-l border-neutral-100 pt-5 md:pt-0 pl-0 md:pl-8">
                  <a 
                    href={`mailto:${msg.email}`}
                    onClick={() => { if(msg.status === "new") markAsRead(msg.$id); }}
                    className="w-full text-center px-4 py-2.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#C8A97E] transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={14} /> Responder
                  </a>
                  
                  {msg.status === "new" && (
                    <button 
                      onClick={() => markAsRead(msg.$id)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={14} /> Marcar Lida
                    </button>
                  )}

                  <button 
                    onClick={() => deleteMessage(msg.$id)}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-neutral-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
