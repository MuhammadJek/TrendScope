"use client";

import { useMemo } from "react";
import { 
  Building2, 
  ShieldAlert, 
  CheckCircle, 
  Award,
  AlertCircle,
  TrendingUp,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketConcentrationMatrixProps {
  products: any[];
  platform: string;
}

export function MarketConcentrationMatrix({
  products = [],
  platform,
}: MarketConcentrationMatrixProps) {
  const { brandShares, top3Share, top10Share, hhiScore, marketType } = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        brandShares: [
          { name: "Brand Alpha (Leader)", sold: 4200, share: 36, isLeader: true },
          { name: "Apex Goods", sold: 2100, share: 18 },
          { name: "Urban Crafted", sold: 1600, share: 14 },
          { name: "Prime Basics", sold: 1100, share: 9 },
          { name: "Others (32 Sellers)", sold: 2700, share: 23 },
        ],
        top3Share: 68,
        top10Share: 89,
        hhiScore: 2150,
        marketType: "MODERATELY_CONCENTRATED" as const,
      };
    }

    const brandMap: Record<string, number> = {};
    let totalSales = 0;

    products.forEach((p) => {
      const sold = p.historicalSold || p.monthlySold || p.sold || 50;
      totalSales += sold;
      const titleWords = (p.title || p.name || "Generic Seller").trim().split(" ");
      const brandName = titleWords.slice(0, 2).join(" ");
      brandMap[brandName] = (brandMap[brandName] || 0) + sold;
    });

    if (totalSales === 0) totalSales = 1000;

    const sortedBrands = Object.entries(brandMap)
      .map(([name, sold]) => ({
        name,
        sold,
        share: Math.max(1, Math.round((sold / totalSales) * 100)),
      }))
      .sort((a, b) => b.sold - a.sold);

    const top5 = sortedBrands.slice(0, 5);
    const top3 = sortedBrands.slice(0, 3);
    const top10 = sortedBrands.slice(0, 10);

    const top3Share = top3.reduce((sum, b) => sum + b.share, 0);
    const top10Share = top10.reduce((sum, b) => sum + b.share, 0);

    const hhi = sortedBrands.reduce((sum, b) => sum + Math.pow(b.share, 2), 0);

    let type: "FRAGMENTED" | "MODERATELY_CONCENTRATED" | "HIGHLY_MONOPOLISTIC" = "MODERATELY_CONCENTRATED";
    if (hhi < 1500) type = "FRAGMENTED";
    else if (hhi > 2500) type = "HIGHLY_MONOPOLISTIC";

    return {
      brandShares: top5,
      top3Share: Math.min(100, top3Share),
      top10Share: Math.min(100, top10Share),
      hhiScore: Math.round(hhi),
      marketType: type,
    };
  }, [products]);

  const statusConfig = {
    FRAGMENTED: { 
      icon: CheckCircle, label: "Pasar Terbuka (Blue Ocean)", 
      bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
      iconColor: "text-emerald-500"
    },
    MODERATELY_CONCENTRATED: { 
      icon: AlertCircle, label: "Persaingan Kompetitif Sehat", 
      bgClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
      iconColor: "text-amber-500"
    },
    HIGHLY_MONOPOLISTIC: { 
      icon: ShieldAlert, label: "Oligopoli (Barrier Tinggi)", 
      bgClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
      iconColor: "text-rose-500"
    },
  };

  const status = statusConfig[marketType];
  const StatusIcon = status.icon;

  return (
    <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 p-2.5 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold">Market Concentration Matrix (HHI Index)</CardTitle>
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                  Monopoly Detector
                </span>
              </div>
              <CardDescription className="text-xs mt-1">
                Mengukur apakah pasar dikuasai segelintir raksasa (oligopoli) atau terfragmentasi terbuka untuk seller baru.
              </CardDescription>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 self-start sm:self-auto ${status.bgClass}`}>
            <StatusIcon className={`w-4 h-4 ${status.iconColor}`} />
            <span>{status.label}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Skor HHI Pasar", value: hhiScore.toLocaleString(), sub: "/ 10,000 max", detail: "Herfindahl-Hirschman Index", color: "text-slate-900 dark:text-white" },
            { label: "Top 3 Brand Share", value: `${top3Share}%`, sub: "Total Omzet", detail: "Pangsa 3 seller teratas", color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Top 10 Brand Share", value: `${top10Share}%`, sub: "Kolektif", detail: "Kekuatan 10 besar pasar", color: "text-slate-900 dark:text-white" },
            { label: "Peluang Penetrasi", value: top3Share < 50 ? "Tinggi" : "Sedang", sub: "Feasible", detail: "Kemudahan tembus Top 10", color: top3Share < 50 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400" },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                <span className="text-[10px] text-slate-500">{kpi.sub}</span>
              </div>
              <p className="text-[11px] text-slate-400">{kpi.detail}</p>
            </div>
          ))}
        </div>

        {/* HHI Visual Gauge Bar */}
        <div className="space-y-3 bg-slate-50/80 dark:bg-slate-900/40 rounded-xl p-5 border border-slate-100 dark:border-slate-800/80">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Terfragmentasi (&lt;1500)
            </span>
            <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
              Posisi: {hhiScore}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Monopoli (&gt;2500)
            </span>
          </div>
          
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative shadow-inner">
            <div className="w-[35%] bg-gradient-to-r from-emerald-400 to-emerald-500" title="Fragmented" />
            <div className="w-[30%] bg-gradient-to-r from-amber-400 to-amber-500" title="Moderate" />
            <div className="w-[35%] bg-gradient-to-r from-rose-400 to-rose-500" title="Monopolistic" />
            {/* Pointer Pin */}
            <div 
              className="absolute top-0 bottom-0 w-1.5 bg-slate-950 dark:bg-white shadow-lg z-10 transition-all duration-700 rounded-full"
              style={{ left: `${Math.min(98, Math.max(2, (hhiScore / 3500) * 100))}%` }}
            />
          </div>
        </div>

        {/* Brand Dominance Table */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Top 5 Brand Dominance Breakdown
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">Rank</th>
                  <th className="py-3 px-4 font-semibold">Brand / Dominant Seller</th>
                  <th className="py-3 px-4 font-semibold">Est. Terjual Bulanan</th>
                  <th className="py-3 px-4 font-semibold">Pangsa Pasar (%)</th>
                  <th className="py-3 px-4 font-semibold w-1/3">Visual Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {brandShares.map((brand, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold">Leader</span>}
                        <span className="truncate max-w-[180px]">{brand.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {brand.sold.toLocaleString()} unit
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {brand.share}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${idx === 0 ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-indigo-400/80"}`}
                          style={{ width: `${Math.min(100, brand.share * 1.8)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategic Takeaway */}
        <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/40 to-white dark:from-indigo-950/15 dark:to-slate-900/80 p-5 text-xs space-y-2">
          <strong className="text-indigo-900 dark:text-indigo-200 flex items-center gap-2 text-sm">
            🎯 Catatan Strategis Analis
          </strong>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {top3Share > 65 ? (
              <>
                Pasar ini didominasi oleh top brand teratas dengan <strong>{top3Share}% pangsa penjualan</strong>. Untuk bersaing, hindari meniru produk persis. Gunakan strategi diferensiasi tajam (warna, bundle, perbaikan kelemahan kompetitor) atau incar kata kunci turunan (<em>long-tail keywords</em>) dengan kompetisi iklan lebih murah.
              </>
            ) : (
              <>
                Pasar ini sangat terfragmentasi di mana top 3 brand hanya menguasai <strong>{top3Share}% pasar</strong>. Tidak ada satu pemain yang mendikte harga secara mutlak. Peluang emas bagi seller baru untuk masuk dan merebut pangsa pasar dengan branding yang rapi dan ulasan awal yang bagus.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
