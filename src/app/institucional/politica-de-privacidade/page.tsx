import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Política de Privacidade | VisCaree",
};

export default function PoliticaDePrivacidadePage() {
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

              <h1 className="font-serif-premium text-3xl text-neutral-900 font-light tracking-wide mb-2">Política de Privacidade</h1>
              <p className="font-sans-premium text-xs text-neutral-400 tracking-wide mb-10">Última atualização: [DATA A PREENCHER]</p>

              {[
                {
                  title: "1. Coleta de Dados",
                  body: "Coletamos os seguintes dados pessoais: nome, e-mail, endereço de entrega, telefone (ao realizar um pedido) e dados de navegação anônimos (cookies analíticos). Não coletamos dados de cartão de crédito — o processamento é feito diretamente pelo Stripe."
                },
                {
                  title: "2. Finalidade do Tratamento",
                  body: "Os dados são utilizados para: processamento de pedidos, comunicação sobre entregas e suporte, envio de newsletter (apenas com consentimento explícito), e melhoria da experiência no site. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing."
                },
                {
                  title: "3. Base Legal (LGPD / GDPR)",
                  body: "O tratamento de dados é fundamentado em: execução de contrato (pedidos), cumprimento de obrigação legal (nota fiscal, retenção fiscal), consentimento (newsletter e cookies analíticos) e legítimo interesse (segurança e prevenção de fraudes)."
                },
                {
                  title: "4. Cookies",
                  body: "Utilizamos cookies essenciais (necessários para o funcionamento do site) e cookies analíticos (Google Analytics, com anonimização de IP). Você pode recusar cookies analíticos sem prejuízo do uso do site."
                },
                {
                  title: "5. Direitos do Titular",
                  body: "Você tem direito a: acessar seus dados, corrigir informações incorretas, solicitar a exclusão de seus dados (exceto onde há obrigação legal de retenção), revogar consentimento a qualquer momento, e portabilidade dos dados. Para exercer esses direitos, entre em contato pelo e-mail abaixo."
                },
                {
                  title: "6. Retenção de Dados",
                  body: "Dados de pedido são retidos por [X anos] conforme exigência fiscal. Dados de conta podem ser excluídos mediante solicitação. Dados de newsletter são excluídos imediatamente após o cancelamento da assinatura."
                },
                {
                  title: "7. Segurança",
                  body: "O site utiliza HTTPS (SSL/TLS) em todas as conexões. Dados são armazenados em servidores seguros na UE (Appwrite Cloud). Senhas são armazenadas com hash — nem nós temos acesso à sua senha."
                },
                {
                  title: "8. Transferência Internacional",
                  body: "Os dados podem ser processados em servidores localizados fora do Brasil (UE/EUA) por provedores de serviço (Appwrite, Stripe, Resend). Todos seguem frameworks de adequação compatíveis com a LGPD/GDPR."
                },
                {
                  title: "9. Contato do DPO (Encarregado de Dados)",
                  body: "Para questões sobre privacidade, proteção de dados ou para exercer seus direitos, entre em contato com nosso encarregado de dados: [NOME A PREENCHER] — [EMAIL DPO A PREENCHER]."
                },
                {
                  title: "10. Devolução, Troca e Reembolso",
                  body: "Em caso de desistência (dentro de 7 dias úteis do recebimento, conforme CDC), o estorno é processado em até [X dias úteis]. Para mais detalhes, acesse nossa Política de Devolução."
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
