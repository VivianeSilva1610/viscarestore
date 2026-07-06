import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = "viscareelojavirtual1610";

export async function GET() {
  try {
    const res = await fetch(`${ENDPOINT}/health`, {
      headers: {
        "X-Appwrite-Project": PROJECT_ID,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      appwrite: data,
      pingedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err), pingedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
