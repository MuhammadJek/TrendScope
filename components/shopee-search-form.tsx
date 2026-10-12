"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ShopeeSearchForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form 
      action="/research/shopee/result"
      method="GET"
      onSubmit={(e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const query = formData.get("q") as string;
        if (query.trim()) {
          router.push(`/research/shopee/result/${encodeURIComponent(query.trim())}`);
        } else {
          setIsLoading(false);
        }
      }}
      className="w-full max-w-xl relative"
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input 
        type="search"
        name="q"
        placeholder="Cari tren produk atau kata kunci Shopee..."
        className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-[#EE4D2D] focus:ring-0 outline-none text-lg transition-colors"
        autoComplete="off"
        required
        disabled={isLoading}
      />
      <button 
        type="submit"
        disabled={isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-[#EE4D2D] hover:bg-[#D74427] text-white font-medium rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Mencari..." : "Analisis"}
      </button>
    </form>
  );
}

