import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VisCaree | Alta Perfumaria, Skincare & Curadoria de Luxo",
  description: "Fórmulas que vestem a pele, essências que revelam a alma. Descubra a seleção exclusiva de alta perfumaria, cosméticos e moda premium da VisCaree.",
  keywords: "perfume de luxo, skincare premium, vestidos de seda, moda minimalista, alta perfumaria, viscaree, aura",
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorantGaramond.variable} ${montserrat.variable} h-full antialiasedScroll`}
    >
      <body className="min-h-full flex flex-col bg-[#F1E7E2] text-neutral-800 font-sans-premium overflow-x-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
