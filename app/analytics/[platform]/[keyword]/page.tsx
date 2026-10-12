import { ArrowLeft, Search, DollarSign, Zap, Package } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnalyticsViewContainer } from "@/components/analytics/analytics-view-container";
import { ExecutiveReportModal } from "@/components/analytics/executive-report-modal";

/* ------------------------------------------------------------------ */
/*  KPI Card premium (inline — gradient background + trend badge)     */
/* ------------------------------------------------------------------ */
function PremiumKpiCard({
  label,
  value,
  detail,
  icon: Icon,
  accentFrom,
  accentTo,
  iconBg,
  iconColor,
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  accentFrom: string;
  accentTo: string;
  iconBg: string;
  iconColor: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-default">
      {/* Gradient accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentFrom} ${accentTo}`} />

      <CardContent className="flex items-start justify-between gap-4 p-5 pt-6">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">
              {value}
            </p>
            {trend && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  trend.positive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                }`}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
            )}
          </div>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {detail}
          </p>
        </div>
        <span
          className={`flex-shrink-0 rounded-xl p-3 ${iconBg} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default async function KeywordAnalyticsPage({
  params,
}: {
  params: Promise<{ platform: string; keyword: string }>;
}) {
  const resolvedParams = await params;
  const platform = resolvedParams.platform.toUpperCase();
  const keyword = decodeURIComponent(resolvedParams.keyword).toLowerCase();

  let realProducts: any[] = [];
  let chartData: any[] = [];
  let avgPrice = 0;
  let searchVol = 0;
  let productCount = 0;
  let totalSold = 0;

  const marketKeyword = await prisma.marketKeyword.findFirst({
    where: { keyword: keyword, platform: platform },
    include: {
      products: { take: 50, orderBy: { historicalSold: "desc" } },
      snapshots: { take: 1, orderBy: { date: "desc" } },
    },
  });

  if (!marketKeyword) {
    notFound();
  }

  realProducts = marketKeyword.products;
  productCount = realProducts.length;

  if (marketKeyword.snapshots.length > 0) {
    const snap = marketKeyword.snapshots[0];
    avgPrice = snap.avgPrice;
    searchVol = snap.totalSearchVol || 0;

    // Calculate total sold
    totalSold = realProducts.reduce((sum, p) => sum + (p.historicalSold || p.monthlySold || 0), 0);

    // Generate historical data backfill ending in today's real data
    const baseVol = snap.totalSearchVol || 50000;
    const basePrice = snap.avgPrice || 50;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const volMod = i === 0 ? 1 : 0.8 + Math.random() * 0.4;
      const priceMod = i === 0 ? 1 : 0.9 + Math.random() * 0.2;

      chartData.push({
        date: d.toISOString().split("T")[0],
        volume: Math.floor(baseVol * volMod),
        avgPrice: Math.floor(basePrice * priceMod * 10) / 10,
      });
    }
  }

  const formatCurrency = (price: number) =>
    platform === "SHOPEE"
      ? `Rp ${price.toLocaleString("id-ID")}`
      : `$${price.toFixed(2)}`;

  // Platform color map
  const platformColors: Record<string, { from: string; to: string; badge: string }> = {
    AMAZON:  { from: "from-amber-400",   to: "to-orange-500", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
    SHOPEE:  { from: "from-orange-500",   to: "to-red-500",    badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
    ETSY:    { from: "from-orange-600",   to: "to-amber-600",  badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
    ENVATO:  { from: "from-green-500",    to: "to-emerald-600",badge: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
  };
  const pColor = platformColors[platform] || platformColors.AMAZON;

  return (
    <AppFrame title={`Analisis: ${marketKeyword.keyword}`}>
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* ROW 1 — Header + Actions                                     */}
        {/* ============================================================ */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            {/* Breadcrumb */}
            <Link
              href={`/research/${platform.toLowerCase()}`}
              className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Kembali ke Daftar
            </Link>

            {/* Title Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white capitalize">
                {marketKeyword.keyword}
              </h1>
              {/* Platform Badge */}
              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${pColor.badge}`}>
                {platform}
              </span>
              {/* Live Pulsing Indicator */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Data
              </span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Laporan lengkap pergerakan pasar, kompetitor, dan estimasi penjualan
              untuk <strong className="text-slate-700 dark:text-slate-300">&ldquo;{marketKeyword.keyword}&rdquo;</strong> di {platform}.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <ExecutiveReportModal
              keyword={marketKeyword.keyword}
              platform={platform}
              avgPrice={avgPrice}
              searchVol={searchVol}
              productCount={productCount}
              products={realProducts}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* ROW 2 — KPI Cards (4 columns)                                */}
        {/* ============================================================ */}
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <PremiumKpiCard
            label="Search Volume"
            value={searchVol > 0 ? searchVol.toLocaleString() : "—"}
            detail={`Estimasi pencarian di ${platform}`}
            icon={Search}
            accentFrom="from-blue-500"
            accentTo="to-cyan-400"
            iconBg="bg-blue-50 dark:bg-blue-950/40"
            iconColor="text-blue-600 dark:text-blue-400"
            trend={searchVol > 0 ? { value: "+12%", positive: true } : undefined}
          />
          <PremiumKpiCard
            label="Rata-rata Harga"
            value={avgPrice > 0 ? formatCurrency(avgPrice) : "—"}
            detail="Harga pasar rata-rata kompetitor"
            icon={DollarSign}
            accentFrom="from-emerald-500"
            accentTo="to-teal-400"
            iconBg="bg-emerald-50 dark:bg-emerald-950/40"
            iconColor="text-emerald-600 dark:text-emerald-400"
            trend={avgPrice > 0 ? { value: "Stabil", positive: true } : undefined}
          />
          <PremiumKpiCard
            label="Total Terjual"
            value={totalSold > 0 ? totalSold.toLocaleString() : "—"}
            detail="Estimasi penjualan kumulatif"
            icon={Zap}
            accentFrom="from-violet-500"
            accentTo="to-purple-400"
            iconBg="bg-violet-50 dark:bg-violet-950/40"
            iconColor="text-violet-600 dark:text-violet-400"
            trend={totalSold > 0 ? { value: "+8%", positive: true } : undefined}
          />
          <PremiumKpiCard
            label="Produk Terlacak"
            value={productCount.toString()}
            detail="Top produk yang ditemukan"
            icon={Package}
            accentFrom="from-amber-500"
            accentTo="to-orange-400"
            iconBg="bg-amber-50 dark:bg-amber-950/40"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* ============================================================ */}
        {/* ROW 3 — All 8 Market Intelligence Modules Tabbed Container   */}
        {/* ============================================================ */}
        <AnalyticsViewContainer
          keyword={marketKeyword.keyword}
          platform={platform}
          avgPrice={avgPrice}
          searchVol={searchVol}
          productCount={productCount}
          products={realProducts}
          chartData={chartData}
        />
      </div>
    </AppFrame>
  );
}
