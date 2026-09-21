import { AppFrame } from "@/components/app-frame";
import { CategoryFilter, PlatformFilter } from "@/components/filters";
import { MethodologyDialog } from "@/components/methodology-dialog";
import { RankingTable } from "@/components/ranking-table";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRankedProducts } from "@/lib/services";

export default async function RankingsPage({ searchParams }: PageProps<"/rankings">) {
  const params = await searchParams;
  const platform = typeof params.platform === "string" ? params.platform : "all";
  const category = typeof params.category === "string" ? params.category : "all";
  const products = getRankedProducts(platform, category);

  return (
    <AppFrame title="Rankings">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Rankings</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Platform and category rankings based on available demo metrics.</p>
          </div>
          <MethodologyDialog />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Comparability note</CardTitle>
            <CardDescription>Cross-platform ranking is only displayed as a sorted demo view. It is not a claim that marketplace rank, retail price signals, and creator engagement are directly comparable.</CardDescription>
          </CardHeader>
        </Card>
        <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[14rem_14rem_auto]">
          <PlatformFilter defaultValue={platform} />
          <CategoryFilter defaultValue={category} />
          <Button type="submit" className="self-end">Apply</Button>
        </form>
        <RankingTable products={products} />
      </div>
    </AppFrame>
  );
}
