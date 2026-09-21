import Link from "next/link";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { DataStatusBadge } from "@/components/data-status-badge";
import type { Product } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function RankingTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Available metric</th>
              <th className="px-4 py-3">Change</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((product, index) => {
              const ChangeIcon = product.change === null ? Minus : product.change >= 0 ? ArrowUp : ArrowDown;
              return (
                <tr key={product.slug}>
                  <td className="px-4 py-4 font-semibold text-slate-950 dark:text-slate-50">#{index + 1}</td>
                  <td className="px-4 py-4">
                    <Link href={`/products/${product.slug}`} className="font-semibold text-slate-950 hover:text-teal-700 dark:text-slate-50">
                      {product.title}
                    </Link>
                    <p className="text-xs text-slate-500">{product.sourcePlatform} / {product.category}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                    {product.metricValue === null ? "Insufficient data" : `${formatNumber(product.metricValue)} ${product.metricUnit}`}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <ChangeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {product.change === null ? "N/A" : Math.abs(product.change)}
                    </span>
                  </td>
                  <td className="px-4 py-4"><DataStatusBadge status={product.dataStatus} /></td>
                  <td className="px-4 py-4 text-slate-500">{new Date(product.capturedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
