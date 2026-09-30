import { Activity, Download, Search, TrendingUp, AlertTriangle } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { DateRangePicker, PlatformFilter } from "@/components/filters";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiKeywordTrendChart, TopCompetitorsTable } from "@/components/mock-market-charts";

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const params = await searchParams;
  const platform = typeof params.platform === "string" ? params.platform : "shopee";
  const range = typeof params.range === "string" ? params.range : "30d";

  // Mock Market KPI Data
  const marketKpis = [
    { label: "Total Keyword Search Vol", value: "85.2K", change: 12.5, isPositive: true },
    { label: "Avg Competitor Price", value: "Rp 210K", change: -5.2, isPositive: false },
    { label: "Market Demand Spike", value: "+300%", change: 300, isPositive: true },
    { label: "Tracked Keywords", value: "2", change: 0, isPositive: true },
  ];
  const icons = [Search, Activity, TrendingUp, Activity];

  return (
    <AppFrame title="Market Intelligence Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Market Intelligence</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Analisis permintaan pasar, tren pencarian, dan pergerakan kompetitor di E-Commerce.
            </p>
          </div>
          <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-[12rem_12rem_auto]">
            <DateRangePicker defaultValue={range} />
            <PlatformFilter defaultValue={platform} />
            <Button type="submit" className="self-end">Apply</Button>
          </form>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Simulasi Market Intelligence</h3>
            <p className="text-sm mt-1 opacity-90">
              Ini adalah tampilan *Proof of Concept* untuk fitur E-Commerce Market Analytics. 
              Data yang ditampilkan di bawah ini adalah data simulasi (Mock Data). API Integrasi untuk Shopee dan database sedang dalam tahap pengembangan (Arsitektur Queue & Proxy).
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketKpis.map((kpi, index) => (
            <KpiCard key={kpi.label} {...kpi} icon={icons[index]} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Demand Trend (Shopee)</CardTitle>
              <CardDescription>Perbandingan volume pencarian dan permintaan pasar antara 2 kata kunci.</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiKeywordTrendChart />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Top Winning Products (Market Benchmark)</CardTitle>
              <CardDescription>
                Produk kompetitor yang menguasai kata kunci "Sepatu Lari" dengan tingkat penjualan tertinggi bulan ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <TopCompetitorsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
