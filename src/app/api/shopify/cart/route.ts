import { NextRequest, NextResponse } from "next/server";
import { createShopifyCart } from "@/lib/shopify";

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items obrigatório" }, { status: 400 });
    }

    const result = await createShopifyCart(items);

    if (!result) {
      return NextResponse.json(
        { error: "Não foi possível criar o carrinho no Shopify." },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
