"use client";

import React, { useEffect, useState } from "react";
import { databases, isAppwriteConfigured } from "../../../lib/appwrite";
import { Query } from "appwrite";
import { Mail, Loader2, Trash2, Copy, Check } from "lucide-react";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const NEWSLETTER_COL_ID = "newsletter";

interface Subscriber {
  $id: string;
  email: string;
  status: string;
  $createdAt: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    if (!isAppwriteConfigured()) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await databases.listDocuments(DB_ID, NEWSLETTER_COL_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]);
      setSubscribers(res.documents as unknown as Subscriber[]);
    } catch (error) {
      console.error("Erro ao buscar inscritos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja remover este e-mail da lista?")) return;
    try {
      await databases.deleteDocument(DB_ID, NEWSLETTER_COL_ID, id);
      setSubscribers((prev) => prev.filter((sub) => sub.$id !== id));
    } catch (error) {
      console.error("Erro ao excluir inscrito", error);
      alert("Erro ao remover inscrito.");
    }
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const copyAllEmails = () => {
    const allEmails = subscribers.map(s => s.email).join(", ");
    navigator.clipboard.writeText(allEmails);
    alert("Todos os e-mails foram copiados para a área de transferência!");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide font-serif flex items-center gap-2">
            <Mail size={24} className="text-[#C8A97E]" />
            Newsletter (Club VisCaree)
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Gerencie os clientes inscritos para receber novidades e promoções.
          </p>
        </div>
        <button
          onClick={copyAllEmails}
          disabled={subscribers.length === 0}
          className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase rounded-xl hover:bg-[#C8A97E] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Copy size={14} />
          Copiar Todos os E-mails
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-800">
            Total de Inscritos: <span className="text-[#C8A97E]">{subscribers.length}</span>
          </h3>
          <button 
            onClick={fetchSubscribers}
            className="text-xs text-neutral-500 hover:text-[#C8A97E] transition-colors"
          >
            Atualizar lista
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={48} className="mx-auto text-neutral-200 mb-4" />
            <h3 className="text-lg font-serif-premium text-neutral-800 mb-2">Nenhum inscrito ainda</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto">
              Quando os clientes se inscreverem no rodapé do site, os e-mails aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-[10px] uppercase tracking-widest text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Data de Inscrição</th>
                  <th className="px-6 py-4 font-semibold">E-mail</th>
                  <th className="px-6 py-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {subscribers.map((sub) => (
                  <tr key={sub.$id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(sub.$createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-900">{sub.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => copyToClipboard(sub.email)}
                          className={`text-xs flex items-center gap-1 transition-colors ${
                            copiedEmail === sub.email ? "text-emerald-600" : "text-neutral-400 hover:text-[#C8A97E]"
                          }`}
                          title="Copiar E-mail"
                        >
                          {copiedEmail === sub.email ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(sub.$id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                          title="Remover Inscrito"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
