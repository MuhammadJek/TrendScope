"use client";

import { useState } from "react";
import { 
  MessageSquareHeart, 
  AlertTriangle, 
  ThumbsUp, 
  Sparkles, 
  Lightbulb, 
  RefreshCw,
  Quote,
  CheckCircle2,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getVoiceOfCustomerAction } from "@/lib/advanced-analytics-actions";

interface ReviewInsightItem {
  id: string;
  topic: string;
  count: number;
  percentage: number;
  severity: "critical" | "moderate" | "low";
  sampleQuotes: string[];
  suggestedAction: string;
}

interface VoCReviewMiningProps {
  keyword: string;
  platform: string;
  products?: any[];
}

export function VoCReviewMining({ keyword, platform, products = [] }: VoCReviewMiningProps) {
  const [activeTab, setActiveTab] = useState<"pain_points" | "positive_praise" | "unmet_needs">("pain_points");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(76);

  const [painPoints, setPainPoints] = useState<ReviewInsightItem[]>([
    {
      id: "p1",
      topic: "Ukuran & Fitting Tidak Konsisten",
      count: 142,
      percentage: 38,
      severity: "critical",
      sampleQuotes: [
        "Pesan ukuran L tapi pas dipakai rasanya seperti M, sempit di bagian bahu.",
        "Saran saya naikkan 1 nomor dari ukuran normal, cutting-nya agak mengecil."
      ],
      suggestedAction: "Buat panduan size chart presisi (dengan toleransi cm) & sertakan testimoni tinggi/berat model."
    },
    {
      id: "p2",
      topic: "Ketahanan Material & Jahitan Tipis",
      count: 86,
      percentage: 23,
      severity: "critical",
      sampleQuotes: [
        "Jahitannya di ujung kerah agak renggang, setelah dicuci 2 kali mulai terurai.",
        "Bahan sedikit lebih tipis dari ekspektasi di foto katalog."
      ],
      suggestedAction: "Gunakan double-stitch finishing dan pertegas gramasi bahan (misal cotton 24s/28s) sebagai nilai jual."
    },
    {
      id: "p3",
      topic: "Kemasan Pengiriman Kurang Protektif",
      count: 45,
      percentage: 12,
      severity: "moderate",
      sampleQuotes: [
        "Kotak kardus luarnya penyok saat tiba, untung produk di dalamnya masih aman.",
        "Hanya dibungkus plastik polymailer tipis tanpa bubble wrap."
      ],
      suggestedAction: "Investasi ke custom hard-box atau double polymailer untuk menaikkan unboxing experience & rating bintang 5."
    }
  ]);

  const [positivePraises, setPositivePraises] = useState([
    {
      id: "pos1",
      feature: "Desain Minimalis & Estetika Modern",
      percentage: 54,
      quotes: ["Modelnya clean banget, cocok dipakai harian maupun semi-formal.", "Warna aslinya persis sama dengan yang ada di display foto katalog."]
    },
    {
      id: "pos2",
      feature: "Kenyamanan Dipakai Seharian",
      percentage: 41,
      quotes: ["Adem dan menyerap keringat dengan baik walau dipakai di cuaca terik.", "Bobotnya ringan dan tidak kaku."]
    },
    {
      id: "pos3",
      feature: "Value for Money / Harga Terjangkau",
      percentage: 36,
      quotes: ["Untuk harga segini kualitasnya sangat melebihi ekspektasi dibanding brand mall."]
    }
  ]);

  const [unmetNeeds, setUnmetNeeds] = useState([
    {
      id: "req1",
      title: "Varian Warna Earth Tone & Pastel",
      demandLevel: "Tinggi (62 permintaan pembeli)",
      opportunity: "Kompetitor saat ini mayoritas hanya menjual warna hitam/putih/navy.",
      verdict: "Peluang Diferensiasi Cepat"
    },
    {
      id: "req2",
      title: "Fitur Tambahan (Saku Rahasia / Water Repellent)",
      demandLevel: "Sedang (34 permintaan pembeli)",
      opportunity: "Pembeli bersedia membayar 15-20% lebih mahal jika ada saku beresleting tambahan.",
      verdict: "Potensi Premium Tier"
    },
    {
      id: "req3",
      title: "Paket Bundle Hemat (Twin Pack / Mix Color)",
      demandLevel: "Tinggi (78 permintaan pembeli)",
      opportunity: "Banyak pembeli yang ingin langsung membeli 2 pcs dengan diskon bundle.",
      verdict: "Peningkatan AOV (Average Order Value)"
    }
  ]);

  const handleRefreshVoC = async () => {
    setIsAnalyzing(true);
    try {
      const res = await getVoiceOfCustomerAction(keyword, platform);
      if (res.success && res.data) {
        if (res.data.sentimentScore) setSentimentScore(res.data.sentimentScore);
        if (res.data.painPoints?.length) setPainPoints(res.data.painPoints);
        if (res.data.unmetNeeds?.length) setUnmetNeeds(res.data.unmetNeeds);
        if (res.data.positivePraises?.length) setPositivePraises(res.data.positivePraises);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const subtabs = [
    {
      key: "pain_points" as const,
      label: "Titik Kelemahan Kompetitor",
      icon: AlertTriangle,
      count: painPoints.length,
      activeColor: "bg-rose-500 text-white shadow-lg shadow-rose-500/20",
    },
    {
      key: "unmet_needs" as const,
      label: "Celah Produk & Permintaan",
      icon: Lightbulb,
      count: unmetNeeds.length,
      activeColor: "bg-amber-500 text-white shadow-lg shadow-amber-500/20",
    },
    {
      key: "positive_praise" as const,
      label: "Faktor Bintang 5",
      icon: ThumbsUp,
      count: positivePraises.length,
      activeColor: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
    },
  ];

  return (
    <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
      
      <CardHeader className="pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-2.5 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/50">
              <MessageSquareHeart className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-bold">Voice of Customer (VoC) & Review Gap Mining</CardTitle>
                <span className="rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                  AI NLP
                </span>
              </div>
              <CardDescription className="text-xs mt-1">
                Ekstraksi ribuan ulasan pembeli kompetitor untuk menemukan komplain utama & celah produk baru.
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshVoC} 
            disabled={isAnalyzing}
            className="gap-1.5 text-xs h-9 self-start sm:self-auto border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
            {isAnalyzing ? "Menganalisis Review..." : "Perbarui Mining"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPI Score Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Customer Sentiment", value: `${sentimentScore}%`, sub: "Positif", detail: "Dari ~1,450 ulasan teranalisis", color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Top Critical Complaint", value: "38%", sub: "Size & Fitting", detail: "Titik komplain terbesar", color: "text-rose-600 dark:text-rose-400" },
            { label: "Unmet Wishlist Count", value: "3 Pola", sub: "Fitur Baru", detail: "Permintaan belum terjawab", color: "text-amber-600 dark:text-amber-400" },
            { label: "Product Gap Opportunity", value: "Tinggi", sub: "★★★★☆", detail: "Mudah mengungguli kompetitor", color: "text-indigo-600 dark:text-indigo-400" },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                <span className="text-xs text-slate-500">{kpi.sub}</span>
              </div>
              <p className="text-[11px] text-slate-400">{kpi.detail}</p>
            </div>
          ))}
        </div>

        {/* Sub-navigation Filter */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1" style={{ scrollbarWidth: "none" }}>
          {subtabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive ? tab.activeColor : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? "bg-white/25" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pain Points Tab */}
        {activeTab === "pain_points" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Ulasan bintang 1-2 kompetitor diekstraksi untuk memetakan alasan retur dan kekecewaan pembeli.
            </p>
            <div className="grid gap-4">
              {painPoints.map((item) => (
                <div 
                  key={item.id}
                  className="rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/40 to-white dark:from-rose-950/10 dark:to-slate-900/80 p-5 space-y-4 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/10" />
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.topic}</h4>
                      <span className="rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5">
                        {item.percentage}% ({item.count} Ulasan)
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                      item.severity === "critical" 
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400" 
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                    }`}>
                      Urgensi: {item.severity === "critical" ? "Tinggi" : "Sedang"}
                    </span>
                  </div>

                  {/* Sample Quotes */}
                  <div className="space-y-2 pl-4 border-l-2 border-rose-200 dark:border-rose-800/60">
                    {item.sampleQuotes.map((q, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                        <Quote className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>&ldquo;{q}&rdquo;</span>
                      </div>
                    ))}
                  </div>

                  {/* Actionable Solution */}
                  <div className="flex items-start gap-2.5 bg-white dark:bg-slate-900/80 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 text-xs shadow-sm">
                    <div className="rounded-lg bg-purple-50 dark:bg-purple-950/40 p-1.5 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block mb-0.5">Solusi Menang Produk Baru:</strong>
                      <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.suggestedAction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unmet Needs Tab */}
        {activeTab === "unmet_needs" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Permintaan fitur yang berulang kali disebut pembeli namun belum dipenuhi seller kompetitor di pasar ini.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {unmetNeeds.map((need) => (
                <div 
                  key={need.id} 
                  className="rounded-xl border border-amber-200/70 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/15 dark:to-slate-900/80 p-5 flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="inline-flex rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 text-[10px] font-bold tracking-wide">
                      {need.verdict}
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">{need.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {need.opportunity}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-amber-200/50 dark:border-amber-800/40 text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Volume Sinyal: {need.demandLevel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Positive Praise Tab */}
        {activeTab === "positive_praise" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Hal-hal yang paling disukai pembeli pada produk terlaris saat ini (wajib dipertahankan/direplikasi).
            </p>
            <div className="grid gap-4">
              {positivePraises.map((pos) => (
                <div 
                  key={pos.id}
                  className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/40 to-white dark:from-emerald-950/10 dark:to-slate-900/80 p-5 space-y-3 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/60 p-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{pos.feature}</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                      Disukai {pos.percentage}% Pembeli
                    </span>
                  </div>
                  <div className="space-y-1.5 pl-10">
                    {pos.quotes.map((q, idx) => (
                      <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                        &ldquo;{q}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
