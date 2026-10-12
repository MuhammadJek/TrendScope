"use client";

import { useState } from "react";
import { Package } from "lucide-react";

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-slate-300 dark:text-slate-700 bg-slate-50 dark:bg-slate-900">
        <Package className="w-12 h-12" />
        <span className="text-xs mt-2">Gambar tidak tersedia</span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setError(true)}
    />
  );
}

