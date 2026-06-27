"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Euro, CreditCard, ArrowRight, Info } from "lucide-react";

export default function CustosPage() {
  const [valorLiquido, setValorLiquido] = useState<string>("100");
  const [tipoCartao, setTipoCartao] = useState<"europeu" | "internacional">("europeu");
  const [conversaoMoeda, setConversaoMoeda] = useState<boolean>(false);

  const [precoFinal, setPrecoFinal] = useState<number>(0);
  const [taxaFixa, setTaxaFixa] = useState<number>(0.25);
  const [taxaVariavel, setTaxaVariavel] = useState<number>(0);

  useEffect(() => {
    calcularPrecoFinal();
  }, [valorLiquido, tipoCartao, conversaoMoeda]);

  const calcularPrecoFinal = () => {
    const valor = parseFloat(valorLiquido.replace(",", "."));
    if (isNaN(valor) || valor <= 0) {
      setPrecoFinal(0);
      setTaxaVariavel(0);
      return;
    }

    let percentualTaxa = 0;

    if (tipoCartao === "europeu") {
      percentualTaxa = 0.014; // 1.4%
    } else {
      percentualTaxa = 0.029; // 2.9%
    }

    if (conversaoMoeda) {
      percentualTaxa += 0.02; // +2.0%
    }

    setTaxaVariavel(percentualTaxa);

    // Preço Venda = (Valor Desejado + Taxa Fixa) / (1 - Taxa Variável)
    const precoVenda = (valor + 0.25) / (1 - percentualTaxa);
    setPrecoFinal(precoVenda);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-neutral-900 mb-2 flex items-center gap-2">
          <Calculator className="text-[#C8A97E]" />
          Calculadora de Custos
        </h1>
        <p className="text-neutral-500">
          Calcule o preço de venda ideal para garantir sua margem de lucro cobrindo as taxas do Stripe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Configurações */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-lg font-medium text-neutral-900 mb-6">Parâmetros do Cálculo</h2>
            
            <div className="space-y-5">
              {/* Valor Desejado */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Valor Líquido Desejado (€)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Euro className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl focus:ring-[#C8A97E] focus:border-[#C8A97E] sm:text-sm transition-colors"
                    placeholder="100.00"
                    value={valorLiquido}
                    onChange={(e) => setValorLiquido(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Quanto você quer receber limpo após as taxas.
                </p>
              </div>

              {/* Tipo de Cartão */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Origem do Cartão do Cliente
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTipoCartao("europeu")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      tipoCartao === "europeu"
                        ? "bg-[#C8A97E]/10 border-[#C8A97E] text-[#b8976b]"
                        : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <CreditCard size={18} />
                    Europeu (SEE) - 1,4%
                  </button>
                  <button
                    onClick={() => setTipoCartao("internacional")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      tipoCartao === "internacional"
                        ? "bg-[#C8A97E]/10 border-[#C8A97E] text-[#b8976b]"
                        : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <CreditCard size={18} />
                    Internacional - 2,9%
                  </button>
                </div>
              </div>

              {/* Conversão de Moeda */}
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">Conversão de Moeda (+2,0%)</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Ative se o cliente for pagar em uma moeda diferente de Euro (€).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={conversaoMoeda}
                    onChange={(e) => setConversaoMoeda(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8A97E]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8A97E]"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 border border-blue-100">
            <Info className="flex-shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium">Por que esse cálculo é diferente de apenas somar a taxa?</p>
              <p>
                As taxas do Stripe são calculadas sobre o valor <strong>final</strong> cobrado do cliente. 
                Se você apenas somar 1,4% a 100€ (101,4€), o Stripe cobrará 1,4% de 101,4€, deixando você com menos de 100€. 
                A calculadora usa a fórmula correta de repasse (markup).
              </p>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-xl sticky top-8">
            <h2 className="text-lg font-medium text-neutral-400 mb-6 uppercase tracking-wider text-sm">Resumo do Preço</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Preço Final de Venda</p>
                <div className="text-4xl font-serif text-[#C8A97E]">
                  € {precoFinal.toFixed(2)}
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Valor a ser cobrado do cliente na loja.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Taxa Variável ({(taxaVariavel * 100).toFixed(1)}%)</span>
                  <span className="text-red-400">- € {(precoFinal * taxaVariavel).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Taxa Fixa (Stripe)</span>
                  <span className="text-red-400">- € {taxaFixa.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Você Recebe</span>
                  <span className="text-xl font-medium text-green-400">
                    € {parseFloat(valorLiquido || "0").toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(precoFinal.toFixed(2));
                alert("Preço final copiado para a área de transferência!");
              }}
              className="w-full mt-8 bg-[#C8A97E] hover:bg-[#b8976b] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              Copiar Preço Final
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
