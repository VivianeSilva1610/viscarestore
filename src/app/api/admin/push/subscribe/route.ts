import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import { adminDatabases, DB_ID, PUSH_SUBSCRIPTIONS_COL_ID } from "@/lib/appwrite-admin";

export async function POST(req: Request) {
  try {
    const sub = await req.json();
    const endpoint = sub?.endpoint;
    const p256dh = sub?.keys?.p256dh;
    const auth = sub?.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: "Inscrição inválida." }, { status: 400 });
    }

    const existing = await adminDatabases.listDocuments(DB_ID, PUSH_SUBSCRIPTIONS_COL_ID, [
      Query.equal("endpoint", endpoint),
    ]);
    if (existing.total === 0) {
      await adminDatabases.createDocument(DB_ID, PUSH_SUBSCRIPTIONS_COL_ID, ID.unique(), {
        endpoint,
        p256dh,
        auth,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao salvar inscrição push:", error);
    return NextResponse.json({ error: error.message || "Erro ao salvar inscrição." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: "endpoint é obrigatório" }, { status: 400 });
    }

    const existing = await adminDatabases.listDocuments(DB_ID, PUSH_SUBSCRIPTIONS_COL_ID, [
      Query.equal("endpoint", endpoint),
    ]);
    for (const doc of existing.documents) {
      await adminDatabases.deleteDocument(DB_ID, PUSH_SUBSCRIPTIONS_COL_ID, doc.$id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao remover inscrição push:", error);
    return NextResponse.json({ error: error.message || "Erro ao remover inscrição." }, { status: 500 });
  }
}
