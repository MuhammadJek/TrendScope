import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { ProductHistoryChart } from "@/components/charts";
import { DataSourceBadge } from "@/components/data-source-badge";
import { DataStatusBadge } from "@/components/data-status-badge";
import { DemoDataBanner } from "@/components/demo-data-banner";
import { ProductCard } from "@/components/product-card";
import { ProductThumb } from "@/components/product-thumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductBySlug, getProductTrend, getProducts, getRelatedProducts } from "@/lib/services";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);
  const history = getProductTrend(product);

  return (
    <AppFrame title={product.title}>
      <div className="space-y-6">
        <DemoDataBanner />
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <ProductThumb product={product} />
            <Card>
              <CardHeader>
                <CardTitle>Data provenance</CardTitle>
                <CardDescription>Source, collection timestamp, metric definition, and status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <Provenance label="Source" value={product.sourceReference} />
                <Provenance label="Captured at" value={new Date(product.capturedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
                <Provenance label="Metric definition" value={`${product.metricName} (${product.metricType})`} />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Data status</span>
                  <DataStatusBadge status={product.dataStatus} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <DataSourceBadge platform={product.sourcePlatform} />
                  <DataStatusBadge status={product.dataStatus} />
                </div>
                <CardTitle className="text-3xl">{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Metric label="Price" value={formatCurrency(product.price)} />
                  <Metric label={product.metricName} value={`${formatNumber(product.metricValue)}${product.metricValue === null ? "" : ` ${product.metricUnit}`}`} />
                  <Metric label="Author" value={product.author ?? "Unavailable"} />
                </div>
                <Button className="mt-6" href={product.externalUrl} variant="secondary">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Source reference
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Historical demo trend</CardTitle>
                <CardDescription>Time-series is generated from local demo data and is not a real market fact.</CardDescription>
              </CardHeader>
              <CardContent><ProductHistoryChart data={history} /></CardContent>
            </Card>
          </div>
        </div>
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-950 dark:text-slate-50">Related products</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-950 dark:text-slate-50">{value}</p>
    </div>
  );
}

function Provenance({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 dark:border-slate-800">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-xs text-right font-medium text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}
