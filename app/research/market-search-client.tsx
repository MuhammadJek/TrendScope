"use client";

import { useState } from "react";
import { Search, Plus, Loader2, TrendingUp, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackKeywordAction } from "@/lib/market-actions";
import { Tabs } from "@/components/ui/tabs";

interface MarketSearchClientProps {
  initialKeywords: Array<{ id: string; keyword: string; platform: string; lastUpdated: Date }>;
}

export function MarketSearchClient({ initialKeywords }: MarketSearchClientProps) {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState(initialKeywords);

  const TABS = [
    { id: "SHOPEE", label: "Shopee" },
    { id: "AMAZON", label: "Amazon" },
    { id: "ENVATO", label: "Envato" }
  ];

  const handleTrack = async (e: React.FormEvent, activePlatform: string) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    const result = await trackKeywordAction(keyword, activePlatform);
    
    if (result.success && result.keyword) {
      // Optimistic update
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

  return (
    <div className="space-y-6">
      <Tabs tabs={TABS} defaultTab="SHOPEE">
        {(activeTab) => {
          // Filter keywords by active tab
          const platformKeywords = keywords.filter(k => k.platform === activeTab);

          return (
            <div className="space-y-6">
              {/* Input Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Riset Pasar {TABS.find(t => t.id === activeTab)?.label}</CardTitle>
                  <CardDescription>
                    Lacak kata kunci atau produk spesifik di ekosistem {TABS.find(t => t.id === activeTab)?.label}. Sistem akan memonitor pergerakannya setiap hari.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleTrack(e, activeTab)} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder={`Cari tren produk di ${TABS.find(t => t.id === activeTab)?.label}...`}
                        className="pl-9"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading || !keyword.trim()}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Mulai Lacak
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Keywords List */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {platformKeywords.map((k) => (
                  <Card key={k.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      activeTab === 'SHOPEE' ? 'bg-orange-500' : 
                      activeTab === 'AMAZON' ? 'bg-amber-400' : 'bg-green-500'
                    }`}></div>
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

                {platformKeywords.length === 0 && (
                  <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
                    <TrendingUp className="mx-auto h-8 w-8 text-slate-400" />
                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                      Belum ada kata kunci di {TABS.find(t => t.id === activeTab)?.label}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Tambahkan kata kunci di atas untuk mulai melacak pasar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
