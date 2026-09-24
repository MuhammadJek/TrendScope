import { TrendingUp } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { TrendChart } from "@/components/charts";
import { DataSourceBadge } from "@/components/data-source-badge";
import { CategoryFilter, DateRangePicker, PlatformFilter } from "@/components/filters";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData, getRankedProducts } from "@/lib/services";

export default async function TrendsPage({ searchParams }: PageProps<"/trends">) {
  const params = await searchParams;
  const platform = typeof params.platform === "string" ? params.platform : "all";
  const category = typeof params.category === "string" ? params.category : "all";
  const range = typeof params.range === "string" ? params.range : "30d";
  const dashboard = await getDashboardData(platform);
  const ranked = await getRankedProducts(platform, category);
  const products = ranked.slice(0, 3);

  return (
    <AppFrame title="Trends">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Category Trend Explorer</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Trend cards and charts are based on demo metrics, not live market facts.</p>
        </div>
        <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[13rem_13rem_13rem_auto]">
          <DateRangePicker defaultValue={range} />
          <PlatformFilter defaultValue={platform} />
          <CategoryFilter defaultValue={category} />
          <Button type="submit" className="self-end">Update</Button>
        </form>
        <Card>
          <CardHeader>
            <CardTitle>Demo trend line</CardTitle>
            <CardDescription>Selectable filters narrow local records where practical; the series remains synthetic.</CardDescription>
          </CardHeader>
          <CardContent><TrendChart data={dashboard.trendSeries} /></CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {dashboard.categoryShares.slice(0, 3).map((categoryShare) => (
            <Card key={categoryShare.name}>
              <CardHeader>
                <TrendingUp className="h-5 w-5 text-teal-700" aria-hidden="true" />
                <CardTitle>{categoryShare.name}</CardTitle>
                <CardDescription>{categoryShare.value}% share of local demo signals over {range}.</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <section>
          <div className="mb-4 flex items-center gap-2">
            {platform !== "all" ? <DataSourceBadge platform={platform as never} /> : null}
            <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Trending demo products</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
