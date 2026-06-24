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

  // Load language from localStorage or detect via timezone on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("viscaree_lang") as Language;
    if (savedLang && (savedLang === "pt" || savedLang === "it")) {
      setLanguage(savedLang);
    } else {
      try {
        // Use timezone to detect if user is in Europe or Brazil (Americas)
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && tz.startsWith("Europe")) {
          setLanguage("it");
        } else {
          setLanguage("pt");
        }
      } catch (e) {
        setLanguage("pt");
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("viscaree_lang", lang);
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
