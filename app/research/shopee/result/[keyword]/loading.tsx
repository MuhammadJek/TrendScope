import { AppFrame } from "@/components/app-frame";
import { Loader2, ShoppingBag } from "lucide-react";

export default function Loading() {
  return (
    <AppFrame title="Shopee Market Research">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        {/* Header Skeleton */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#EE4D2D]/10 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-[#EE4D2D]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hasil Riset Shopee
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[#EE4D2D]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Sedang mengambil data dari Shopee (proses ini membutuhkan waktu 10-20 detik)...</span>
          </div>
        </div>

        {/* Statistik Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 h-24 animate-pulse"></div>
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-slate-100 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[400px] animate-pulse"
            >
              <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800/50"></div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded w-2/3"></div>
                <div className="mt-auto h-8 bg-slate-200 dark:bg-slate-800/50 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppFrame>
  );
}
