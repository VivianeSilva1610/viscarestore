import { NextResponse } from "next/server";
import { getStripeSessionDetails } from "@/lib/stripe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 });
  }

  try {
    const session = await getStripeSessionDetails(sessionId);
    return NextResponse.json(session);
  } catch (error: any) {
    console.error("Erro ao buscar sessão do Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
