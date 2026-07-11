import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SHOP_DOMAIN = "viscare-2.myshopify.com";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ reviews: [], rating: 0, total: 0 });

  try {
    const res = await fetch(
      `https://judge.me/api/v1/reviews?api_token=PUBLIC&shop_domain=${SHOP_DOMAIN}&product_id=${productId}&per_page=30`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return NextResponse.json({ reviews: [], rating: 0, total: 0 });

    const data = await res.json();
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
  } catch {
    return NextResponse.json({ reviews: [], rating: 0, total: 0 });
  }
}
