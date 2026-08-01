import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export const dynamic = "force-dynamic";

const PLANS = {
  "30dias": {
    brl: { priceId: "price_1Tzdb8RzJU0fF3wEjBOvy9tL", mode: "payment" as const },
    eur: { priceId: "price_1TzdKSRzJU0fF3wE3um54He8", mode: "payment" as const },
  },
  mensal: {
    brl: { priceId: "price_1TzdccRzJU0fF3wEzZgKRZ4D", mode: "subscription" as const },
    eur: { priceId: "price_1TzdPWRzJU0fF3wEalljEhK1", mode: "subscription" as const },
  },
};

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });
  }

  try {
    const { customerEmail, language, plan = "30dias" } = await req.json();
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://viscaree.com.br";

    const ipCountry = req.headers.get("x-vercel-ip-country");
    const isBrazil = language === "pt" || ipCountry === "BR";

    const planConfig = PLANS[plan as keyof typeof PLANS] ?? PLANS["30dias"];
    const { priceId, mode } = isBrazil ? planConfig.brl : planConfig.eur;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/acesso-rotina/sucesso?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url:  `${origin}/acesso-rotina`,
      customer_email: customerEmail || undefined,
      metadata: { language: language || "it", plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("[checkout/subscription]", e?.message);
    return NextResponse.json({ error: "Erro ao iniciar pagamento." }, { status: 500 });
  }
}
