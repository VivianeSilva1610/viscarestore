import { Resend } from "resend";

interface OrderConfirmationEmailParams {
  to: string;
  customerName: string;
  trackingCode: string;
  estimatedDeliveryDateLabel: string;
  itemsSummary: string;
  amountTotalLabel: string;
  trackingUrl: string;
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY não configurada, pulando envio de email.");
    return;
  }

  const resend = new Resend(apiKey);
  const { to, customerName, trackingCode, estimatedDeliveryDateLabel, itemsSummary, amountTotalLabel, trackingUrl } = params;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "VisCaree <pedidos@viscaree.com.br>",
    to,
    subject: `Pedido confirmado - Rastreio ${trackingCode}`,
    html: `
      <div style="font-family: Georgia, serif; background-color: #F1E7E2; padding: 32px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #C8A97E33;">
          <h1 style="color: #2a2a2a; font-size: 22px; font-style: italic; letter-spacing: 2px; margin-bottom: 16px;">VisCaree</h1>
          <p style="color: #444; font-size: 14px; line-height: 1.6;">Olá ${customerName}, muito obrigado por escolher a VisCaree! Seu pedido foi confirmado.</p>
          <div style="background: #F8F5F2; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #C8A97E22;">
            <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Código de rastreio</p>
            <p style="color: #C8A97E; font-size: 18px; font-weight: bold; margin: 0;">${trackingCode}</p>
          </div>
          <p style="color: #444; font-size: 13px; line-height: 1.6;"><strong>Itens:</strong> ${itemsSummary}</p>
          <p style="color: #444; font-size: 13px; line-height: 1.6;"><strong>Total:</strong> ${amountTotalLabel}</p>
          <p style="color: #444; font-size: 13px; line-height: 1.6;"><strong>Previsão de entrega:</strong> ${estimatedDeliveryDateLabel}</p>
          <a href="${trackingUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 10px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Rastrear pedido</a>
        </div>
      </div>
    `,
  });
}
