import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Chave do Stripe não configurada." }, { status: 500 });
  }

  try {
    const { items, customerEmail, customerName } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho está vazio." }, { status: 400 });
    }

    // Map cart items to Stripe line_items format
    const line_items = items.map((item: any) => {
      let validImages: string[] = [];
      if (item.image && item.image.startsWith("http")) {
        // Stripe will reject localhost URLs with url_invalid error
        if (!item.image.includes("localhost")) {
          validImages = [item.image];
        }
      }

      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            ...(validImages.length > 0 && { images: validImages }),
            metadata: {
              id: item.id,
              size: item.size || "N/A",
            },
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`,
      customer_email: customerEmail || undefined,
      custom_fields: [
        {
          key: "cpf",
          label: {
            type: "custom",
            custom: "CPF",
          },
          type: "text",
          optional: false,
        },
      ],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },
      metadata: {
        customerName: customerName || "Guest",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro no Stripe Checkout:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento." },
      { status: 500 }
    );
  }
}
