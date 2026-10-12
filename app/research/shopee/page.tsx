import Link from "next/link";
import { AppFrame } from "@/components/app-frame";
import { ShoppingBag, ArrowRight, ArrowLeft, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Shopee Analytics (Deactivated) - TrendScope",
  description: "Fitur Shopee Analytics sedang dinonaktifkan sementara untuk pemeliharaan sistem.",
};

export default function ShopeeLandingPage() {
  return (
    <AppFrame title="Shopee Analytics">
      <div className="max-w-3xl mx-auto py-16 px-4 flex flex-col items-center text-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 mb-6 shadow-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>Fitur Dinonaktifkan Sementara (Maintenance)</span>
        </div>

        {/* Icon Container */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/80 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-1.5 text-white ring-4 ring-white dark:ring-slate-950">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          Shopee Analytics Sedang Dinonaktifkan
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mb-8 leading-relaxed">
          Modul riset dan scraper Shopee sedang dinonaktifkan sementara untuk pembaruan sistem dan integrasi data. Silakan gunakan modul analitik e-commerce lainnya yang aktif saat ini.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button href="/research/amazon" size="lg" className="w-full sm:w-auto gap-2">
            Buka Amazon Analytics
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/dashboard" variant="outline" size="lg" className="w-full sm:w-auto gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Button>
        </div>

        {/* Alternative Platforms Cards */}
        <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border-t border-slate-200 dark:border-slate-800 pt-8">
          <Link
            href="/research/amazon"
            className="group rounded-2xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Amazon Analytics
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lacak volume pencarian, harga kompetitor, dan estimasi penjualan real-time di Amazon.
            </p>
          </Link>

          <Link
            href="/research/etsy"
            className="group rounded-2xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Etsy Analytics
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analisis pasar handmade, digital craft, dan print-on-demand dengan data langsung.
            </p>
          </Link>
        </div>

      </div>
    </AppFrame>
  );
}
