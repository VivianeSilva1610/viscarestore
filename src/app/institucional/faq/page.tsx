"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const faqData = {
  pt: [
    {
      q: "Qual é o prazo de entrega?",
      a: "Os prazos variam conforme o destino. Para o Brasil: 15 a 30 dias úteis. Para Portugal e Europa: 7 a 15 dias úteis. Para outros países: 20 a 40 dias úteis. Esses prazos são estimados — imprevistos alfandegários podem causar variações. Você acompanha tudo pelo código de rastreio enviado por e-mail."
    },
    {
      q: "Como funciona a política de troca e devolução?",
      a: "Você tem até 7 dias úteis após o recebimento para solicitar a devolução por arrependimento, conforme o Código de Defesa do Consumidor (CDC). Produtos com defeito podem ser trocados em até 30 dias. O produto deve estar na embalagem original, sem sinais de uso. Entre em contato pelo e-mail de suporte para iniciar o processo."
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Aceitamos cartões de crédito e débito das principais bandeiras (Visa, Mastercard, American Express) via Stripe. O pagamento é processado de forma segura com criptografia SSL. Não aceitamos boleto bancário ou PIX no momento."
    },
    {
      q: "Como funciona a curadoria dos produtos?",
      a: "Cada produto passa por uma seleção criteriosa: avaliamos a composição dos ingredientes (para skincare), a origem e materiais (para moda e acessórios), as avaliações de clientes reais, e testamos uma amostra antes de incluir no catálogo. Nossa promessa é selecionar produtos que realmente funcionam — sem claims vazios."
    },
    {
      q: "Os produtos são originais/autênticos?",
      a: "Sim. Trabalhamos apenas com fornecedores verificados. Os produtos de skincare e perfumaria são fabricados por laboratórios certificados. Os produtos de moda e acessórios são fabricados conforme as especificações de cada marca parceira. Não comercializamos réplicas ou produtos contrafeitos."
    },
    {
      q: "Como rastrear meu pedido?",
      a: "Após a confirmação do pagamento, você recebe um e-mail com o código de rastreio em até 3 dias úteis. Você pode rastrear diretamente em viscaree.com.br/rastreio, inserindo o código do seu pedido. Também mantemos o status atualizado na sua área de cliente."
    },
    {
      q: "Como entrar em contato com o suporte?",
      a: "Pelo formulário na página de Contato (viscaree.com.br/contato), ou diretamente pelo e-mail [EMAIL A PREENCHER]. Respondemos em até 48 horas úteis. Para urgências relacionadas a pedidos em trânsito, indique o número do pedido no assunto."
    },
    {
      q: "Qual o prazo de reembolso?",
      a: "Em caso de cancelamento de pedido antes do envio: reembolso em até 5 dias úteis. Em caso de devolução por arrependimento (após recebimento): reembolso processado em até 15 dias úteis após recebermos o produto devolvido. O crédito é estornado no cartão original da compra."
    },
    {
      q: "Vocês enviam para fora do Brasil?",
      a: "Sim, realizamos envios internacionais. Os principais destinos são Portugal, Itália e demais países da União Europeia. Taxas alfandegárias e impostos locais são de responsabilidade do comprador. Verifique as regras de importação do seu país antes de finalizar o pedido."
    },
    {
      q: "Posso cancelar meu pedido?",
      a: "Pedidos podem ser cancelados sem custo até 24 horas após a confirmação do pagamento, desde que ainda não tenham sido enviados. Após o envio, aplica-se a política de devolução. Para cancelar, entre em contato imediatamente pelo e-mail de suporte com o número do pedido."
    }
  ],
  it: [
    {
      q: "Quali sono i tempi di consegna?",
      a: "I tempi variano a seconda della destinazione. Per il Brasile: 15-30 giorni lavorativi. Per il Portogallo e l'Europa: 7-15 giorni lavorativi. Per altri paesi: 20-40 giorni lavorativi. Questi tempi sono stimati — possono verificarsi variazioni doganali. Puoi seguire tutto tramite il codice di tracciamento inviato via e-mail."
    },
    {
      q: "Come funziona la politica di reso e cambio?",
      a: "Hai 14 giorni dalla ricezione per richiedere un reso per ripensamento (conforme al Codice del Consumo EU). I prodotti difettosi possono essere cambiati entro 30 giorni. Il prodotto deve essere nella confezione originale, senza segni di utilizzo."
    },
    {
      q: "Quali metodi di pagamento sono accettati?",
      a: "Accettiamo carte di credito e debito dei principali circuiti (Visa, Mastercard, American Express) tramite Stripe. Il pagamento è elaborato in modo sicuro con crittografia SSL."
    },
    {
      q: "Come funziona la cura della selezione?",
      a: "Ogni prodotto viene selezionato con cura: valutiamo la composizione degli ingredienti (per la skincare), l'origine e i materiali (per moda e accessori), le recensioni di clienti reali e testiamo un campione prima di includerlo nel catalogo."
    },
    {
      q: "I prodotti sono originali/autentici?",
      a: "Sì. Lavoriamo solo con fornitori verificati. I prodotti skincare e profumeria sono realizzati da laboratori certificati. Non commercializziamo prodotti contraffatti."
    },
    {
      q: "Come tracciare il mio ordine?",
      a: "Dopo la conferma del pagamento, ricevi un'e-mail con il codice di tracciamento entro 3 giorni lavorativi. Puoi tracciarlo su viscaree.com.br/rastreio inserendo il codice del tuo ordine."
    },
    {
      q: "Come contattare il supporto?",
      a: "Tramite il modulo nella pagina Contatti (viscaree.com.br/contato) o direttamente via e-mail [EMAIL DA COMPILARE]. Rispondiamo entro 48 ore lavorative."
    },
    {
      q: "Quali sono i tempi di rimborso?",
      a: "In caso di cancellazione dell'ordine prima della spedizione: rimborso entro 5 giorni lavorativi. In caso di reso per ripensamento: rimborso elaborato entro 15 giorni lavorativi dalla ricezione del prodotto restituito."
    },
    {
      q: "Spedite fuori dal Brasile?",
      a: "Sì, effettuiamo spedizioni internazionali. Le principali destinazioni sono Portogallo, Italia e altri paesi dell'Unione Europea. Dazi doganali e tasse locali sono a carico dell'acquirente."
    },
    {
      q: "Posso annullare il mio ordine?",
      a: "Gli ordini possono essere annullati senza costi entro 24 ore dalla conferma del pagamento, purché non siano ancora stati spediti. Contattaci immediatamente via e-mail con il numero dell'ordine."
    }
  ]
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-sans-premium text-sm text-neutral-900 tracking-wide pr-6">{question}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`shrink-0 text-[#C8A97E] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="font-sans-premium text-sm text-neutral-600 leading-relaxed pb-5 pr-8">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { language } = useLanguage();
  const items = faqData[language] ?? faqData.pt;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FDFAF7] flex flex-col">
          <Navbar />
          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-2xl mx-auto px-6 sm:px-12">

              <div className="text-center mb-14">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                  <span className="font-sans-premium text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] font-semibold">
                    {language === "it" ? "Supporto" : "Suporte"}
                  </span>
                  <span className="w-8 h-[1px] bg-[#C8A97E]" />
                </div>
                <h1 className="font-serif-premium text-3xl text-neutral-900 font-light tracking-wide">
                  {language === "it" ? "Domande Frequenti" : "Dúvidas Frequentes"}
                </h1>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm px-8 py-2">
                {items.map((item) => (
                  <FaqItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>

              <p className="font-sans-premium text-xs text-neutral-400 text-center mt-10 tracking-wide">
                {language === "it"
                  ? "Non hai trovato la risposta? Scrivici tramite la pagina Contatti."
                  : "Não encontrou a resposta? Escreva para nós pela página de Contato."}
              </p>
            </div>
          </main>
          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
