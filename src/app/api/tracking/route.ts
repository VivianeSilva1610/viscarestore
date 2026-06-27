import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { adminDatabases, DB_ID, ORDERS_COL_ID } from "@/lib/appwrite-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Código de rastreio é obrigatório" }, { status: 400 });
  }

  try {
    const res = await adminDatabases.listDocuments(DB_ID, ORDERS_COL_ID, [
      Query.equal("trackingCode", code),
      Query.limit(1),
    ]);

    if (res.total === 0) {
      return NextResponse.json({ error: "Código de rastreio não encontrado" }, { status: 404 });
    }

    const order = res.documents[0] as any;

    return NextResponse.json({
      trackingCode: order.trackingCode,
      trackingStatus: order.trackingStatus,
      statusHistory: order.statusHistory ? JSON.parse(order.statusHistory) : [],
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      customerName: order.customerName,
    });
  } catch (error: any) {
    console.error("Erro ao buscar rastreio:", error);
    return NextResponse.json({ error: "Erro ao buscar rastreio." }, { status: 500 });
  }
}
