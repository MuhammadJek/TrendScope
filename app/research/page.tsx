import { AppFrame } from "@/components/app-frame";
import { TrendSearchClient } from "./trend-search-client";

export const metadata = {
  title: "Trend Research — TrendScope",
  description: "Riset tren topik menggunakan data Wikipedia Pageviews.",
};

export default function ResearchPage() {
  return (
    <AppFrame title="Trend Research">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">
            Trend Research
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Cari dan analisis tingkat minat publik terhadap topik atau kata kunci menggunakan
            data Wikipedia Pageviews yang real-time.
          </p>
        </div>
        <TrendSearchClient />
      </div>
    </AppFrame>
  );
}
