import { Activity, Database, Layers3, PackageSearch } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { CategoryDistributionChart, ProductRankingChart, TrendChart } from "@/components/charts";
import { DataSourceBadge } from "@/components/data-source-badge";
import { DemoDataBanner } from "@/components/demo-data-banner";
import { DateRangePicker, PlatformFilter } from "@/components/filters";
import { KpiCard } from "@/components/kpi-card";
import { ProductTable } from "@/components/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/services";

const icons = [PackageSearch, Layers3, Database, Activity];

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const params = await searchParams;
  const platform = typeof params.platform === "string" ? params.platform : "all";
  const range = typeof params.range === "string" ? params.range : "30d";
  const dashboard = await getDashboardData(platform);

  return (
    <AppFrame title="Analytics Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Analytics Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Monitor demo product movement, source health, and available metrics.</p>
          </div>
          <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-[12rem_12rem_auto]">
            <DateRangePicker defaultValue={range} />
            <PlatformFilter defaultValue={platform} />
            <Button type="submit" className="self-end">Apply</Button>
          </form>
        </div>

        <DemoDataBanner />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboard.kpis.map((kpi, index) => (
            <KpiCard key={kpi.label} {...kpi} icon={icons[index]} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <Card>
            <CardHeader>
              <CardTitle>Trend overview</CardTitle>
              <CardDescription>Demo source activity by platform. Date range selector is prototype-scoped.</CardDescription>
            </CardHeader>
            <CardContent><TrendChart data={dashboard.trendSeries} /></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Category distribution</CardTitle>
              <CardDescription>Normalized share of tracked demo records.</CardDescription>
            </CardHeader>
            <CardContent><CategoryDistributionChart data={dashboard.categoryShares} /></CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Product ranking sample</CardTitle>
              <CardDescription>Sorted by available demo metric values.</CardDescription>
            </CardHeader>
            <CardContent><ProductRankingChart products={dashboard.products} /></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Source health</CardTitle>
              <CardDescription>Freshness and data volume are sample records for the prototype.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.sourceHealth.map((source) => (
                <div key={source.source} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <DataSourceBadge platform={source.source} />
                    <p className="mt-2 text-sm text-slate-500">{source.records} demo records / refreshed {source.freshness} ago</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">{source.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent product activity</CardTitle>
            <CardDescription>Latest captured demo records, with unavailable fields preserved.</CardDescription>
          </CardHeader>
          <CardContent><ProductTable products={dashboard.products.slice(0, 5)} /></CardContent>
        </Card>
      </div>
    </AppFrame>
  );
}
