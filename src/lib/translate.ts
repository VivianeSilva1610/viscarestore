// Maps our site language codes to BCP-47 codes for Google Translate
const LANG_MAP: Record<string, string> = {
  pt: "pt",
  it: "it",
};

export async function translateTexts(texts: string[], language: string): Promise<string[]> {
  const targetLang = LANG_MAP[language] ?? language;
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang }),
    });
    if (!res.ok) return texts;
    const data = await res.json();
    return data.translations ?? texts;
  } catch {
    return texts;
  }
}
