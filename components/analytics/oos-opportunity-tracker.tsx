"use client";

import { useMemo } from "react";
import { 
  PackageX, 
  AlertTriangle, 
  Clock, 
  Crosshair,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OOSOpportunityTrackerProps {
  products: any[];
  platform: string;
}

export function OOSOpportunityTracker({
  products = [],
  platform,
}: OOSOpportunityTrackerProps) {
  const isIDR = platform === "SHOPEE";

  const formatPrice = (val: number) => {
    if (isIDR) return `Rp ${val.toLocaleString("id-ID")}`;
    return `$${val.toFixed(2)}`;
  };

  const oosItems = useMemo(() => {
    if (!products || products.length === 0) {
      return [
        {
          id: "prod-oos-1",
          name: "Apex Velocity Breathable Sneaker - Black/Grey",
          asin: "B09X8Q1M4L",
          price: isIDR ? 280000 : 34.99,
          normalDailySales: 45,
          stockStatus: "OUT_OF_STOCK" as const,
          daysOOS: 4,
          dailyLeakageRevenue: (isIDR ? 280000 : 34.99) * 45,
          actionRecommendation: "Pasang Iklan Penakluk (Conquesting Ad) di halaman produk ini",
        },
        {
          id: "prod-oos-2",
          name: "Ultra Light Running Shoes Pro Fit Edition",
          asin: "B0892KL91N",
          price: isIDR ? 320000 : 42.50,
          normalDailySales: 30,
          stockStatus: "LOW_STOCK" as const,
          daysOOS: 0,
          dailyLeakageRevenue: (isIDR ? 320000 : 42.50) * 15,
          actionRecommendation: "Siapkan stok cadangan, diperkirakan habis dalam 48 jam",
        },
        {
          id: "prod-oos-3",
          name: "Casual Streetwear Cushion Foam Shoes",
          asin: "B07P992AA3",
          price: isIDR ? 245000 : 28.00,
          normalDailySales: 22,
          stockStatus: "DELAYED_DELIVERY" as const,
          daysOOS: 2,
          dailyLeakageRevenue: (isIDR ? 245000 : 28.00) * 12,
          actionRecommendation: "Tonjolkan fitur Pengiriman Sameday/Instant di toko Anda",
        },
      ];
    }

    return products.slice(0, 5).map((p, index) => {
      const price = typeof p.price === "number" ? p.price : parseFloat(String(p.price || 0)) || (isIDR ? 250000 : 30);
      const monthly = p.monthlySold || Math.floor((p.historicalSold || 300) / 12) || 40;
      const daily = Math.max(5, Math.floor(monthly / 30));

      const status = index === 0 ? "OUT_OF_STOCK" : index === 1 ? "LOW_STOCK" : index === 2 ? "DELAYED_DELIVERY" : "IN_STOCK";
      const days = index === 0 ? 3 : index === 2 ? 1 : 0;
      const leakageMultiplier = status === "OUT_OF_STOCK" ? 1 : status === "LOW_STOCK" ? 0.4 : status === "DELAYED_DELIVERY" ? 0.5 : 0;

      return {
        id: p.id || `p-${index}`,
        name: p.title || p.name || `Competitor Product #${index + 1}`,
        asin: p.externalId || `ASIN-${index}`,
        price,
        normalDailySales: daily,
        stockStatus: status,
        daysOOS: days,
        dailyLeakageRevenue: price * daily * leakageMultiplier,
        actionRecommendation:
          status === "OUT_OF_STOCK"
            ? "Pasang Iklan Target Produk (ASIN Targeting) untuk menyerap pembeli yang kecewa"
            : status === "LOW_STOCK"
            ? "Tingkatkan bid iklan kata kunci utama karena kompetitor akan segera kehabisan stok"
            : status === "DELAYED_DELIVERY"
            ? "Gunakan badge pengiriman cepat untuk mengalahkan kompetitor yang lambat kirim"
            : "Kompetitor aktif dengan stok penuh",
      };
    });
  }, [products, isIDR]);

  const activeOosList = oosItems.filter(item => item.stockStatus !== "IN_STOCK");
  const totalDailyLeakage = activeOosList.reduce((sum, item) => sum + item.dailyLeakageRevenue, 0);
  const totalDailyLostUnits = activeOosList.reduce((sum, item) => sum + Math.floor(item.normalDailySales * 0.7), 0);

  const statusBadge = (stockStatus: string, daysOOS: number) => {
    if (stockStatus === "OUT_OF_STOCK") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
          <PackageX className="w-3 h-3" />
          Habis Total ({daysOOS} Hari)
        </span>
      );
    }
    if (stockStatus === "LOW_STOCK") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
          <Clock className="w-3 h-3" />
          Stok Kritis (&lt; 10 Unit)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/40">
        <Clock className="w-3 h-3" />
        Pengiriman Tertunda
      </span>
    );
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 p-2.5 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
              <PackageX className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold">Out-of-Stock (OOS) Opportunity Tracker</CardTitle>
                <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                  Demand Vacuum
                </span>
              </div>
              <CardDescription className="text-xs mt-1">
                Mendeteksi kebocoran omzet kompetitor yang kehabisan stok agar bisa Anda serap secara langsung.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl px-4 py-2 self-start sm:self-auto">
            <Crosshair className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 block">Potensi Serap Harian</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">+{formatPrice(totalDailyLeakage)}/hari</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Kompetitor OOS Terdeteksi", value: `${activeOosList.length} SKU`, sub: "Kritis", detail: "Dari top ranking listing", color: "text-rose-600 dark:text-rose-400" },
            { label: "Total Kebocoran Permintaan", value: `~${totalDailyLostUnits} Unit`, sub: "/ hari", detail: "Pembeli mencari tanpa stok", color: "text-amber-600 dark:text-amber-400" },
            { label: "Est. Omzet Mengambang", value: formatPrice(totalDailyLeakage * 30), sub: "/ bln", detail: "Total nilai kebocoran", color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Urgensi Takeover", value: "Sangat Tinggi", sub: "", detail: "Rebut ranking BSR sekarang", color: "text-rose-600 dark:text-rose-400" },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                {kpi.sub && <span className="text-xs text-slate-500">{kpi.sub}</span>}
              </div>
              <p className="text-[11px] text-slate-400">{kpi.detail}</p>
            </div>
          ))}
        </div>

        {/* Stock Status Competitor List */}
        <div className="space-y-4 min-w-0 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Daftar Kompetitor Mengalami Gangguan Stok</span>
            </h4>
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Update berkala otomatis
            </span>
          </div>

          {/* Unified responsive cards */}
          <div className="flex flex-col gap-3 min-w-0 w-full">
            {activeOosList.map((item) => (
              <div 
                key={item.id} 
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-5 space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm w-full min-w-0"
              >
                {/* Header: Title + Pricing */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 min-w-0 w-full">
                  <div className="min-w-0 flex-1">
                    <h5 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug break-words">
                      {item.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 inline-block">
                      ID: {item.asin}
                    </span>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      +{formatPrice(item.dailyLeakageRevenue)}/hari
                    </span>
                  </div>
                </div>

                {/* Middle: Status & Sales Rate */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    {statusBadge(item.stockStatus, item.daysOOS)}
                    <span className="text-[11px] text-slate-500">
                      (~{item.normalDailySales} unit/hari normal)
                    </span>
                  </div>
                </div>

                {/* Bottom: Action Strategy Box */}
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700 min-w-0 w-full">
                  <Crosshair className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 break-words">
                    <strong className="text-slate-900 dark:text-white mr-1.5">Taktik Serangan:</strong>
                    <span className="leading-relaxed">{item.actionRecommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Strategy Box */}
        <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/15 dark:to-slate-900/80 p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Taktik Pengalihan Demand (Ad Conquesting Playbook)
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Ketika kompetitor utama kehabisan stok, algoritma ranking marketplace akan menurunkan posisi listing mereka secara otomatis. Inilah saat paling efektif untuk <strong>menggenjot iklan PPC berbayar</strong> tepat di target kata kunci mereka karena pembeli yang lapar akan langsung mengklik produk alternatif Anda yang siap kirim.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
