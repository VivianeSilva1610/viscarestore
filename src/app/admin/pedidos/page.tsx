"use client";

import React, { useState, useEffect } from "react";
import { databases, isAppwriteConfigured } from "../../../lib/appwrite";
import { Query } from "appwrite";
import { ShoppingBag, Loader2, MapPin, Package, User, Clock, CheckCircle2, Search, ArrowRight } from "lucide-react";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const ORDERS_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || "orders";

interface OrderDoc {
  $id: string;
  sessionId: string;
  customerName: string;
  customerEmail: string;
  amountTotal: number;
  shippingAddress: string;
  products: string;
  status: string;
  $createdAt: string;
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    if (!isAppwriteConfigured()) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await databases.listDocuments(DB_ID, ORDERS_COL_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(100)
      ]);
      setOrders(res.documents as unknown as OrderDoc[]);
    } catch (error) {
      console.error("Erro ao buscar pedidos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await databases.updateDocument(DB_ID, ORDERS_COL_ID, id, { status: newStatus });
      setOrders(prev => prev.map(o => o.$id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Erro ao atualizar status", error);
      alert("Erro ao atualizar o status do pedido.");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.$id.includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-wide font-serif flex items-center gap-2">
            <ShoppingBag size={24} className="text-[#C8A97E]" />
            Gestão de Pedidos
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Acompanhe as vendas da sua loja, gerencie os envios e os dados dos clientes.
          </p>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Buscar pedido ou cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-[#C8A97E] w-full sm:w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-[#C8A97E]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <ShoppingBag size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-serif-premium text-neutral-800 mb-2">Nenhum pedido recebido ainda</h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Assim que um cliente finalizar o checkout, os dados da compra e envio aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.$id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              
              {/* Header do Pedido */}
              <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${order.status === 'pago' ? 'bg-[#C8A97E]/10 text-[#C8A97E]' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Pedido #{order.$id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm font-semibold text-neutral-800">
                      {new Date(order.$createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Valor Total</p>
                    <p className="text-base font-serif-premium text-neutral-900">
                      {(order.amountTotal / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  
                  <div className="h-8 w-px bg-neutral-200 hidden md:block mx-2"></div>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.$id, e.target.value)}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
                      order.status === 'pago' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500'
                    }`}
                  >
                    <option value="pago">PAGO - Preparando Envio</option>
                    <option value="enviado">ENVIADO - Em Trânsito</option>
                    <option value="concluido">CONCLUÍDO - Entregue</option>
                  </select>
                </div>
              </div>

              {/* Corpo do Pedido */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Cliente Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <User size={14} /> Dados do Cliente
                  </h4>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{order.customerName}</p>
                    <a href={`mailto:${order.customerEmail}`} className="text-xs text-neutral-500 hover:text-[#C8A97E] transition-colors mt-1 block">
                      {order.customerEmail}
                    </a>
                  </div>
                </div>

                {/* Endereço Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <MapPin size={14} /> Endereço de Entrega
                  </h4>
                  <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
                    {order.shippingAddress !== "Não informado" ? order.shippingAddress : "Cliente não informou endereço / Retirada"}
                  </p>
                </div>

                {/* Produtos Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <ShoppingBag size={14} /> Resumo dos Produtos
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {order.products.split(", ").map((prod, idx) => (
                      <span key={idx} className="block mb-1.5">• {prod}</span>
                    ))}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
