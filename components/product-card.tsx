import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DataFreshnessIndicator } from "@/components/data-freshness-indicator";
import { DataSourceBadge } from "@/components/data-source-badge";
import { DataStatusBadge } from "@/components/data-status-badge";
import { ProductThumb } from "@/components/product-thumb";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <ProductThumb product={product} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${product.slug}`} className="text-base font-semibold text-slate-950 hover:text-teal-700 dark:text-slate-50 dark:hover:text-teal-300">
              {product.title}
            </Link>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
          </div>
          <Link href={`/products/${product.slug}`} aria-label={`View ${product.title}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <DataSourceBadge platform={product.sourcePlatform} />
          <DataStatusBadge status={product.dataStatus} />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Price</dt>
            <dd className="mt-1 font-semibold text-slate-950 dark:text-slate-50">{formatCurrency(product.price)}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">{product.metricName}</dt>
            <dd className="mt-1 font-semibold text-slate-950 dark:text-slate-50">
              {formatNumber(product.metricValue)} {product.metricValue === null ? "" : product.metricUnit}
            </dd>
          </div>
        </dl>
        <div className="mt-5">
          <DataFreshnessIndicator capturedAt={product.capturedAt} />
        </div>
      </CardContent>
    </Card>
  );
}
