"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface PageDoc {
  title: string;
  content: string;
  title_it?: string;
  content_it?: string;
}

export default function InstitutionalContent({ page }: { page: PageDoc }) {
  const { language } = useLanguage();
  const isPt = language === "pt";

  const title = isPt ? page.title : (page.title_it || page.title);
  const content = isPt ? page.content : (page.content_it || page.content);

  return (
    <>
      <header className="mb-12 text-center">
        <h1 className="font-serif-premium text-3xl md:text-4xl text-neutral-900 mb-4">{title}</h1>
        <div className="w-12 h-0.5 bg-dourado-suave mx-auto"></div>
      </header>

      <article className="prose prose-neutral prose-sm md:prose-base max-w-none prose-headings:font-serif-premium prose-headings:font-normal prose-a:text-dourado-suave hover:prose-a:text-dourado-suave/80 prose-p:font-sans-premium prose-p:font-light prose-p:leading-relaxed prose-p:text-neutral-600">
        {content.split('\n').map((paragraph: string, index: number) => {
          if (!paragraph.trim()) return <br key={index} />;
          return <p key={index} className="mb-4">{paragraph}</p>;
        })}
      </article>
    </>
  );
}
