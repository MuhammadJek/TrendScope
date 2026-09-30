"use client";

import { useState } from "react";
import { Search, Plus, Loader2, TrendingUp, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackKeywordAction } from "@/lib/market-actions";

interface MarketSearchClientProps {
  initialKeywords: Array<{ id: string; keyword: string; platform: string; lastUpdated: Date }>;
  activePlatform: string;
}

export function MarketSearchClient({ initialKeywords, activePlatform }: MarketSearchClientProps) {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState(initialKeywords);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    const result = await trackKeywordAction(keyword, activePlatform);
    
    if (result.success && result.keyword) {
      const exists = keywords.find(k => k.id === result.keyword!.id);
      if (!exists) {
        setKeywords([result.keyword, ...keywords]);
      }
      setKeyword("");
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  const colorClass = 
    activePlatform === 'SHOPEE' ? 'bg-orange-500' : 
    activePlatform === 'AMAZON' ? 'bg-amber-400' : 'bg-green-500';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mulai Lacak Kata Kunci</CardTitle>
          <CardDescription>
            Masukkan kata kunci produk untuk dipantau oleh sistem setiap harinya di {activePlatform}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`Contoh pencarian di ${activePlatform}...`}
                className="pl-9"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !keyword.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Track di {activePlatform}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {keywords.map((k) => (
          <Card key={k.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`}></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg capitalize">{k.keyword}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    {k.platform}
                  </CardDescription>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin-slow" />
                  Processing
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Data sedang dikumpulkan oleh background worker...
              </div>
            </CardContent>
          </Card>
        ))}

        {keywords.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
            <TrendingUp className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
              Belum ada kata kunci di {activePlatform}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Tambahkan kata kunci di atas untuk mulai melacak pasar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
