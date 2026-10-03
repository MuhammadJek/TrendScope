"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMarketInsight } from "@/lib/ai-insights";

interface AiInsightCardProps {
  keyword: string;
  platform: string;
  products: Array<{
    title: string;
    price: number;
    historicalSold: number;
    monthlySold: number;
  }>;
  avgPrice: number;
  totalProducts: number;
}

export function AiInsightCard({
  keyword,
  platform,
  products,
  avgPrice,
  totalProducts,
}: AiInsightCardProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    const result = await generateMarketInsight(
      keyword,
      platform,
      products,
      avgPrice,
      totalProducts
    );

    if (result.success && result.insight) {
      setInsight(result.insight);
    } else {
      setError(result.error || "Terjadi kesalahan.");
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-purple-200 dark:border-purple-900/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-b border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Market Intelligence</CardTitle>
              <CardDescription>
                Analisis strategi otomatis oleh Gemini AI berdasarkan data kompetitor
              </CardDescription>
            </div>
          </div>
          {insight && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!insight && !isLoading && !error && (
          <div className="text-center py-8">
            <Sparkles className="mx-auto h-10 w-10 text-purple-300 dark:text-purple-700 mb-4" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Siap Menganalisis {totalProducts} Produk Kompetitor
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              AI akan menganalisis pola harga, tren penjualan, dan memberikan
              rekomendasi strategi bisnis berdasarkan data real-time.
            </p>
            <Button onClick={handleGenerate} disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Insight
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-8 w-8 text-purple-500 animate-spin mb-4" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gemini AI sedang menganalisis {products.length} produk kompetitor...
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Biasanya membutuhkan 5-15 detik
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={handleGenerate}
            >
              Coba Lagi
            </Button>
          </div>
        )}

        {insight && !isLoading && (
          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_strong]:text-slate-900 dark:[&_strong]:text-slate-100 [&_li]:text-slate-600 dark:[&_li]:text-slate-400 [&_p]:text-slate-600 dark:[&_p]:text-slate-400">
            <div
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(insight),
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Converter Markdown sederhana ke HTML
 * (tanpa perlu tambah library)
 */
function markdownToHtml(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br/>');

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<br\/>?\s*(<li>.*?<\/li>))*/g, (match) => {
    return '<ul>' + match.replace(/<br\/?>/g, '') + '</ul>';
  });

  return '<p>' + html + '</p>';
}
