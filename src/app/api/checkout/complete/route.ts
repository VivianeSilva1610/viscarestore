import { NextResponse } from "next/server";
import { finalizeOrderFromSession } from "@/lib/orders";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId é obrigatório" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const result = await finalizeOrderFromSession(sessionId, origin);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erro ao finalizar pedido:", error);
    return NextResponse.json({ error: error.message || "Erro ao finalizar pedido." }, { status: 500 });
  }
}
