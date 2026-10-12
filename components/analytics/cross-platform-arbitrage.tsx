"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  Flame, 
  Timer, 
  ExternalLink, 
  Sparkles, 
  Video,
  ArrowRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CrossPlatformArbitrageProps {
  keyword: string;
  platform: string;
}

export function CrossPlatformArbitrage({
  keyword,
  platform,
}: CrossPlatformArbitrageProps) {
  const lagTimelineData = [
    { day: "H-14", tiktokViews: 12000, marketSearches: 4200, amazonListings: 12 },
    { day: "H-11", tiktokViews: 45000, marketSearches: 6100, amazonListings: 14 },
    { day: "H-8", tiktokViews: 180000, marketSearches: 11500, amazonListings: 18 },
    { day: "H-5", tiktokViews: 540000, marketSearches: 26000, amazonListings: 22 },
    { day: "H-2", tiktokViews: 890000, marketSearches: 58000, amazonListings: 31 }, 
    { day: "Hari Ini", tiktokViews: 1200000, marketSearches: 94000, amazonListings: 46 },
    { day: "+3 Hari", tiktokViews: 1450000, marketSearches: 135000, amazonListings: 68 },
    { day: "+7 Hari", tiktokViews: 1600000, marketSearches: 180000, amazonListings: 110 },
  ];

  const viralSignals = [
    {
      hashtag: `#${keyword.replace(/\s+/g, "").toLowerCase()}`,
      views: "18.4M Views",
      growth: "+320% minggu ini",
      status: "Exploding Velocity",
    },
    {
      hashtag: `#${keyword.replace(/\s+/g, "").toLowerCase()}hacks`,
      views: "4.2M Views",
      growth: "+145% minggu ini",
      status: "UGC High Intent",
    },
    {
      hashtag: `#tiktokmademebuyit`,
      views: "148.9B Views",
      growth: "Core Tag",
      status: "High Buying Intent",
    },
  ];

  const kpis = [
    { label: "Social Demand Velocity", value: "+380%", sub: "Surge", detail: "TikTok video views spike", color: "text-pink-600 dark:text-pink-400", subColor: "text-pink-600" },
    { label: "Marketplace Supply Ratio", value: "Rendah", sub: "Peluang", detail: "Listing kompetitor masih sedikit", color: "text-emerald-600 dark:text-emerald-400", subColor: "text-emerald-600" },
    { label: "Arbitrage Opportunity Score", value: "92 / 100", sub: "", detail: "Tingkat keuntungan masuk awal", color: "text-indigo-600 dark:text-indigo-400", subColor: "" },
    { label: "Est. Peak Search Date", value: "7-10 Hari", sub: "", detail: "Puncak pencarian di marketplace", color: "text-slate-900 dark:text-white", subColor: "" },
  ];

  return (
    <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 p-2.5 text-pink-600 dark:text-pink-400 border border-pink-200/60 dark:border-pink-800/50">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold">Cross-Platform Trend Arbitrage</CardTitle>
                <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">TikTok → Marketplace</span>
                <span className="rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                  Early Signal
                </span>
              </div>
              <CardDescription className="text-xs mt-1">
                Mendeteksi ledakan viral di media sosial sebelum memuncak di marketplace e-commerce (arbitrase waktu).
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60 rounded-xl px-4 py-2 self-start sm:self-auto">
            <Timer className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-pink-700 dark:text-pink-300 block">Jendela Arbitrase Emas</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">~14-21 Hari Tersisa</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* KPI Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                {kpi.sub && <span className={`text-[10px] font-bold ${kpi.subColor}`}>{kpi.sub}</span>}
              </div>
              <p className="text-[11px] text-slate-400">{kpi.detail}</p>
            </div>
          ))}
        </div>

        {/* Comparison Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Kurva Spillover: TikTok (Pink) mendahului Pencarian Marketplace (Teal)</span>
            <span className="text-pink-600 font-semibold bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-md">14-Day Lead Time</span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lagTimelineData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  dy={8}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }}
                  formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                <Line 
                  name="TikTok Views (Social Signal)" 
                  type="monotone" 
                  dataKey="tiktokViews" 
                  stroke="#ec4899" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#ec4899" }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  name={`Pencarian ${platform} (Marketplace Lag)`} 
                  type="monotone" 
                  dataKey="marketSearches" 
                  stroke="#0d9488" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: "#0d9488" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Viral Hashtags & Playbook */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Viral Signals */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 bg-white dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-pink-500" />
                Trending Social Triggers
              </h4>
              <span className="text-[10px] text-pink-600 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse" />
                Live Signals
              </span>
            </div>

            <div className="space-y-2.5">
              {viralSignals.map((sig, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-100 dark:border-slate-700/50 hover:border-pink-200 dark:hover:border-pink-900 transition-colors">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{sig.hashtag}</span>
                    <span className="text-[10px] text-slate-400">{sig.views}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-pink-600 block">{sig.growth}</span>
                    <span className="text-[10px] text-emerald-600">{sig.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing Playbook */}
          <div className="rounded-xl border border-pink-200/70 dark:border-pink-900/50 bg-gradient-to-br from-pink-50/40 to-white dark:from-pink-950/15 dark:to-slate-900/80 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                Playbook Arbitrase untuk Seller
              </div>
              <ul className="space-y-2.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-pink-500 font-bold shrink-0">01.</span>
                  <span><strong>Segera Inbound Stok:</strong> Permintaan di marketplace diperkirakan meledak dalam 7-14 hari ke depan.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-500 font-bold shrink-0">02.</span>
                  <span><strong>Optimasi Judul Listing:</strong> Sisipkan kata kunci viral dari video TikTok ke judul &amp; backend keywords.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-500 font-bold shrink-0">03.</span>
                  <span><strong>Pasang Harga Sweet Spot:</strong> Pasokan masih langka — pasang harga margin 40%+ tanpa perang harga.</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-pink-200/60 dark:border-pink-800/40 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Modul TikTok TrendScope</span>
              <Button href="/research/tiktok" variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-950/30">
                Riset TikTok
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
