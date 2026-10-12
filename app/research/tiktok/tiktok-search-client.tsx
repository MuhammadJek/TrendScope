"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TiktokSearchClient() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    const cleanKeyword = keyword.replace(/^#/, "").trim();
    router.push(`/research/tiktok/result/${encodeURIComponent(cleanKeyword)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="relative flex items-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-slate-400 dark:focus-within:ring-slate-500 transition-all shadow-sm">
          <div className="pl-4 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={isLoading}
            placeholder="Ketik kata kunci atau hashtag..."
            className="flex-1 bg-transparent border-none focus:outline-none py-3 text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <Button 
            type="submit"
            disabled={!keyword.trim() || isLoading}
            className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 font-medium transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Analisis"
            )}
          </Button>
        </div>
      </form>

      {/* Tautan Pencarian Cepat */}
      <div className="mt-8 flex flex-col items-center space-y-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">Pencarian Populer:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["skincareviral", "sepatulokal", "outfitbukber", "reviewgadget"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setKeyword(tag);
                setIsLoading(true);
                router.push(`/research/tiktok/result/${encodeURIComponent(tag)}`);
              }}
              type="button"
              className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

