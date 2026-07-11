import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SHOP_DOMAIN = "viscare-2.myshopify.com";
const JUDGEME_TOKEN = process.env.JUDGEME_PUBLIC_TOKEN;

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  const debug = req.nextUrl.searchParams.get("debug") === "1";

  if (!productId) return NextResponse.json({ reviews: [], rating: 0, total: 0 });

  if (!JUDGEME_TOKEN) {
    return NextResponse.json({ reviews: [], rating: 0, total: 0, error: "JUDGEME_PUBLIC_TOKEN não configurado" });
  }

  const url = `https://judge.me/api/v1/reviews?api_token=${JUDGEME_TOKEN}&shop_domain=${SHOP_DOMAIN}&product_id=${productId}&per_page=30`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    if (debug) {
      return NextResponse.json({ status: res.status, url, raw: text.slice(0, 2000) });
    }

    if (!res.ok) return NextResponse.json({ reviews: [], rating: 0, total: 0, httpStatus: res.status });

    const data = JSON.parse(text);
    const reviews: any[] = data.reviews ?? [];
    const total = reviews.length;
    const rating = total > 0
      ? Math.round((reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / total) * 10) / 10
      : 0;

    const formatted = reviews.map((r: any) => ({
      id: r.id,
      author: r.reviewer?.name ?? "Cliente",
      rating: r.rating ?? 5,
      title: r.title ?? "",
      body: r.body ?? "",
      createdAt: r.created_at ?? "",
      pictures: (r.pictures ?? []).map((p: any) => p.urls?.compact ?? p.urls?.small ?? ""),
    }));

    return NextResponse.json({ reviews: formatted, rating, total });
  } catch (e: any) {
    return NextResponse.json({ reviews: [], rating: 0, total: 0, error: e.message });
  }
}
