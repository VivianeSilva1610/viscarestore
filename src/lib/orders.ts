import { ID, Query } from "node-appwrite";
import { getStripeSessionDetails } from "@/lib/stripe";
import { adminDatabases, DB_ID, ORDERS_COL_ID, PRODUCTS_COL_ID } from "@/lib/appwrite-admin";
import { generateTrackingCode, type StatusHistoryEntry } from "@/lib/tracking";
import { getEstimatedDeliveryDate } from "@/lib/delivery";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { notifyAdminsOfNewSale } from "@/lib/push";

export type FinalizeOrderResult =
  | { pending: true }
  | { trackingCode: string; estimatedDeliveryDate: string };

/**
 * Cria o pedido no Appwrite a partir de uma sessão do Stripe já paga.
 * Idempotente por sessionId: chamado tanto pelo navegador (página de sucesso)
 * quanto pelo webhook do Stripe, para garantir que o pedido seja criado mesmo
 * que o cliente feche a aba antes do fetch do navegador terminar.
 */
export async function finalizeOrderFromSession(
  sessionId: string,
  origin: string
): Promise<FinalizeOrderResult> {
  const existing = await adminDatabases.listDocuments(DB_ID, ORDERS_COL_ID, [
    Query.equal("sessionId", sessionId),
  ]);
  if (existing.total > 0) {
    const order = existing.documents[0] as any;
    return {
      trackingCode: order.trackingCode,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
    };
  }

  const session = await getStripeSessionDetails(sessionId);

  // Nunca confirmar/criar pedido sem pagamento efetivamente concluído.
  // Métodos assíncronos (ex.: boleto, pix) redirecionam para success_url
  // antes da confirmação do pagamento, então isso precisa ser checado aqui.
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    return { pending: true };
  }

  const address = session.shipping_details?.address
    ? `${session.shipping_details.address.line1 || ""}, ${session.shipping_details.address.city || ""} - ${session.shipping_details.address.state || ""}, ${session.shipping_details.address.postal_code || ""}, ${session.shipping_details.address.country || ""}`
    : "Não informado";

  const itemsSummary = session.line_items
    ? session.line_items.map((i: any) => `${i.quantity}x ${i.description}`).join(", ")
    : "Produtos não informados";

  const cartItems = JSON.parse(session.cartItems || "[]") as { id: string; qty: number }[];
  let maxDeliveryDays = 5;
  for (const item of cartItems) {
    try {
      const product: any = await adminDatabases.getDocument(DB_ID, PRODUCTS_COL_ID, item.id);
      const days = product.delivery_days ?? 5;
      if (days > maxDeliveryDays) maxDeliveryDays = days;
    } catch (err) {
      console.error(`Produto ${item.id} não encontrado para cálculo de entrega`, err);
    }
  }
  const estimatedDeliveryDate = getEstimatedDeliveryDate(maxDeliveryDays);

  const trackingCode = generateTrackingCode();
  const statusHistory: StatusHistoryEntry[] = [
    { status: "preparando", timestamp: new Date().toISOString() },
  ];

  await adminDatabases.createDocument(DB_ID, ORDERS_COL_ID, ID.unique(), {
    sessionId,
    customerName: session.customer_name || "Cliente",
    customerEmail: session.customer_email || "",
    amountTotal: session.amount_total || 0,
    shippingAddress: address,
    products: itemsSummary,
    status: "pago",
    protocolNumber: trackingCode,
    paymentMethod: session.payment_method || "Stripe",
    trackingCode,
    trackingStatus: "preparando",
    statusHistory: JSON.stringify(statusHistory),
    estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
  });

  for (const item of cartItems) {
    try {
      const product: any = await adminDatabases.getDocument(DB_ID, PRODUCTS_COL_ID, item.id);
      const currentStock = product.stock_quantity ?? 0;
      const newStock = Math.max(0, currentStock - item.qty);
      await adminDatabases.updateDocument(DB_ID, PRODUCTS_COL_ID, item.id, {
        stock_quantity: newStock,
        in_stock: newStock > 0,
      });
    } catch (err) {
      console.error(`Falha ao atualizar estoque do produto ${item.id}`, err);
    }
  }

  if (session.customer_email) {
    try {
      await sendOrderConfirmationEmail({
        to: session.customer_email,
        customerName: session.customer_name || "Cliente",
        trackingCode,
        estimatedDeliveryDateLabel: estimatedDeliveryDate.toLocaleDateString("pt-BR", { day: "numeric", month: "long" }),
        itemsSummary,
        amountTotalLabel: ((session.amount_total || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "EUR" }),
        trackingUrl: `${origin}/rastreio?code=${trackingCode}`,
      });
    } catch (err) {
      console.error("Falha ao enviar email de confirmação", err);
    }
  }

  const amountLabel = ((session.amount_total || 0) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "EUR",
  });
  notifyAdminsOfNewSale({
    title: "Nova venda! 🎉",
    body: `${session.customer_name || "Cliente"} — ${amountLabel}`,
    url: "/admin/rastreamento",
  }).catch((err) => console.error("Falha ao enviar push notification de venda", err));

  return {
    trackingCode,
    estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
  };
}
