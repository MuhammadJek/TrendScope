"use client";

import { useState } from "react";
import { 
  BarChart3, 
  MessageSquareHeart, 
  Target, 
  Building2, 
  Flame, 
  PackageX, 
  Calculator, 
  BellRing, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MultiKeywordTrendChart, TopCompetitorsTable } from "@/components/mock-market-charts";
import { AiInsightCard } from "@/components/ai-insight-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// The 8 Newly Built Feature Components
import { VoCReviewMining } from "./voc-review-mining";
import { PriceDistributionRadar } from "./price-distribution-radar";
import { MarketConcentrationMatrix } from "./market-concentration-matrix";
import { CrossPlatformArbitrage } from "./cross-platform-arbitrage";
import { OOSOpportunityTracker } from "./oos-opportunity-tracker";
import { UnitEconomicsCalculator } from "./unit-economics-calculator";
import { SmartMarketAlerts } from "./smart-market-alerts";
import { ExecutiveReportModal } from "./executive-report-modal";

interface AnalyticsViewContainerProps {
  keyword: string;
  platform: string;
  avgPrice: number;
  searchVol: number;
  productCount: number;
  products: any[];
  chartData: any[];
}

type TabId = "overview" | "voc" | "pricing" | "monopoly" | "arbitrage" | "oos" | "calculator" | "alerts";

const navTabs: { id: TabId; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "voc", label: "VoC Review", icon: MessageSquareHeart },
  { id: "pricing", label: "Sweet Spot", icon: Target },
  { id: "monopoly", label: "Monopoli (HHI)", icon: Building2 },
  { id: "arbitrage", label: "Arbitrage", icon: Flame },
  { id: "oos", label: "OOS Tracker", icon: PackageX },
  { id: "calculator", label: "Kalkulator", icon: Calculator },
  { id: "alerts", label: "Smart Alerts", icon: BellRing },
];

const overviewShortcuts = [
  {
    id: "pricing" as TabId,
    icon: Target,
    title: "Price Sweet Spot Radar",
    desc: "52% volume pasar terkonsentrasi di satu rentang harga.",
    gradient: "from-teal-500/20 to-emerald-500/10",
    borderHover: "hover:border-teal-400 dark:hover:border-teal-600",
    iconBg: "bg-teal-50 dark:bg-teal-950/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    titleHover: "group-hover:text-teal-600",
  },
  {
    id: "voc" as TabId,
    icon: MessageSquareHeart,
    title: "Voice of Customer (VoC) Mining",
    desc: "Temukan keluhan utama & celah produk belum terpenuhi.",
    gradient: "from-purple-500/20 to-pink-500/10",
    borderHover: "hover:border-purple-400 dark:hover:border-purple-600",
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    titleHover: "group-hover:text-purple-600",
  },
  {
    id: "monopoly" as TabId,
    icon: Building2,
    title: "Market Concentration (HHI Index)",
    desc: "Cek apakah pasar monopoli atau terfragmentasi terbuka.",
    gradient: "from-indigo-500/20 to-blue-500/10",
    borderHover: "hover:border-indigo-400 dark:hover:border-indigo-600",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    titleHover: "group-hover:text-indigo-600",
  },
  {
    id: "oos" as TabId,
    icon: PackageX,
    title: "Out-of-Stock Opportunity",
    desc: "Serap kebocoran omzet kompetitor yang kehabisan stok.",
    gradient: "from-amber-500/20 to-rose-500/10",
    borderHover: "hover:border-amber-400 dark:hover:border-amber-600",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleHover: "group-hover:text-amber-600",
  },
];

