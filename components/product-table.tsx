import Link from "next/link";
import { DataSourceBadge } from "@/components/data-source-badge";
import { DataStatusBadge } from "@/components/data-status-badge";
import { ProductThumb } from "@/components/product-thumb";
import type { Product } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((product) => (
              <tr key={product.slug}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <ProductThumb product={product} compact />
                    <div>
                      <Link href={`/products/${product.slug}`} className="font-semibold text-slate-950 hover:text-teal-700 dark:text-slate-50">
                        {product.title}
                      </Link>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4"><DataSourceBadge platform={product.sourcePlatform} /></td>
                <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                  {product.metricName}: <strong>{formatNumber(product.metricValue)}</strong>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-950 dark:text-slate-50">{formatCurrency(product.price)}</td>
                <td className="px-4 py-4"><DataStatusBadge status={product.dataStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
