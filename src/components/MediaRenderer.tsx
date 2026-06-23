"use client";

import React, { useState } from "react";

export default function MediaRenderer({ src, alt, className, showBadge = false }: { src: string, alt: string, className?: string, showBadge?: boolean }) {
  const [isError, setIsError] = useState(false);

  if (isError) {
    return (
      <>
        <img src={src} alt={alt} className={className} />
        {showBadge && <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">Imagem</div>}
      </>
    );
  }

  return (
    <>
      <video
        src={src}
        className={className}
        controls
        preload="metadata"
        controlsList="nodownload"
        onError={() => setIsError(true)}
      />
      {showBadge && <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">Vídeo</div>}
    </>
  );
}
