import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { finalizeOrderFromSession } from "@/lib/orders";

// Confirmação server-to-server do Stripe: garante que o pedido seja criado
// mesmo que o cliente feche a aba antes do fluxo no navegador (checkout/success)
// terminar, ou em pagamentos assíncronos (Pix/Boleto) confirmados depois do redirect.
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Webhook do Stripe: assinatura ou STRIPE_WEBHOOK_SECRET ausente.");
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook do Stripe: assinatura inválida.", err.message);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as { id: string };
    const origin = process.env.NEXT_PUBLIC_APP_URL || "https://viscaree.com.br";
    try {
      await finalizeOrderFromSession(session.id, origin);
    } catch (err) {
      console.error(`Webhook do Stripe: falha ao finalizar pedido da sessão ${session.id}`, err);
      return NextResponse.json({ error: "Falha ao finalizar pedido." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
