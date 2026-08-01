import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export const dynamic = "force-dynamic";

const PRICE_ID = "price_1TzdKSRzJU0fF3wE3um54He8";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });
  }

  try {
    const { customerEmail, language } = await req.json();
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://viscaree.com.br";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${origin}/acesso-rotina/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/acesso-rotina`,
      customer_email: customerEmail || undefined,
      metadata: { language: language || "it", plan: "rotina-30dias" },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("[checkout/subscription]", e?.message);
    return NextResponse.json({ error: "Erro ao iniciar pagamento." }, { status: 500 });
  }
}
