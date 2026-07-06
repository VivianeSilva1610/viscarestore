"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "pt" | "it";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "pt",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  const persistLang = (lang: Language) => {
    localStorage.setItem("viscaree_lang", lang);
    // Cookie read by server components (collection pages)
    document.cookie = `viscaree_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  // Load language from localStorage or detect via timezone on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("viscaree_lang") as Language;
    if (savedLang && (savedLang === "pt" || savedLang === "it")) {
      setLanguage(savedLang);
      persistLang(savedLang);
    } else {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const detected: Language = tz && tz.startsWith("Europe") ? "it" : "pt";
        setLanguage(detected);
        persistLang(detected);
      } catch {
        setLanguage("pt");
        persistLang("pt");
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    persistLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
