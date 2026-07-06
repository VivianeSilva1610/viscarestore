import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Termos de Uso | VisCaree",
};

export default function TermosDeUsoPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col">
          <Navbar />
          <main className="flex-grow pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 sm:px-12">

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-10 text-sm text-amber-800 font-sans-premium">
                ⚠️ [TEXTO A REVISAR JURIDICAMENTE] — Este conteúdo é um placeholder estruturado. Deve ser revisado e aprovado por assessoria jurídica antes do lançamento.
              </div>

              <h1 className="font-serif-premium text-3xl text-neutral-900 font-light tracking-wide mb-2">Termos de Uso</h1>
              <p className="font-sans-premium text-xs text-neutral-400 tracking-wide mb-10">Última atualização: [DATA A PREENCHER]</p>

              {[
                {
                  title: "1. Aceitação dos Termos",
                  body: "Ao acessar e utilizar o site viscaree.com.br, você concorda com estes Termos de Uso. Caso não concorde, não utilize o site. A VisCaree reserva-se o direito de alterar estes termos a qualquer momento, com aviso prévio por e-mail ou mediante publicação no site."
                },
                {
                  title: "2. Uso do Site",
                  body: "O site é destinado exclusivamente para uso pessoal e não comercial. É vedado o uso para fins ilegais, a reprodução de conteúdo sem autorização, e qualquer tentativa de comprometer a segurança da plataforma."
                },
                {
                  title: "3. Cadastro e Conta",
                  body: "Para realizar compras, o cliente pode criar uma conta fornecendo dados verídicos. O usuário é responsável pela confidencialidade de sua senha e por todas as atividades realizadas em sua conta."
                },
                {
                  title: "4. Produtos e Preços",
                  body: "Os preços exibidos são em Euros (€) e podem ser alterados sem aviso prévio. A VisCaree se reserva o direito de cancelar pedidos em caso de erro evidente de precificação. As imagens dos produtos são meramente ilustrativas."
                },
                {
                  title: "5. Pagamento",
                  body: "Os pagamentos são processados por plataformas seguras (Stripe). A VisCaree não armazena dados de cartão de crédito. Em caso de recusa do pagamento, o pedido será automaticamente cancelado."
                },
                {
                  title: "6. Entrega",
                  body: "Os prazos de entrega são estimados e podem variar conforme destino e operadora logística. Não nos responsabilizamos por atrasos causados por alfândega, greves ou eventos de força maior."
                },
                {
                  title: "7. Propriedade Intelectual",
                  body: "Todo o conteúdo do site (textos, imagens, logotipo, design) é propriedade da VisCaree ou de seus fornecedores e está protegido por leis de direitos autorais. É proibida a reprodução sem autorização expressa."
                },
                {
                  title: "8. Limitação de Responsabilidade",
                  body: "A VisCaree não se responsabiliza por danos indiretos, incidentais ou consequentes decorrentes do uso do site ou dos produtos adquiridos além do que é permitido pela legislação aplicável."
                },
                {
                  title: "9. Legislação Aplicável",
                  body: "Estes termos são regidos pelas leis brasileiras. Eventuais disputas serão resolvidas no foro da comarca de [CIDADE A PREENCHER], Brasil."
                },
                {
                  title: "10. Contato",
                  body: "Para dúvidas sobre estes Termos, entre em contato pelo e-mail: [EMAIL A PREENCHER]."
                }
              ].map(({ title, body }) => (
                <section key={title} className="mb-8">
                  <h2 className="font-sans-premium text-sm font-semibold tracking-wide text-neutral-900 uppercase mb-3">{title}</h2>
                  <p className="font-sans-premium text-sm text-neutral-600 leading-relaxed">{body}</p>
                </section>
              ))}

            </div>
          </main>
          <CartDrawer />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