export function AnalyticsViewContainer({
  keyword,
  platform,
  avgPrice,
  searchVol,
  productCount,
  products = [],
  chartData = [],
}: AnalyticsViewContainerProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="space-y-8">
      {/* ── Horizontal Feature Tabs Bar ── */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-14 z-20">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1" style={{ scrollbarWidth: "none" }}>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold 
                    whitespace-nowrap transition-all duration-200 shrink-0
                    ${isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400 dark:text-indigo-600" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="hidden sm:flex items-center shrink-0">
            <ExecutiveReportModal
              keyword={keyword}
              platform={platform}
              avgPrice={avgPrice}
              searchVol={searchVol}
              productCount={productCount}
              products={products}
            />
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}

      {/* Tab 1: Overview & Tren */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Trend Chart + AI Insight */}
          <div className="grid gap-6 xl:grid-cols-[1.85fr_1fr]">
            <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 p-2.5 border border-teal-100 dark:border-teal-900/50">
                    <BarChart3 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Keyword Demand Trend</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Pergerakan volume pencarian &amp; rata-rata harga pasar 7 hari terakhir.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MultiKeywordTrendChart chartData={chartData} keyword={keyword} />
              </CardContent>
            </Card>

            {/* AI Insight — glowing border */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-pink-500/20 rounded-2xl blur-xl opacity-50 dark:opacity-30 pointer-events-none animate-pulse" style={{ animationDuration: "4s" }} />
              <div className="relative h-full">
                <AiInsightCard
                  keyword={keyword}
                  platform={platform}
                  products={products.map((p) => ({
                    title: p.title || p.name || "",
                    price: p.price || 0,
                    historicalSold: p.historicalSold || 0,
                    monthlySold: p.monthlySold || 0,
                  }))}
                  avgPrice={avgPrice}
                  totalProducts={products.length}
                />
              </div>
            </div>
          </div>

          {/* Feature Discovery Cards (quick links to other tabs) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Fitur Intelijen Lanjutan
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {overviewShortcuts.map((shortcut) => {
                const ShortcutIcon = shortcut.icon;
                return (
                  <button
                    key={shortcut.id}
                    onClick={() => setActiveTab(shortcut.id)}
                    className={`
                      group p-4 rounded-xl border border-slate-200 dark:border-slate-800 
                      bg-white dark:bg-slate-900/80 
                      ${shortcut.borderHover} 
                      cursor-pointer transition-all duration-300 
                      flex items-center justify-between 
                      shadow-sm hover:shadow-md text-left
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${shortcut.iconBg} ${shortcut.iconColor} transition-transform group-hover:scale-110 duration-300`}>
                        <ShortcutIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold text-slate-900 dark:text-white ${shortcut.titleHover} transition-colors`}>
                          {shortcut.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{shortcut.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-1 group-hover:text-slate-500 transition-all duration-200" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Competitor Table */}
          <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-2.5 border border-slate-200 dark:border-slate-700">
                  <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Top Winning Products</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Produk kompetitor yang menguasai pencarian dengan tingkat penjualan tertinggi.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <TopCompetitorsTable products={products} platform={platform} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Voice of Customer (VoC) & Review Gap Mining */}
      {activeTab === "voc" && (
        <VoCReviewMining keyword={keyword} platform={platform} products={products} />
      )}

      {/* Tab 3: Price Elasticity & Sweet Spot Radar */}
      {activeTab === "pricing" && (
        <PriceDistributionRadar products={products} platform={platform} avgPrice={avgPrice} />
      )}

      {/* Tab 4: Market Concentration Matrix (HHI) */}
      {activeTab === "monopoly" && (
        <MarketConcentrationMatrix products={products} platform={platform} />
      )}

      {/* Tab 5: Cross-Platform Trend Arbitrage */}
      {activeTab === "arbitrage" && (
        <CrossPlatformArbitrage keyword={keyword} platform={platform} />
      )}

      {/* Tab 6: Out-of-Stock Opportunity Tracker */}
      {activeTab === "oos" && (
        <OOSOpportunityTracker products={products} platform={platform} />
      )}

      {/* Tab 7: Unit Economics Calculator */}
      {activeTab === "calculator" && (
        <UnitEconomicsCalculator platform={platform} defaultPrice={avgPrice} />
      )}

      {/* Tab 8: Smart Alerts & Anomaly Detection */}
      {activeTab === "alerts" && (
        <SmartMarketAlerts keyword={keyword} platform={platform} />
      )}
    </div>
  );
}
