"use client";

import React, { useState, useEffect } from "react";
import { databases } from "../../../lib/appwrite";
import { Query } from "appwrite";
import { Search, Users, Mail, Phone, MapPin, ChevronRight, X, Loader2 } from "lucide-react";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const CUSTOMERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID || "customers";

interface Customer {
  $id: string;
  $createdAt: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birth_date?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_district?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  newsletter?: boolean;
}

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await databases.listDocuments(DB_ID, CUSTOMERS_COLLECTION_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(200),
      ]);
      setCustomers(res.documents as unknown as Customer[]);
    } catch {
      setError("Erro ao carregar clientes. Verifique se a collection 'customers' foi criada no Appwrite.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="p-8 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Clientes</h1>
          <p className="text-neutral-500 text-sm mt-1">{customers.length} cliente(s) cadastrado(s)</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-amber-700 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
        <input type="text" placeholder="Pesquisar por nome, email ou telefone..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-white border border-neutral-200 focus:border-[#C8A97E] focus:outline-none pl-10 pr-4 py-3 text-sm text-neutral-700 rounded-xl transition-colors" />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Users size={48} className="text-neutral-300 mx-auto mb-4" strokeWidth={1} />
          <p className="text-neutral-400 font-medium">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-6 py-4">Nome</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4 hidden md:table-cell">Email</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4 hidden lg:table-cell">Telefone</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4 hidden lg:table-cell">Cadastro</th>
                <th className="text-left text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-4 py-4 hidden sm:table-cell">Newsletter</th>
                <th className="text-right text-[10px] tracking-widest uppercase text-neutral-500 font-semibold px-6 py-4">Ver</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.$id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C8A97E]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C8A97E] font-semibold text-sm">{c.name?.[0]?.toUpperCase() || "?"}</span>
                      </div>
                      <p className="font-medium text-sm text-neutral-800">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-neutral-500">{c.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-sm text-neutral-500">{c.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-sm text-neutral-500">{formatDate(c.$createdAt)}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wider ${c.newsletter ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"}`}>
                      {c.newsletter ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelected(c)} className="p-2 text-neutral-400 hover:text-[#C8A97E] hover:bg-[#F1E7E2] rounded-lg transition-colors" aria-label="Ver detalhes">
                      <ChevronRight size={16} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center">
                  <span className="text-[#C8A97E] font-semibold text-lg">{selected.name?.[0]?.toUpperCase() || "?"}</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">{selected.name}</p>
                  <p className="text-neutral-400 text-xs">Cadastrado em {formatDate(selected.$createdAt)}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors" aria-label="Fechar">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold mb-1.5">Email</p>
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Mail size={14} className="text-[#C8A97E]" strokeWidth={1.5} />
                    {selected.email}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold mb-1.5">Telefone</p>
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Phone size={14} className="text-[#C8A97E]" strokeWidth={1.5} />
                    {selected.phone || "Não informado"}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold mb-1.5">CPF</p>
                  <p className="text-sm text-neutral-700">{selected.cpf || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold mb-1.5">Nascimento</p>
                  <p className="text-sm text-neutral-700">{selected.birth_date || "Não informado"}</p>
                </div>
              </div>

              {(selected.address_street || selected.address_city) && (
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold mb-1.5">Endereço de Entrega</p>
                  <div className="flex items-start gap-2 text-sm text-neutral-700">
                    <MapPin size={14} className="text-[#C8A97E] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>
                      {[selected.address_street, selected.address_number, selected.address_complement,
                        selected.address_district, selected.address_city, selected.address_state,
                        selected.address_zip ? `CEP: ${selected.address_zip}` : ""
                      ].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <span className="text-xs text-neutral-500">Newsletter</span>
                <span className={`px-3 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wider ${selected.newsletter ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"}`}>
                  {selected.newsletter ? "Inscrita" : "Não inscrita"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
