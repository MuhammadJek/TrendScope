import { AppFrame } from "@/components/app-frame";
import { MarketSearchClient } from "./market-search-client";
import { getTrackedKeywords } from "@/lib/market-actions";

export const metadata = {
  title: "Market Keyword Tracker - TrendScope",
  description: "Lacak tren kata kunci produk di E-Commerce.",
};

export default async function ResearchPage() {
  const keywords = await getTrackedKeywords();

  return (
    <AppFrame title="Keyword Tracker">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">
            Keyword Tracker
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Masukkan kata kunci atau nama produk. Sistem kami akan secara otomatis melacak pergerakan harga, kompetisi, dan estimasi penjualan di E-Commerce setiap harinya.
          </p>
        </div>
        
        <MarketSearchClient initialKeywords={keywords} />
      </div>
    </AppFrame>
  );
}
