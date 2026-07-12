import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Unofficial Google Translate endpoint — no API key required.
// Translates an array of texts to the target language in a single call per text.
async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return text;
  const data = await res.json();
  // data[0] = array of [translatedSegment, originalSegment] pairs
  return (data[0] as [string, string][]).map(([seg]) => seg).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { texts, targetLang } = (await req.json()) as { texts: string[]; targetLang: string };
    if (!texts?.length || !targetLang) {
      return NextResponse.json({ translations: texts ?? [] });
    }
    const translations = await Promise.all(texts.map((t) => translateText(t, targetLang)));
    return NextResponse.json({ translations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
