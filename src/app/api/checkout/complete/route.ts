import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import { getStripeSessionDetails } from "@/lib/stripe";
import { adminDatabases, DB_ID, ORDERS_COL_ID, PRODUCTS_COL_ID } from "@/lib/appwrite-admin";
import { generateTrackingCode, type StatusHistoryEntry } from "@/lib/tracking";
import { getEstimatedDeliveryDate } from "@/lib/delivery";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId é obrigatório" }, { status: 400 });
    }

    // 1. Idempotência: se o pedido já existe, retorna os dados já gerados
    const existing = await adminDatabases.listDocuments(DB_ID, ORDERS_COL_ID, [
      Query.equal("sessionId", sessionId),
    ]);
    if (existing.total > 0) {
      const order = existing.documents[0] as any;
      return NextResponse.json({
        trackingCode: order.trackingCode,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
      });
    }

    // 2. Busca detalhes da sessão no Stripe
    const session = await getStripeSessionDetails(sessionId);

    const address = session.shipping_details?.address
      ? `${session.shipping_details.address.line1 || ""}, ${session.shipping_details.address.city || ""} - ${session.shipping_details.address.state || ""}, ${session.shipping_details.address.postal_code || ""}, ${session.shipping_details.address.country || ""}`
      : "Não informado";

    const itemsSummary = session.line_items
      ? session.line_items.map((i: any) => `${i.quantity}x ${i.description}`).join(", ")
      : "Produtos não informados";

    // 3. Calcula prazo de entrega com base no maior delivery_days dos produtos do carrinho
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

    // 4. Gera código de rastreio e histórico inicial
    const trackingCode = generateTrackingCode();
    const statusHistory: StatusHistoryEntry[] = [
      { status: "preparando", timestamp: new Date().toISOString() },
    ];

    // 5. Cria o pedido no Appwrite
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

    // 6. Baixa de estoque
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

    // 7. Envia email de confirmação (não bloqueia a resposta se falhar)
    if (session.customer_email) {
      try {
        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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

    return NextResponse.json({
      trackingCode,
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
    });
  } catch (error: any) {
    console.error("Erro ao finalizar pedido:", error);
    return NextResponse.json({ error: error.message || "Erro ao finalizar pedido." }, { status: 500 });
  }
}
