import { BarChart3, Package, ShoppingBag, Video } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorClasses = {
  teal: "bg-teal-50 text-teal-700 border-teal-100",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

export function ProductThumb({ product, compact = false }: { product: Product; compact?: boolean }) {
  const Icon =
    product.sourcePlatform === "TikTok" ? Video : product.sourcePlatform === "E-Commerce" ? ShoppingBag : Package;

  return (
    <div className={cn("relative overflow-hidden rounded-xl border", colorClasses[product.color], compact ? "h-14 w-14" : "aspect-[4/3] w-full")}>
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <Icon className="h-5 w-5" aria-hidden="true" />
        <BarChart3 className="h-5 w-5 opacity-60" aria-hidden="true" />
      </div>
      <div className="absolute inset-x-4 bottom-4 space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-current opacity-20" />
        <div className="grid grid-cols-4 items-end gap-1">
          {[34, 62, 48, 78].map((height, index) => (
            <span key={index} className="rounded-t-sm bg-current opacity-30" style={{ height: compact ? height / 5 : height / 3 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
